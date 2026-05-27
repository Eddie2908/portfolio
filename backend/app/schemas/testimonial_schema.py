from pydantic import BaseModel
from typing import Optional


class TestimonialSubmit(BaseModel):
    name: str
    role: str
    text: str
    avatar_url: Optional[str] = None


class TestimonialCreate(BaseModel):
    name: str
    role: str
    text: str
    avatar_url: Optional[str] = None
    status: str = "draft"


class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    text: Optional[str] = None
    avatar_url: Optional[str] = None
    status: Optional[str] = None
