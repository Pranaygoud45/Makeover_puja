from fastapi import APIRouter

from app.api.v1.endpoints import (
    appointments,
    auth,
    blog,
    customers,
    dashboard,
    gallery,
    offers,
    packages,
    services,
    settings,
    staff,
    testimonials,
)

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(services.router, prefix="/services", tags=["services"])
router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
router.include_router(gallery.router, prefix="/gallery", tags=["gallery"])
router.include_router(testimonials.router, prefix="/testimonials", tags=["testimonials"])
router.include_router(packages.router, prefix="/packages", tags=["packages"])
router.include_router(blog.router, prefix="/blog", tags=["blog"])
router.include_router(offers.router, prefix="/offers", tags=["offers"])
router.include_router(staff.router, prefix="/staff", tags=["staff"])
router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
router.include_router(settings.router, prefix="/settings", tags=["settings"])
router.include_router(customers.router, prefix="/customers", tags=["customers"])
