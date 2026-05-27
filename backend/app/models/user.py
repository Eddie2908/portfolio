from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    password_hash: str
    role: str = "editor"
    status: str = "active"
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: Optional[datetime] = None
