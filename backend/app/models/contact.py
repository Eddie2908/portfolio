from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Message(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    subject: str
    message: str
    status: str = "unread"
    created_at: Optional[datetime] = None
