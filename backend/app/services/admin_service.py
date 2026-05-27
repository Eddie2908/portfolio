import logging
from app.database.connection import get_supabase

logger = logging.getLogger("portfolio_api")


def get_dashboard_stats() -> dict:
    supabase = get_supabase()
    projects = supabase.table("projects").select("id", count="exact").execute()
    messages = supabase.table("messages").select("id", count="exact").execute()
    testimonials = supabase.table("testimonials").select("id", count="exact").execute()
    posts = supabase.table("blog_posts").select("id", count="exact").execute()
    unread = supabase.table("messages").select("id", count="exact").eq("status", "unread").execute()
    pending_testimonials = supabase.table("testimonials").select("id", count="exact").eq("status", "pending").execute()
    users = supabase.table("users").select("id", count="exact").execute()

    return {
        "projects": projects.count or 0,
        "messages": messages.count or 0,
        "testimonials": testimonials.count or 0,
        "blog_posts": posts.count or 0,
        "unread_messages": unread.count or 0,
        "pending_testimonials": pending_testimonials.count or 0,
        "users": users.count or 0,
    }


def get_recent_activity(limit: int = 10) -> list:
    supabase = get_supabase()
    response = (
        supabase.table("messages")
        .select("id, name, subject, created_at")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return response.data
