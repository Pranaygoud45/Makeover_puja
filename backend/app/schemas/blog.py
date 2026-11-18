import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class BlogPostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    slug: str = Field(..., min_length=1, max_length=500)
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = Field(default=None, max_length=500)
    author: Optional[str] = Field(default=None, max_length=255)
    published_at: Optional[datetime] = None
    tags: list[str] = Field(default_factory=list)
    read_time: Optional[int] = Field(default=None, ge=1)
    is_published: bool = False


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=500)
    slug: Optional[str] = Field(default=None, min_length=1, max_length=500)
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = Field(default=None, max_length=500)
    author: Optional[str] = Field(default=None, max_length=255)
    published_at: Optional[datetime] = None
    tags: Optional[list[str]] = None
    read_time: Optional[int] = Field(default=None, ge=1)
    is_published: Optional[bool] = None


class BlogPostResponse(BlogPostBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
