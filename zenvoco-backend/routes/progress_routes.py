from fastapi import APIRouter, Depends, HTTPException
from auth.jwt_handler import get_current_user_id
from database import progress_collection, users_collection, practice_collection
from bson import ObjectId

router = APIRouter(prefix="/progress", tags=["Progress Monitoring"])


@router.get("/")
async def retrieve_analytics_timeline(user_id: str = Depends(get_current_user_id)):
    """
    Returns the complete confidence score timeline of the logged-in user,
    enriched with the topic from the originating practice session.
    Used for Chart.js / Recharts dashboard visualizations.
    """

    # 1️⃣ Verify user exists
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2️⃣ Fetch progress records (chronological, max 60)
    cursor = progress_collection.find(
        {"user_id": user_id}
    ).sort("date", 1).limit(60)

    records = await cursor.to_list(length=60)

    # 3️⃣ Extract unique session_ids referenced in progress records
    #    Progress records are inserted by practice_routes.py at submit time,
    #    but the progress collection does NOT store session_id yet — so we
    #    do a parallel lookup of the user's sessions ordered by date to align topics.
    # 
    #    Strategy: fetch all practice sessions for the user (sorted by created_at ASC),
    #    then zip them with the progress records by position. This is accurate because
    #    every submit creates exactly one progress entry at the same moment.
    session_cursor = practice_collection.find(
        {"user_id": user_id}
    ).sort("created_at", 1).limit(60)
    sessions = await session_cursor.to_list(length=60)

    # Build a position-indexed topic map (index → topic string)
    topic_map = {i: s.get("topic", "Practice Session") for i, s in enumerate(sessions)}

    # 4️⃣ Convert ObjectId → string and build timeline with topic
    timeline = []
    for i, record in enumerate(records):
        record["_id"] = str(record["_id"])
        timeline.append({
            "date": record.get("date"),
            "confidence_score": record.get("confidence_score", 0),
            "duration": record.get("duration", 0),
            "topic": topic_map.get(i, "Practice Session"),
        })

    # 5️⃣ Latest confidence score
    latest_score = timeline[-1]["confidence_score"] if timeline else 0

    # 6️⃣ Calculate Average Duration
    avg_duration = 0
    if timeline:
        total_duration = sum(t.get("duration", 0) for t in timeline)
        avg_duration = total_duration // len(timeline)

    return {
        "user_id": user_id,
        "total_sessions": len(timeline),
        "latest_confidence_score": latest_score,
        "avg_duration": avg_duration,
        "timeline_metrics": timeline
    }