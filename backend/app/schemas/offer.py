import uuid
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class OfferBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    image_url: Optional[str] = Field(default=None, max_length=500)
    valid_until: Optional[date] = None
    code: Optional[str] = Field(default=None, max_length=50)
    is_active: bool = True


class OfferCreate(OfferBase):
    pass


class OfferUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    image_url: Optional[str] = Field(default=None, max_length=500)
    valid_until: Optional[date] = None
    code: Optional[str] = Field(default=None, max_length=50)
    is_active: Optional[bool] = None


class OfferResponse(OfferBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
