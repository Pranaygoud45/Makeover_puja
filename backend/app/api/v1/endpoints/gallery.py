import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.gallery import BeforeAfterImage, GalleryImage
from app.models.user import User
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.gallery import (
    BeforeAfterCreate,
    BeforeAfterResponse,
    BeforeAfterUpdate,
    GalleryCategory,
    GalleryImageCreate,
    GalleryImageResponse,
    GalleryImageUpdate,
)
from app.services.auth import require_admin
from app.utils.pagination import paginate

router = APIRouter()


# --- Gallery Images ---

@router.get("", response_model=PaginatedResponse[GalleryImageResponse])
def list_gallery_images(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    category: Optional[GalleryCategory] = Query(default=None),
    active_only: bool = Query(default=True),
    db: Session = Depends(get_db),
) -> PaginatedResponse[GalleryImageResponse]:
    query = select(GalleryImage)
    if active_only:
        query = query.where(GalleryImage.is_active.is_(True))
    if category is not None:
        query = query.where(GalleryImage.category == category)
    query = query.order_by(GalleryImage.sort_order.asc(), GalleryImage.created_at.desc())
    return paginate(db, query, page=page, page_size=page_size, schema=GalleryImageResponse)


@router.post("", response_model=GalleryImageResponse, status_code=status.HTTP_201_CREATED)
def create_gallery_image(
    payload: GalleryImageCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> GalleryImageResponse:
    image = GalleryImage(**payload.model_dump())
    db.add(image)
    db.commit()
    db.refresh(image)
    return GalleryImageResponse.model_validate(image)


@router.put("/{image_id}", response_model=GalleryImageResponse)
def update_gallery_image(
    image_id: uuid.UUID,
    payload: GalleryImageUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> GalleryImageResponse:
    image = db.scalar(select(GalleryImage).where(GalleryImage.id == image_id))
    if image is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gallery image not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(image, field, value)
    db.commit()
    db.refresh(image)
    return GalleryImageResponse.model_validate(image)


@router.delete("/{image_id}", response_model=MessageResponse)
def delete_gallery_image(
    image_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> MessageResponse:
    image = db.scalar(select(GalleryImage).where(GalleryImage.id == image_id))
    if image is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gallery image not found")
    db.delete(image)
    db.commit()
    return MessageResponse(message="Gallery image deleted successfully")


# --- Before/After Images ---

@router.get("/before-after", response_model=PaginatedResponse[BeforeAfterResponse])
def list_before_after(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    category: Optional[str] = Query(default=None),
    active_only: bool = Query(default=True),
    db: Session = Depends(get_db),
) -> PaginatedResponse[BeforeAfterResponse]:
    query = select(BeforeAfterImage)
    if active_only:
        query = query.where(BeforeAfterImage.is_active.is_(True))
    if category:
        query = query.where(BeforeAfterImage.category == category)
    query = query.order_by(BeforeAfterImage.created_at.desc())
    return paginate(db, query, page=page, page_size=page_size, schema=BeforeAfterResponse)


@router.post("/before-after", response_model=BeforeAfterResponse, status_code=status.HTTP_201_CREATED)
def create_before_after(
    payload: BeforeAfterCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> BeforeAfterResponse:
    item = BeforeAfterImage(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return BeforeAfterResponse.model_validate(item)


@router.put("/before-after/{item_id}", response_model=BeforeAfterResponse)
def update_before_after(
    item_id: uuid.UUID,
    payload: BeforeAfterUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> BeforeAfterResponse:
    item = db.scalar(select(BeforeAfterImage).where(BeforeAfterImage.id == item_id))
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Before/After image not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return BeforeAfterResponse.model_validate(item)


@router.delete("/before-after/{item_id}", response_model=MessageResponse)
def delete_before_after(
    item_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> MessageResponse:
    item = db.scalar(select(BeforeAfterImage).where(BeforeAfterImage.id == item_id))
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Before/After image not found")
    db.delete(item)
    db.commit()
    return MessageResponse(message="Before/After image deleted successfully")
