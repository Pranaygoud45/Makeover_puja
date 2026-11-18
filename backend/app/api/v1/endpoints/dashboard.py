from datetime import date
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.appointment import Appointment, AppointmentStatus
from app.models.blog import BlogPost
from app.models.gallery import GalleryImage
from app.models.offer import Offer
from app.models.package import Package
from app.models.service import Service, ServiceCategory
from app.models.staff import StaffMember
from app.models.testimonial import Testimonial
from app.models.user import User
from app.services.auth import require_admin

router = APIRouter()


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> dict[str, Any]:
    today = date.today()
    status_rows = db.execute(
        select(Appointment.status, func.count(Appointment.id)).group_by(Appointment.status)
    ).all()
    counts_by_status = {status.value: 0 for status in AppointmentStatus}
    for appt_status, count in status_rows:
        counts_by_status[appt_status.value] = count

    todays_appointments = db.scalar(
        select(func.count(Appointment.id)).where(Appointment.preferred_date == today)
    ) or 0

    return {
        "appointments": {
            "total": sum(counts_by_status.values()),
            "today": todays_appointments,
            "by_status": counts_by_status,
        },
        "services": {
            "total": db.scalar(select(func.count(Service.id))) or 0,
            "categories": db.scalar(select(func.count(ServiceCategory.id))) or 0,
        },
        "packages": db.scalar(select(func.count(Package.id))) or 0,
        "testimonials": {
            "total": db.scalar(select(func.count(Testimonial.id))) or 0,
            "approved": db.scalar(
                select(func.count(Testimonial.id)).where(Testimonial.is_approved.is_(True))
            ) or 0,
        },
        "gallery_images": db.scalar(select(func.count(GalleryImage.id))) or 0,
        "blog_posts": db.scalar(select(func.count(BlogPost.id))) or 0,
        "offers": db.scalar(select(func.count(Offer.id))) or 0,
        "staff": db.scalar(select(func.count(StaffMember.id))) or 0,
    }


@router.get("/reports")
def get_dashboard_reports(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> dict[str, Any]:
    top_services_rows = db.execute(
        select(Appointment.service, func.count(Appointment.id).label("bookings"))
        .group_by(Appointment.service)
        .order_by(func.count(Appointment.id).desc())
        .limit(10)
    ).all()

    status_rows = db.execute(
        select(Appointment.status, func.count(Appointment.id)).group_by(Appointment.status)
    ).all()
    status_breakdown = {status.value: 0 for status in AppointmentStatus}
    for appt_status, count in status_rows:
        status_breakdown[appt_status.value] = count

    unique_customers = db.scalar(select(func.count(func.distinct(Appointment.mobile)))) or 0
    total_appointments = sum(status_breakdown.values())
    completed = status_breakdown[AppointmentStatus.completed.value]
    completion_rate = round((completed / total_appointments) * 100, 2) if total_appointments > 0 else 0.0

    avg_rating = db.scalar(
        select(func.avg(Testimonial.rating)).where(Testimonial.is_approved.is_(True))
    )

    return {
        "summary": {
            "total_appointments": total_appointments,
            "unique_customers": unique_customers,
            "completion_rate_percent": completion_rate,
            "average_rating": round(float(avg_rating), 2) if avg_rating is not None else None,
        },
        "appointments_by_status": status_breakdown,
        "top_services": [
            {"service": service, "bookings": bookings} for service, bookings in top_services_rows
        ],
    }
