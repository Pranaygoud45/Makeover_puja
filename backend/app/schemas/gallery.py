import uuid
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

GalleryCategory = Literal["bridal", "party", "hairstyle", "makeup"]


class GalleryImageBase(BaseModel):
    image_url: str = Field(..., min_length=1, max_length=500)
    alt_text: Optional[str] = Field(default=None, max_length=255)
    category: GalleryCategory
    sort_order: int = 0
    is_active: bool = True


class GalleryImageCreate(GalleryImageBase):
    pass


class GalleryImageUpdate(BaseModel):
    image_url: Optional[str] = Field(default=None, min_length=1, max_length=500)
    alt_text: Optional[str] = Field(default=None, max_length=255)
    category: Optional[GalleryCategory] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class GalleryImageResponse(GalleryImageBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime


class BeforeAfterBase(BaseModel):
    before_image_url: str = Field(..., min_length=1, max_length=500)
    after_image_url: str = Field(..., min_length=1, max_length=500)
    title: Optional[str] = Field(default=None, max_length=255)
    category: str = Field(..., min_length=1, max_length=50)
    is_active: bool = True


class BeforeAfterCreate(BeforeAfterBase):
    pass


class BeforeAfterUpdate(BaseModel):
    before_image_url: Optional[str] = Field(default=None, min_length=1, max_length=500)
    after_image_url: Optional[str] = Field(default=None, min_length=1, max_length=500)
    title: Optional[str] = Field(default=None, max_length=255)
    category: Optional[str] = Field(default=None, min_length=1, max_length=50)
    is_active: Optional[bool] = None


class BeforeAfterResponse(BeforeAfterBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
