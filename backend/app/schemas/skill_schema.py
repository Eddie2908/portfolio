from pydantic import BaseModel
from typing import Optional

class SkillCreate(BaseModel):
    category: str
    category_color: str = '#5865f5'
    name: str
    level: int
    display_order: int = 0

class SkillUpdate(BaseModel):
    category: Optional[str] = None
    category_color: Optional[str] = None
    name: Optional[str] = None
    level: Optional[int] = None
    display_order: Optional[int] = None
