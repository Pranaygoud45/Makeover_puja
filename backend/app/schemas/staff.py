import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class StaffMemberBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    role: Optional[str] = Field(default=None, max_length=255)
    specialization: Optional[str] = Field(default=None, max_length=255)
    photo_url: Optional[str] = Field(default=None, max_length=500)
    bio: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class StaffMemberCreate(StaffMemberBase):
    pass


class StaffMemberUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    role: Optional[str] = Field(default=None, max_length=255)
    specialization: Optional[str] = Field(default=None, max_length=255)
    photo_url: Optional[str] = Field(default=None, max_length=500)
    bio: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class StaffMemberResponse(StaffMemberBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
