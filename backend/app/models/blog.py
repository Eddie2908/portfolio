from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BlogPost(BaseModel):
    id: Optional[int] = None
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: str
    category: str = "frontend"
    tags: List[str] = []
    image_url: Optional[str] = None
    status: str = "draft"
    read_time: Optional[str] = None
    author_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
