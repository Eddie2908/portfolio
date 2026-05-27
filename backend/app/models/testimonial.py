from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Testimonial(BaseModel):
    id: Optional[int] = None
    name: str
    role: str
    text: str
    avatar_url: Optional[str] = None
    status: str = "draft"
    created_at: Optional[datetime] = None
