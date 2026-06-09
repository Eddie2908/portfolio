from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Query, Request, UploadFile, File
import uuid
from app.api.dependencies import get_admin_user, get_super_admin
from app.database.connection import get_supabase
from app.schemas.project_schema import ProjectCreate, ProjectUpdate
from app.schemas.testimonial_schema import TestimonialCreate, TestimonialUpdate
from app.schemas.blog_schema import BlogPostCreate, BlogPostUpdate
from app.schemas.admin_schema import SettingsUpdate
from app.schemas.skill_schema import SkillCreate, SkillUpdate
from app.schemas.user_schema import UserCreate
from app.services.auth_service import create_user as svc_create_user
from app.services.project_service import create_project, update_project, delete_project
from app.services.admin_service import get_dashboard_stats

router = APIRouter()


@router.post("/upload")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    bucket: str = Query("portfolio", description="Subfolder name"),
    admin: dict = Depends(get_admin_user),
):
    from app.core.config import settings as app_settings

    ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Type de fichier non autorisé")

    max_size = app_settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    content = await file.read()
    if len(content) > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"Fichier trop volumineux. Maximum : {app_settings.MAX_UPLOAD_SIZE_MB} Mo",
        )

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "bin"
    filename = f"{uuid.uuid4()}.{ext}"

    upload_dir = Path("static/uploads") / bucket
    upload_dir.mkdir(parents=True, exist_ok=True)
    (upload_dir / filename).write_bytes(content)

    base_url = str(request.base_url).rstrip("/")
    url = f"{base_url}/static/uploads/{bucket}/{filename}"
    return {"url": url, "filename": filename}


@router.get("/stats")
async def stats(admin: dict = Depends(get_admin_user)):
    return get_dashboard_stats()


