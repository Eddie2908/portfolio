from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Project(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    category: str = "fullstack"
    tags: List[str] = []
    image_url: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    status: str = "draft"
    featured: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
