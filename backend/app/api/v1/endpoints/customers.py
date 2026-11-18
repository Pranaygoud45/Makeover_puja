from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.appointment import Appointment
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.services.auth import require_admin

router = APIRouter()


class CustomerSummary(BaseModel):
    customer_name: str
    mobile: str
    email: Optional[str] = None
    booking_count: int
    last_visit: date


@router.get("", response_model=PaginatedResponse[CustomerSummary])
def list_customers(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> PaginatedResponse[CustomerSummary]:
    agg_query = select(
        Appointment.mobile,
        func.max(Appointment.customer_name).label("customer_name"),
        func.max(Appointment.email).label("email"),
        func.count(Appointment.id).label("booking_count"),
        func.max(Appointment.preferred_date).label("last_visit"),
    ).group_by(Appointment.mobile)

    if search:
        term = f"%{search.strip()}%"
        agg_query = agg_query.having(
            func.max(Appointment.customer_name).ilike(term) | Appointment.mobile.ilike(term)
        )

    all_rows = db.execute(agg_query.order_by(func.max(Appointment.preferred_date).desc())).all()
    total = len(all_rows)
    start = (page - 1) * page_size
    page_rows = all_rows[start : start + page_size]

    items = [
        CustomerSummary(
            customer_name=row.customer_name,
            mobile=row.mobile,
            email=row.email,
            booking_count=row.booking_count,
            last_visit=row.last_visit,
        )
        for row in page_rows
    ]
    return PaginatedResponse.create(items=items, total=total, page=page, page_size=page_size)
