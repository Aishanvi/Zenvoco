from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings

# Initialize Motor (MongoDB Async Driver)
client = AsyncIOMotorClient(settings.MONGO_URI)
db = client["Zenvoco_db"]

# Connecting to corresponding collections matching JSONs
users_collection = db["users"]
practice_collection = db["practice_sessions"]
speech_collection = db["speech_analysis"]
tasks_collection = db["daily_tasks"]
progress_collection = db["progress"]