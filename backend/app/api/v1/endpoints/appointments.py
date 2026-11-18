import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.integrations.email import send_appointment_email
from app.models.appointment import Appointment, AppointmentStatus
from app.models.user import User
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentStatusUpdate,
)
from app.schemas.common import MessageResponse, PaginatedResponse
from app.services.auth import require_admin
from app.utils.pagination import paginate

router = APIRouter()


@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    payload: AppointmentCreate,
    db: Session = Depends(get_db),
) -> AppointmentResponse:
    appointment = Appointment(**payload.model_dump())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    # Non-blocking best-effort notification stub/SMTP when configured
    send_appointment_email(
        to_email=appointment.email,
        customer_name=appointment.customer_name,
        service=appointment.service,
        preferred_date=str(appointment.preferred_date),
        preferred_time=appointment.preferred_time,
        status=appointment.status.value,
    )
    return AppointmentResponse.model_validate(appointment)


@router.get("", response_model=PaginatedResponse[AppointmentResponse])
def list_appointments(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    status_filter: Optional[AppointmentStatus] = Query(default=None, alias="status"),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> PaginatedResponse[AppointmentResponse]:
    query = select(Appointment)
    if status_filter is not None:
        query = query.where(Appointment.status == status_filter)
    if search:
        term = f"%{search.strip()}%"
        query = query.where(
            or_(
                Appointment.customer_name.ilike(term),
                Appointment.mobile.ilike(term),
                Appointment.service.ilike(term),
            )
        )
    query = query.order_by(Appointment.created_at.desc())
    return paginate(db, query, page=page, page_size=page_size, schema=AppointmentResponse)


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> AppointmentResponse:
    appointment = db.scalar(select(Appointment).where(Appointment.id == appointment_id))
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    return AppointmentResponse.model_validate(appointment)


@router.patch("/{appointment_id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    appointment_id: uuid.UUID,
    payload: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> AppointmentResponse:
    appointment = db.scalar(select(Appointment).where(Appointment.id == appointment_id))
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    appointment.status = payload.status
    db.commit()
    db.refresh(appointment)
    return AppointmentResponse.model_validate(appointment)


@router.delete("/{appointment_id}", response_model=MessageResponse)
def delete_appointment(
    appointment_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> MessageResponse:
    appointment = db.scalar(select(Appointment).where(Appointment.id == appointment_id))
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    db.delete(appointment)
    db.commit()
    return MessageResponse(message="Appointment deleted successfully")
