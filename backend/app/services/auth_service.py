from datetime import datetime, timedelta, timezone

from app.core.config import settings
from app.database.connection import get_supabase
from app.utils.security import (
    hash_password,
    verify_password,
    create_token,
    generate_reset_token,
    hash_token,
)


def authenticate_user(email: str, password: str):
    supabase = get_supabase()
    response = supabase.table("users").select("*").eq("email", email).single().execute()
    user = response.data

    if not user or not verify_password(password, user["password_hash"]):
        return None

    token = create_token({"sub": str(user["id"]), "email": user["email"], "role": user["role"]})
    return {"token": token, "user": {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]}}


def create_user(name: str, email: str, password: str, role: str = "editor"):
    supabase = get_supabase()
    user_data = {
        "name": name,
        "email": email,
        "password_hash": hash_password(password),
        "role": role,
        "status": "active",
    }
    response = supabase.table("users").insert(user_data).execute()
    if not response.data:
        raise RuntimeError("Insert échoué — vérifiez RLS ou SUPABASE_KEY (service_role requis)")
    return response.data[0]


def create_password_reset_token(email: str):
    """Create a reset token for the user with this email.

    Returns (raw_token, user) on success, or None if no such user exists.
    The raw token is returned once and only its hash is persisted.
    """
    supabase = get_supabase()
    response = supabase.table("users").select("id, name, email").eq("email", email).execute()
    if not response.data:
        return None
    user = response.data[0]

    raw_token = generate_reset_token()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.RESET_TOKEN_EXPIRE_MINUTES)

    supabase.table("password_reset_tokens").insert({
        "user_id": user["id"],
        "token_hash": hash_token(raw_token),
        "expires_at": expires_at.isoformat(),
        "used": False,
    }).execute()

    return raw_token, user


def reset_password_with_token(token: str, new_password: str) -> bool:
    """Validate the token and update the user's password. Returns False if invalid/expired."""
    supabase = get_supabase()
    token_hash = hash_token(token)

    result = (
        supabase.table("password_reset_tokens")
        .select("*")
        .eq("token_hash", token_hash)
        .eq("used", False)
        .execute()
    )
    if not result.data:
        return False

    record = result.data[0]
    expires_at = datetime.fromisoformat(record["expires_at"])
    if expires_at < datetime.now(timezone.utc):
        return False

    supabase.table("users").update(
        {"password_hash": hash_password(new_password)}
    ).eq("id", record["user_id"]).execute()

    supabase.table("password_reset_tokens").update({"used": True}).eq("id", record["id"]).execute()
    return True
