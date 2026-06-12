import asyncio

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from typing import Optional

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.middleware.rate_limit import limiter
from app.database.connection import get_supabase
from app.schemas.user_schema import (
    UserLogin,
    UserCreate,
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.services.auth_service import (
    authenticate_user,
    create_user,
    create_password_reset_token,
    reset_password_with_token,
)
from app.services.email_service import send_password_reset_email
from app.utils.security import hash_password, verify_password, validate_password_strength

router = APIRouter()


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request: Request, data: UserLogin):
    result = authenticate_user(data.email, data.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
        )
    return result


@router.post("/forgot-password")
@limiter.limit("3/minute")
async def forgot_password(request: Request, data: ForgotPasswordRequest):
    result = create_password_reset_token(data.email)
    # If the user exists, send the email in the background so the API
    # responds immediately (critical on free tiers like Railway where
    # cold-start + SMTP can exceed timeout).
    if result:
        raw_token, user = result
        reset_link = f"{settings.FRONTEND_URL}/admin/reset-password?token={raw_token}"

        async def _send_email():
            try:
                await send_password_reset_email(user["email"], user["name"], reset_link)
            except Exception as e:
                logger = logging.getLogger("portfolio_api")
                logger.error(f"Background password reset email failed: {e}")

        asyncio.create_task(_send_email())
    return {"message": "Si un compte existe pour cet email, un lien de réinitialisation a été envoyé."}


@router.post("/reset-password")
@limiter.limit("5/minute")
async def reset_password(request: Request, data: ResetPasswordRequest):
    pwd_error = validate_password_strength(data.new_password)
    if pwd_error:
        raise HTTPException(status_code=400, detail=pwd_error)

    success = reset_password_with_token(data.token, data.new_password)
    if not success:
        raise HTTPException(status_code=400, detail="Lien invalide ou expiré")
    return {"message": "Mot de passe réinitialisé avec succès"}


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, admin: dict = Depends(get_current_user)):
    if admin.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Seul un admin peut créer des comptes")

    pwd_error = validate_password_strength(data.password)
    if pwd_error:
        raise HTTPException(status_code=400, detail=pwd_error)

    supabase = get_supabase()
    existing = supabase.table("users").select("id").eq("email", data.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    user = create_user(data.name, data.email, data.password, data.role or "editor")
    return {"message": "Utilisateur créé", "id": user["id"]}


@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    response = (
        supabase.table("users")
        .select("id, name, email, role, bio, avatar_url, created_at")
        .eq("id", current_user["sub"])
        .single()
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return response.data


@router.put("/me")
async def update_profile(data: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    update_data = data.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    supabase.table("users").update(update_data).eq("id", current_user["sub"]).execute()
    return {"message": "Profil mis à jour"}


@router.put("/change-password")
async def change_password(data: PasswordChange, current_user: dict = Depends(get_current_user)):
    pwd_error = validate_password_strength(data.new_password)
    if pwd_error:
        raise HTTPException(status_code=400, detail=pwd_error)

    supabase = get_supabase()
    user = supabase.table("users").select("password_hash").eq("id", current_user["sub"]).single().execute()

    if not verify_password(data.current_password, user.data["password_hash"]):
        raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect")

    new_hash = hash_password(data.new_password)
    supabase.table("users").update({"password_hash": new_hash}).eq("id", current_user["sub"]).execute()
    return {"message": "Mot de passe modifié"}
