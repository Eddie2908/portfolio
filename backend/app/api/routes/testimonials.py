from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, Request, UploadFile
from app.api.dependencies import get_admin_user
from app.database.connection import get_supabase
from app.schemas.testimonial_schema import TestimonialSubmit
from app.middleware.rate_limit import limiter
import logging
import uuid

logger = logging.getLogger("portfolio_api")
router = APIRouter()


@router.get("")
async def get_testimonials():
    supabase = get_supabase()
    response = (
        supabase.table("testimonials")
        .select("*")
        .eq("status", "published")
        .order("created_at", desc=True)
        .execute()
    )
    return response.data


@router.post("/upload-avatar")
@limiter.limit("5/minute")
async def upload_testimonial_avatar(request: Request, file: UploadFile = File(...)):
    ALLOWED = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="Type non autorisé. Utilisez JPG, PNG ou WebP.")
    content = await file.read()
    if len(content) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image trop grande (max 2 Mo)")
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "jpg"
    filename = f"avatars/{uuid.uuid4()}.{ext}"
    supabase = get_supabase()
    try:
        supabase.storage.from_("testimonials").upload(
            filename,
            content,
            {"content-type": file.content_type},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur upload : {str(e)}")
    url = supabase.storage.from_("testimonials").get_public_url(filename)
    return {"url": url}


@router.post("", status_code=201)
@limiter.limit("3/minute")
async def submit_testimonial(request: Request, data: TestimonialSubmit):
    supabase = get_supabase()
    payload = {
        "name": data.name,
        "role": data.role,
        "text": data.text,
        "avatar_url": data.avatar_url,
        "status": "pending",
    }
    try:
        response = supabase.table("testimonials").insert(payload).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'envoi: {str(e)}")
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de l'enregistrement")
    logger.info(f"New testimonial submitted by {data.name}")
    return {"message": "Témoignage soumis. Il sera publié après validation par l'administrateur."}


@router.patch("/{tid}/approve")
async def approve_testimonial(tid: str, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    try:
        response = supabase.table("testimonials").update({"status": "published"}).eq("id", tid).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    if not response.data:
        raise HTTPException(status_code=404, detail="Témoignage non trouvé")
    return response.data[0]


@router.patch("/{tid}/reject")
async def reject_testimonial(tid: str, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    try:
        response = supabase.table("testimonials").update({"status": "rejected"}).eq("id", tid).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    if not response.data:
        raise HTTPException(status_code=404, detail="Témoignage non trouvé")
    return {"message": "Témoignage rejeté"}


@router.get("/{testimonial_id}")
async def get_testimonial(testimonial_id: str):
    supabase = get_supabase()
    try:
        response = supabase.table("testimonials").select("*").eq("id", testimonial_id).limit(1).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    if not response.data:
        raise HTTPException(status_code=404, detail="Témoignage non trouvé")
    return response.data[0]
