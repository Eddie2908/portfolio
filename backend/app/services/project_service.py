from app.database.connection import get_supabase


def get_all_projects(category=None, page=1, limit=20):
    supabase = get_supabase()
    query = supabase.table("projects").select("*").eq("status", "published").order("created_at", desc=True)

    if category and category != "all":
        query = query.eq("category", category)

    offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    response = query.execute()
    return response.data


def get_project_by_id(project_id: int):
    supabase = get_supabase()
    response = supabase.table("projects").select("*").eq("id", project_id).single().execute()
    return response.data


def create_project(data: dict):
    supabase = get_supabase()
    response = supabase.table("projects").insert(data).execute()
    return response.data[0]


def update_project(project_id: int, data: dict):
    supabase = get_supabase()
    response = supabase.table("projects").update(data).eq("id", project_id).execute()
    return response.data[0] if response.data else None


def delete_project(project_id: int):
    supabase = get_supabase()
    supabase.table("projects").delete().eq("id", project_id).execute()
