from pydantic import BaseModel
from typing import Optional, List


class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: str
    category: str = "frontend"
    tags: List[str] = []
    image_url: Optional[str] = None
    status: str = "draft"
    read_time: Optional[str] = None


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None
    status: Optional[str] = None
    read_time: Optional[str] = None
