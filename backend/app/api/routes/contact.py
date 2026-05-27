from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from app.api.dependencies import get_admin_user
from app.database.connection import get_supabase
from app.schemas.contact_schema import ContactCreate
from app.services.email_service import send_notification_email
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
        response = supabase.table("messages").insert(message).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Impossible d'enregistrer le message: {str(e)}")

    background_tasks.add_task(send_notification_email, data)

    return {"message": "Message envoyé avec succès", "id": response.data[0]["id"] if response.data else None}


@router.get("")
async def get_messages(
    page: int = 1,
    limit: int = 20,
    admin: dict = Depends(get_admin_user),
):
    supabase = get_supabase()
    offset = (page - 1) * limit
    response = (
        supabase.table("messages")
        .select("*")
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return response.data


@router.get("/{message_id}")
async def get_message(message_id: str, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    try:
        response = supabase.table("messages").select("*").eq("id", message_id).limit(1).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")
    if not response.data:
        raise HTTPException(status_code=404, detail="Message non trouvé")
    return response.data[0]


@router.patch("/{message_id}/read")
async def mark_as_read(message_id: str, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    try:
        supabase.table("messages").update({"status": "read"}).eq("id", message_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")
    return {"message": "Marqué comme lu"}


@router.delete("/{message_id}")
async def delete_message(message_id: str, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    try:
        supabase.table("messages").delete().eq("id", message_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")
    return {"message": "Message supprimé"}
