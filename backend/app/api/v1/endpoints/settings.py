from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.settings import BusinessSettings
from app.models.user import User
from app.services.auth import require_admin

router = APIRouter()


class SettingsUpdateRequest(BaseModel):
    settings: dict[str, Any]


@router.get("")
def get_settings(db: Session = Depends(get_db)) -> dict[str, str]:
    rows = db.scalars(select(BusinessSettings).order_by(BusinessSettings.key.asc())).all()
    return {row.key: row.value for row in rows}


@router.put("")
def update_settings(
    payload: SettingsUpdateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> dict[str, str]:
    existing_rows = {
        row.key: row
        for row in db.scalars(select(BusinessSettings)).all()
    }

    for key, value in payload.settings.items():
        str_value = str(value) if value is not None else ""
        if key in existing_rows:
            existing_rows[key].value = str_value
        else:
            db.add(BusinessSettings(key=key, value=str_value))

    db.commit()
    rows = db.scalars(select(BusinessSettings).order_by(BusinessSettings.key.asc())).all()
    return {row.key: row.value for row in rows}
