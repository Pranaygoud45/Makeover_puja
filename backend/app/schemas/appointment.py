import re
import uuid
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.appointment import AppointmentStatus


class AppointmentBase(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=255)
    mobile: str = Field(..., min_length=10, max_length=15)
    email: Optional[EmailStr] = None
    service: str = Field(..., min_length=1, max_length=255)
    preferred_date: date
    preferred_time: str = Field(..., min_length=1, max_length=20)
    special_requirements: Optional[str] = None
    message: Optional[str] = None

    @field_validator("mobile")
    @classmethod
    def validate_mobile(cls, value: str) -> str:
        digits = re.sub(r"\D", "", value.strip())
        if len(digits) == 12 and digits.startswith("91"):
            digits = digits[2:]
        if not re.fullmatch(r"\d{10}", digits):
            raise ValueError("Mobile number must be a valid 10-digit number")
        return digits


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    customer_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    mobile: Optional[str] = Field(default=None, min_length=10, max_length=15)
    email: Optional[EmailStr] = None
    service: Optional[str] = Field(default=None, min_length=1, max_length=255)
    preferred_date: Optional[date] = None
    preferred_time: Optional[str] = Field(default=None, min_length=1, max_length=20)
    special_requirements: Optional[str] = None
    message: Optional[str] = None
    status: Optional[AppointmentStatus] = None

    @field_validator("mobile")
    @classmethod
    def validate_mobile(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        digits = re.sub(r"\D", "", value.strip())
        if len(digits) == 12 and digits.startswith("91"):
            digits = digits[2:]
        if not re.fullmatch(r"\d{10}", digits):
            raise ValueError("Mobile number must be a valid 10-digit number")
        return digits


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus


class AppointmentResponse(AppointmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: AppointmentStatus
    created_at: datetime
    updated_at: datetime
