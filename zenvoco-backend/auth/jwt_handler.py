from datetime import datetime, timedelta
import base64
import hashlib
import hmac
import secrets

import bcrypt
from jose import jwt, JWTError
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from config.settings import settings

security = HTTPBearer()

PBKDF2_ALGORITHM = "sha256"
PBKDF2_ITERATIONS = 600000
PBKDF2_SCHEME = "pbkdf2_sha256"
PBKDF2_SALT_BYTES = 16


def _b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("ascii").rstrip("=")


def _b64decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def get_password_hash(password: str) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256."""
    salt = secrets.token_bytes(PBKDF2_SALT_BYTES)
    derived_key = hashlib.pbkdf2_hmac(
        PBKDF2_ALGORITHM,
        password.encode("utf-8"),
        salt,
        PBKDF2_ITERATIONS,
    )
    return (
        f"{PBKDF2_SCHEME}${PBKDF2_ITERATIONS}"
        f"${_b64encode(salt)}${_b64encode(derived_key)}"
    )


def _verify_pbkdf2_password(plain_password: str, hashed_password: str) -> bool:
    try:
        scheme, iterations, salt, expected_hash = hashed_password.split("$", 3)
        if scheme != PBKDF2_SCHEME:
            return False

        derived_key = hashlib.pbkdf2_hmac(
            PBKDF2_ALGORITHM,
            plain_password.encode("utf-8"),
            _b64decode(salt),
            int(iterations),
        )
        return hmac.compare_digest(_b64encode(derived_key), expected_hash)
    except (TypeError, ValueError):
        return False


def _verify_bcrypt_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )
    except (TypeError, ValueError):
        return False


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password for both new PBKDF2 hashes and legacy bcrypt hashes."""
    if hashed_password.startswith(f"{PBKDF2_SCHEME}$"):
        return _verify_pbkdf2_password(plain_password, hashed_password)

    if hashed_password.startswith("$2"):
        return _verify_bcrypt_password(plain_password, hashed_password)

    return False

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=24)) -> str:
    """Generate JWT Token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """Decode JWT to extract user ID for secure endpoints."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Expired or Invalid token")
