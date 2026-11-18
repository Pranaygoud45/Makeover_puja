import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.testimonial import Testimonial
from app.models.user import User
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.testimonial import TestimonialCreate, TestimonialResponse, TestimonialUpdate
from app.services.auth import require_admin
from app.utils.pagination import paginate

router = APIRouter()


@router.get("", response_model=PaginatedResponse[TestimonialResponse])
def list_approved_testimonials(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> PaginatedResponse[TestimonialResponse]:
    query = (
        select(Testimonial)
        .where(Testimonial.is_approved.is_(True))
        .order_by(Testimonial.created_at.desc())
    )
    return paginate(db, query, page=page, page_size=page_size, schema=TestimonialResponse)


@router.get("/admin", response_model=PaginatedResponse[TestimonialResponse])
def list_all_testimonials_admin(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    approved_only: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> PaginatedResponse[TestimonialResponse]:
    query = select(Testimonial)
    if approved_only is not None:
        query = query.where(Testimonial.is_approved.is_(approved_only))
    query = query.order_by(Testimonial.created_at.desc())
    return paginate(db, query, page=page, page_size=page_size, schema=TestimonialResponse)


@router.post("", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
def create_testimonial(
    payload: TestimonialCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> TestimonialResponse:
    testimonial = Testimonial(**payload.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return TestimonialResponse.model_validate(testimonial)


@router.put("/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonial(
    testimonial_id: uuid.UUID,
    payload: TestimonialUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> TestimonialResponse:
    testimonial = db.scalar(select(Testimonial).where(Testimonial.id == testimonial_id))
    if testimonial is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(testimonial, field, value)
    db.commit()
    db.refresh(testimonial)
    return TestimonialResponse.model_validate(testimonial)


@router.delete("/{testimonial_id}", response_model=MessageResponse)
def delete_testimonial(
    testimonial_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> MessageResponse:
    testimonial = db.scalar(select(Testimonial).where(Testimonial.id == testimonial_id))
    if testimonial is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    db.delete(testimonial)
    db.commit()
    return MessageResponse(message="Testimonial deleted successfully")
