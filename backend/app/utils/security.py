import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import bcrypt

from app.core.config import settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def generate_reset_token() -> str:
    """Generate a high-entropy URL-safe token for password reset."""
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    """Deterministic hash for storing/looking up reset tokens."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def validate_password_strength(password: str) -> str | None:
    """Returns an error message if password is too weak, None if OK."""
    if len(password) < 8:
        return "Le mot de passe doit contenir au moins 8 caractères"
    if not any(c.isupper() for c in password):
        return "Le mot de passe doit contenir au moins une majuscule"
    if not any(c.islower() for c in password):
        return "Le mot de passe doit contenir au moins une minuscule"
    if not any(c.isdigit() for c in password):
        return "Le mot de passe doit contenir au moins un chiffre"
    return None


def create_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def verify_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None
