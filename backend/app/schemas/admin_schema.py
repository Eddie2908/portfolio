from pydantic import BaseModel
from typing import Optional, List


class DashboardStats(BaseModel):
    projects: int = 0
    messages: int = 0
    testimonials: int = 0
    blog_posts: int = 0


class SettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    site_description: Optional[str] = None
    contact_email: Optional[str] = None
    analytics_id: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image: Optional[str] = None
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    bio_1: Optional[str] = None
    bio_2: Optional[str] = None
    bio_3: Optional[str] = None
    years_experience: Optional[str] = None
    projects_count: Optional[str] = None
    fun_stat: Optional[str] = None
    fun_stat_label: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    tech_tags: Optional[List[str]] = None
    hero_badge_exp: Optional[str] = None
    hero_badge_projects: Optional[str] = None
    avatar_url: Optional[str] = None
