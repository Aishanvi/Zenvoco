from datetime import datetime, timezone
from typing import Any

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, Response

from auth.jwt_handler import get_current_user_id
from database import practice_collection, progress_collection, users_collection
from services.progress_graph_service import build_progress_graph_svg

router = APIRouter(prefix="/progress", tags=["Progress Monitoring"])

MAX_TIMELINE_POINTS = 60
FETCH_BUFFER = 500


def _parse_progress_date(value: Any) -> datetime | None:
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value

    if isinstance(value, str) and value.strip():
        cleaned = value.strip()
        if cleaned.endswith("Z"):
            cleaned = cleaned[:-1] + "+00:00"
        try:
            parsed = datetime.fromisoformat(cleaned)
        except ValueError:
            return None
        if parsed.tzinfo is None:
            return parsed.replace(tzinfo=timezone.utc)
        return parsed

    return None


def _serialize_progress_date(value: Any) -> str | None:
    parsed = _parse_progress_date(value)
    if not parsed:
        return None
    return parsed.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _safe_int(value: Any, default: int = 0) -> int:
    try:
        return int(round(float(value)))
    except (TypeError, ValueError):
        return default


async def _build_progress_analytics(user_id: str) -> dict:
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    records = await progress_collection.find({"user_id": user_id}).to_list(length=FETCH_BUFFER)
    records.sort(
        key=lambda record: (
            _parse_progress_date(record.get("date")) or datetime.min.replace(tzinfo=timezone.utc),
            str(record.get("_id", "")),
        )
    )
    records = records[-MAX_TIMELINE_POINTS:]

    session_ids = [
        ObjectId(record["session_id"])
        for record in records
        if isinstance(record.get("session_id"), str) and ObjectId.is_valid(record["session_id"])
    ]

    session_topics: dict[str, str] = {}
    if session_ids:
        sessions = await practice_collection.find(
            {"_id": {"$in": session_ids}, "user_id": user_id}
        ).to_list(length=len(session_ids))
        session_topics = {
            str(session["_id"]): session.get("topic", "Practice Session")
            for session in sessions
        }

    fallback_sessions = await practice_collection.find({"user_id": user_id}).sort("created_at", 1).limit(
        MAX_TIMELINE_POINTS
    ).to_list(length=MAX_TIMELINE_POINTS)
    fallback_topics = [session.get("topic", "Practice Session") for session in fallback_sessions]

    timeline = []
    for index, record in enumerate(records):
        session_id = record.get("session_id")
        timeline.append(
            {
                "id": str(record["_id"]),
                "session_id": session_id,
                "date": _serialize_progress_date(record.get("date")),
                "confidence_score": _safe_int(record.get("confidence_score")),
                "duration": _safe_int(record.get("duration")),
                "topic": session_topics.get(session_id)
                or (fallback_topics[index] if index < len(fallback_topics) else "Practice Session"),
            }
        )

    latest_score = timeline[-1]["confidence_score"] if timeline else 0
    avg_duration = (
        sum(item.get("duration", 0) for item in timeline) // len(timeline)
        if timeline
        else 0
    )

    return {
        "user_id": user_id,
        "total_sessions": len(timeline),
        "latest_confidence_score": latest_score,
        "avg_duration": avg_duration,
        "timeline_metrics": timeline,
    }


@router.get("/")
async def retrieve_analytics_timeline(user_id: str = Depends(get_current_user_id)):
    """
    Returns the complete confidence score timeline of the logged-in user,
    enriched with the topic from the originating practice session.
    Used for Chart.js / Recharts dashboard visualizations.
    """

    return await _build_progress_analytics(user_id)


@router.get("/graph")
async def retrieve_progress_graph(
    width: int = Query(960, ge=480, le=1600),
    height: int = Query(420, ge=280, le=900),
    user_id: str = Depends(get_current_user_id),
):
    """
    Returns the authenticated user's progress timeline as an SVG line graph.
    Useful when the frontend needs a generated image instead of raw chart data.
    """

    analytics = await _build_progress_analytics(user_id)
    graph_svg = build_progress_graph_svg(
        analytics["timeline_metrics"],
        width=width,
        height=height,
    )
    return Response(content=graph_svg, media_type="image/svg+xml")
