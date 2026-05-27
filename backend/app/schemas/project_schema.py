from pydantic import BaseModel
from typing import Optional, List


class ProjectCreate(BaseModel):
    title: str
    description: str
    category: str = "fullstack"
    tags: List[str] = []
    image_url: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    status: str = "draft"
    featured: bool = False


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[bool] = None
