from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Request
from app.api.dependencies import get_admin_user
from app.database.connection import get_supabase, run_db
from app.schemas.contact_schema import ContactCreate
from app.services.email_service import send_notification_email
from app.services.resend_email import send_notification_email_resend
from app.core.config import settings
from app.middleware.rate_limit import limiter

router = APIRouter()


@router.post("")
@limiter.limit("5/minute")
async def send_message(request: Request, data: ContactCreate, background_tasks: BackgroundTasks):
    supabase = get_supabase()
    message = {
        "name": data.name,
        "email": data.email,
        "subject": data.subject,
        "message": data.message,
        "status": "unread",
    }
    try:
        response = await run_db(lambda: supabase.table("messages").insert(message).execute())
    except Exception:
        raise HTTPException(status_code=500, detail="Impossible d'enregistrer le message")

    # Try Resend first (works on Railway), fallback to SMTP for local dev
    if settings.RESEND_API_KEY:
        background_tasks.add_task(send_notification_email_resend, data)
    else:
        background_tasks.add_task(send_notification_email, data)

    return {"message": "Message envoyé avec succès", "id": response.data[0]["id"] if response.data else None}


@router.get("")
def get_messages(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin: dict = Depends(get_admin_user),
):
    supabase = get_supabase()
    offset = (page - 1) * limit
    response = (
        supabase.table("messages")
        .select("*", count="exact")
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return {"items": response.data, "total": response.count}


@router.get("/{message_id}")
def get_message(message_id: str, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    try:
        response = supabase.table("messages").select("*").eq("id", message_id).limit(1).execute()
    except Exception:
        raise HTTPException(status_code=500, detail="Erreur serveur")
    if not response.data:
        raise HTTPException(status_code=404, detail="Message non trouvé")
    return response.data[0]


@router.patch("/{message_id}/read")
def mark_as_read(message_id: str, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    try:
        supabase.table("messages").update({"status": "read"}).eq("id", message_id).execute()
    except Exception:
        raise HTTPException(status_code=500, detail="Erreur serveur")
    return {"message": "Marqué comme lu"}


@router.delete("/{message_id}")
def delete_message(message_id: str, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    try:
        supabase.table("messages").delete().eq("id", message_id).execute()
    except Exception:
        raise HTTPException(status_code=500, detail="Erreur serveur")
    return {"message": "Message supprimé"}
