import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.staff import StaffMember
from app.models.user import User
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.staff import StaffMemberCreate, StaffMemberResponse, StaffMemberUpdate
from app.services.auth import require_admin
from app.utils.pagination import paginate

router = APIRouter()


@router.get("", response_model=PaginatedResponse[StaffMemberResponse])
def list_staff(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    active_only: bool = Query(default=True),
    db: Session = Depends(get_db),
) -> PaginatedResponse[StaffMemberResponse]:
    query = select(StaffMember)
    if active_only:
        query = query.where(StaffMember.is_active.is_(True))
    query = query.order_by(StaffMember.sort_order.asc(), StaffMember.name.asc())
    return paginate(db, query, page=page, page_size=page_size, schema=StaffMemberResponse)


@router.get("/{staff_id}", response_model=StaffMemberResponse)
def get_staff_member(staff_id: uuid.UUID, db: Session = Depends(get_db)) -> StaffMemberResponse:
    member = db.scalar(select(StaffMember).where(StaffMember.id == staff_id))
    if member is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found")
    return StaffMemberResponse.model_validate(member)


@router.post("", response_model=StaffMemberResponse, status_code=status.HTTP_201_CREATED)
def create_staff_member(
    payload: StaffMemberCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> StaffMemberResponse:
    member = StaffMember(**payload.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return StaffMemberResponse.model_validate(member)


@router.put("/{staff_id}", response_model=StaffMemberResponse)
def update_staff_member(
    staff_id: uuid.UUID,
    payload: StaffMemberUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> StaffMemberResponse:
    member = db.scalar(select(StaffMember).where(StaffMember.id == staff_id))
    if member is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(member, field, value)
    db.commit()
    db.refresh(member)
    return StaffMemberResponse.model_validate(member)


@router.delete("/{staff_id}", response_model=MessageResponse)
def delete_staff_member(
    staff_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> MessageResponse:
    member = db.scalar(select(StaffMember).where(StaffMember.id == staff_id))
    if member is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found")
    db.delete(member)
    db.commit()
    return MessageResponse(message="Staff member deleted successfully")