@router.get("/projects")
async def admin_get_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin: dict = Depends(get_admin_user),
):
    supabase = get_supabase()
    offset = (page - 1) * limit
    response = (
        supabase.table("projects")
        .select("*", count="exact")
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return {"items": response.data, "total": response.count}


@router.get("/projects/{project_id}")
async def admin_get_project(project_id: int, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    response = supabase.table("projects").select("*").eq("id", project_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    return response.data


@router.post("/projects", status_code=201)
async def admin_create_project(data: ProjectCreate, admin: dict = Depends(get_admin_user)):
    return create_project(data.model_dump())


@router.put("/projects/{project_id}")
async def admin_update_project(project_id: int, data: ProjectUpdate, admin: dict = Depends(get_admin_user)):
    update_data = data.model_dump(exclude_none=True)
    result = update_project(project_id, update_data)
    if not result:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    return result


@router.delete("/projects/{project_id}")
async def admin_delete_project(project_id: int, admin: dict = Depends(get_admin_user)):
    delete_project(project_id)
    return {"message": "Projet supprimé"}


@router.get("/testimonials")
async def admin_get_testimonials(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin: dict = Depends(get_admin_user),
):
    supabase = get_supabase()
    offset = (page - 1) * limit
    response = (
        supabase.table("testimonials")
        .select("*", count="exact")
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return {"items": response.data, "total": response.count}


@router.post("/testimonials", status_code=201)
async def admin_create_testimonial(data: TestimonialCreate, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    response = supabase.table("testimonials").insert(data.model_dump()).execute()
    return response.data[0]


@router.put("/testimonials/{tid}")
async def admin_update_testimonial(tid: str, data: TestimonialUpdate, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    update_data = data.model_dump(exclude_none=True)
    try:
        response = supabase.table("testimonials").update(update_data).eq("id", tid).execute()
    except Exception:
        raise HTTPException(status_code=500, detail="Erreur serveur")
    if not response.data:
        raise HTTPException(status_code=404, detail="Témoignage non trouvé")
    return response.data[0]


@router.delete("/testimonials/{tid}")
async def admin_delete_testimonial(tid: str, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    try:
        supabase.table("testimonials").delete().eq("id", tid).execute()
    except Exception:
        raise HTTPException(status_code=500, detail="Erreur serveur")
    return {"message": "Témoignage supprimé"}


@router.get("/blog")
async def admin_get_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin: dict = Depends(get_admin_user),
):
    supabase = get_supabase()
    offset = (page - 1) * limit
    response = (
        supabase.table("blog_posts")
        .select("*", count="exact")
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return {"items": response.data, "total": response.count}


@router.get("/blog/{post_id}")
async def admin_get_post(post_id: str, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    try:
        response = supabase.table("blog_posts").select("*").eq("id", post_id).limit(1).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur serveur")
    if not response.data:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return response.data[0]


@router.post("/blog", status_code=201)
async def admin_create_post(data: BlogPostCreate, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    post_data = data.model_dump()
    try:
        post_data["author_id"] = int(admin["sub"])
    except (ValueError, TypeError):
        post_data.pop("author_id", None)
    try:
        response = supabase.table("blog_posts").insert(post_data).execute()
    except Exception:
        raise HTTPException(status_code=500, detail="Erreur lors de la création")
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'article")
    return response.data[0]


@router.put("/blog/{post_id}")
async def admin_update_post(post_id: str, data: BlogPostUpdate, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    update_data = data.model_dump(exclude_none=True)
    try:
        response = supabase.table("blog_posts").update(update_data).eq("id", post_id).execute()
    except Exception:
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour")
    if not response.data:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return response.data[0]


@router.delete("/blog/{post_id}")
async def admin_delete_post(post_id: str, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    try:
        supabase.table("blog_posts").delete().eq("id", post_id).execute()
    except Exception:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression")
    return {"message": "Article supprimé"}


@router.get("/users")
async def admin_get_users(admin: dict = Depends(get_super_admin)):
    supabase = get_supabase()
    response = supabase.table("users").select("id, name, email, role, status, created_at").execute()
    return response.data


@router.post("/users", status_code=201)
async def admin_create_user(data: UserCreate, admin: dict = Depends(get_super_admin)):
    supabase = get_supabase()
    existing = supabase.table("users").select("id").eq("email", data.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    try:
        created = svc_create_user(data.name, data.email, data.password, data.role or "editor")
        return {"message": "Utilisateur créé", "id": created.get("id")}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur création utilisateur")


@router.delete("/users/{user_id}")
async def admin_delete_user(user_id: int, admin: dict = Depends(get_super_admin)):
    if str(admin.get("sub")) == str(user_id):
        raise HTTPException(status_code=400, detail="Impossible de supprimer votre propre compte")
    supabase = get_supabase()
    supabase.table("users").delete().eq("id", user_id).execute()
    return {"message": "Utilisateur supprimé"}


@router.get("/settings")
async def admin_get_settings(admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    response = supabase.table("settings").select("*").eq("id", 1).single().execute()
    return response.data or {}


@router.put("/settings")
async def admin_update_settings(data: SettingsUpdate, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    update_data = data.model_dump(exclude_none=True)
    supabase.table("settings").upsert({"id": 1, **update_data}).execute()
    return {"message": "Paramètres mis à jour"}


@router.get("/skills")
async def admin_get_skills(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=200),
    admin: dict = Depends(get_admin_user),
):
    supabase = get_supabase()
    offset = (page - 1) * limit
    response = (
        supabase.table("skills")
        .select("*", count="exact")
        .order("category")
        .order("display_order")
        .range(offset, offset + limit - 1)
        .execute()
    )
    return {"items": response.data, "total": response.count}


@router.post("/skills", status_code=201)
async def admin_create_skill(data: SkillCreate, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    response = supabase.table("skills").insert(data.model_dump()).execute()
    return response.data[0]


@router.put("/skills/{skill_id}")
async def admin_update_skill(skill_id: int, data: SkillUpdate, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    update_data = data.model_dump(exclude_none=True)
    response = supabase.table("skills").update(update_data).eq("id", skill_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Compétence non trouvée")
    return response.data[0]


@router.delete("/skills/{skill_id}")
async def admin_delete_skill(skill_id: int, admin: dict = Depends(get_admin_user)):
    supabase = get_supabase()
    supabase.table("skills").delete().eq("id", skill_id).execute()
    return {"message": "Compétence supprimée"}
