from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.concurrency import run_in_threadpool

from app.utils.security import verify_token
from app.database.connection import get_supabase

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Reject tokens issued before the user's last password change so that
    # changing/resetting a password invalidates all existing sessions.
    supabase = get_supabase()
    user_id = payload.get("sub")
    result = await run_in_threadpool(
        lambda: supabase.table("users")
        .select("password_changed_at")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Compte introuvable",
            headers={"WWW-Authenticate": "Bearer"},
        )
    current_pwd_at = result.data[0].get("password_changed_at")
    if current_pwd_at != payload.get("pwd_at"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expirée, veuillez vous reconnecter",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload


async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ("admin", "editor"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé : droits insuffisants",
        )
    return current_user


async def get_super_admin(current_user: dict = Depends(get_current_user)):
    """Strictly admin-only (not editors). Use for user management and critical settings."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs",
        )
    return current_user
