import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class PackageBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255)
    category: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = None
    features: list[str] = Field(default_factory=list)
    price: Optional[Decimal] = Field(default=None, ge=0)
    image_url: Optional[str] = Field(default=None, max_length=500)
    is_popular: bool = False
    is_active: bool = True
    sort_order: int = 0


class PackageCreate(PackageBase):
    pass


class PackageUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    slug: Optional[str] = Field(default=None, min_length=1, max_length=255)
    category: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = None
    features: Optional[list[str]] = None
    price: Optional[Decimal] = Field(default=None, ge=0)
    image_url: Optional[str] = Field(default=None, max_length=500)
    is_popular: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class PackageResponse(PackageBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
