from pydantic import BaseModel, Field
from typing import Optional


class TestimonialSubmit(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    role: str = Field(min_length=2, max_length=150)
    text: str = Field(min_length=10, max_length=2000)
    avatar_url: Optional[str] = Field(default=None, max_length=500)


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
