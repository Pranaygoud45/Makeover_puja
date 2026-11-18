from datetime import date

import pytest
from pydantic import ValidationError

from app.integrations.storage import build_media_url
from app.integrations.whatsapp import build_whatsapp_deep_link
from app.schemas.appointment import AppointmentCreate
from app.schemas.testimonial import TestimonialCreate
from app.services.auth import create_access_token, decode_token, hash_password, verify_password


def test_password_hash_and_verify():
    hashed = hash_password("SecretPass123")
    assert hashed != "SecretPass123"
    assert verify_password("SecretPass123", hashed) is True
    assert verify_password("WrongPass", hashed) is False


def test_jwt_create_and_decode():
    token = create_access_token({"sub": "1234", "role": "admin"})
    payload = decode_token(token)
    assert payload["sub"] == "1234"
    assert payload["role"] == "admin"


def test_appointment_mobile_validation():
    valid = AppointmentCreate(
        customer_name="Aarti",
        mobile="+91 9876543210",
        service="Bridal Makeup",
        preferred_date=date.today(),
        preferred_time="11:00 AM",
    )
    assert valid.mobile == "9876543210"

    with pytest.raises(ValidationError):
        AppointmentCreate(
            customer_name="Aarti",
            mobile="12345",
            service="Bridal Makeup",
            preferred_date=date.today(),
            preferred_time="11:00 AM",
        )


def test_testimonial_rating_bounds():
    with pytest.raises(ValidationError):
        TestimonialCreate(customer_name="Test", feedback="Nice", rating=6)
    with pytest.raises(ValidationError):
        TestimonialCreate(customer_name="Test", feedback="Nice", rating=0)


def test_integrations_helpers():
    link = build_whatsapp_deep_link("9876543210", "Hello Pooja Makeover")
    assert link.startswith("https://wa.me/919876543210?text=")
    assert build_media_url("gallery/pic.jpg") == "/uploads/gallery/pic.jpg"
