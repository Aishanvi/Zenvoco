from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os

load_dotenv()

# Explicit Router integration from distinct application spaces
from routes import auth_routes
from routes import practice_routes
from routes import speech_routes
from routes import task_routes
from routes import progress_routes
from routes import user_routes
from routes import dashboard_routes

app = FastAPI(
    title="Zenvoco backend", 
    description="Advanced API serving GenAI Communication Analysis",
    version="2.0.0"
)

# Restrict Cross-Origin boundaries to trusted frontends only
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "https://zenvoco-frontend.vercel.app", # Adjust if using a different production URL
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Live Server Access Control Middleware
@app.middleware("http")
async def live_server_access_control(request: Request, call_next):
    # Allow unrestricted access to the health check and documentation
    if request.url.path in ["/", "/docs", "/openapi.json", "/redoc"]:
        return await call_next(request)
    
    server_key = os.getenv("LIVE_SERVER_API_KEY", "zenvoco-secure-key-24211a05le")
    client_key = request.headers.get("X-Live-Server-Key")
    
    if client_key != server_key:
        return JSONResponse(
            status_code=403,
            content={"detail": "Unauthorized: Invalid or missing Live Server Access Key"}
        )
        
    return await call_next(request)

# Application Endpoint Registrations
app.include_router(auth_routes.router)
app.include_router(practice_routes.router)
app.include_router(speech_routes.router)
app.include_router(task_routes.router)
app.include_router(progress_routes.router)
app.include_router(user_routes.router)
app.include_router(dashboard_routes.router)

@app.get("/", tags=["Health Index"])
def API_Health():
    return {
        "system_status": "Operational",
        "description": "Zenvoco Analytics Matrix Backend",
        "docs": "Navigate to /docs to enter Swagger UI"
    }
