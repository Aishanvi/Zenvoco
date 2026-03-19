from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env", verbose=True)
print("🔥 ENV FILE LOADED")
print("🔥 MONGO URI:", os.getenv("MONGO_URI"))

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

# Open Bridge for local UI development Cross-Origin boundaries
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:3000", 
        "https://zenvoco.vercel.app"
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
