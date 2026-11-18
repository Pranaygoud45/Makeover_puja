import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class TestimonialBase(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=255)
    service: Optional[str] = Field(default=None, max_length=255)
    feedback: str = Field(..., min_length=1)
    rating: int = Field(..., ge=1, le=5)
    customer_photo_url: Optional[str] = Field(default=None, max_length=500)


class TestimonialCreate(TestimonialBase):
    is_approved: bool = False


class TestimonialUpdate(BaseModel):
    customer_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    service: Optional[str] = Field(default=None, max_length=255)
    feedback: Optional[str] = Field(default=None, min_length=1)
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    customer_photo_url: Optional[str] = Field(default=None, max_length=500)
    is_approved: Optional[bool] = None


class TestimonialResponse(TestimonialBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    is_approved: bool
    created_at: datetime
