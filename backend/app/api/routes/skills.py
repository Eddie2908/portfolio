from fastapi import APIRouter
from app.database.connection import get_supabase

router = APIRouter()


@router.get("")
def get_skills():
    supabase = get_supabase()
    response = (
        supabase.table("skills")
        .select("*")
        .order("category")
        .order("display_order")
        .execute()
    )
    # Group by category
    groups = {}
    for skill in response.data:
        cat = skill["category"]
        if cat not in groups:
            groups[cat] = {"category": cat, "category_color": skill["category_color"], "skills": []}
        groups[cat]["skills"].append({"id": skill["id"], "name": skill["name"], "level": skill["level"]})
    return list(groups.values())
