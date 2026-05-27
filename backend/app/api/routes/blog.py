from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.dependencies import get_admin_user
from app.database.connection import get_supabase

router = APIRouter()


@router.get("")
async def get_posts(
    category: str = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
):
    supabase = get_supabase()
    query = supabase.table("blog_posts").select("*").eq("status", "published").order("created_at", desc=True)

    if category:
        query = query.eq("category", category)

    offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    response = query.execute()
    return response.data


@router.get("/{slug}")
async def get_post(slug: str):
    supabase = get_supabase()
    try:
        response = supabase.table("blog_posts").select("*").eq("slug", slug).limit(1).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    if not response.data:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return response.data[0]
