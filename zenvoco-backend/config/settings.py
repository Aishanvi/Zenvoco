import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

class Settings:
    PROJECT_NAME = "Zenvoco API"
    MONGO_URI = os.getenv("MONGO_URI")
    JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-key")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY", "")
    LIVE_SERVER_API_KEY = os.getenv("LIVE_SERVER_API_KEY", "")

settings = Settings()
