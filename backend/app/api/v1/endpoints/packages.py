import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.package import Package
from app.models.user import User
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.package import PackageCreate, PackageResponse, PackageUpdate
from app.services.auth import require_admin
from app.utils.pagination import paginate

router = APIRouter()


@router.get("", response_model=PaginatedResponse[PackageResponse])
def list_packages(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    category: Optional[str] = Query(default=None),
    active_only: bool = Query(default=True),
    db: Session = Depends(get_db),
) -> PaginatedResponse[PackageResponse]:
    query = select(Package)
    if active_only:
        query = query.where(Package.is_active.is_(True))
    if category:
        query = query.where(Package.category == category)
    query = query.order_by(Package.sort_order.asc(), Package.name.asc())
    return paginate(db, query, page=page, page_size=page_size, schema=PackageResponse)


@router.get("/{slug}", response_model=PackageResponse)
def get_package_by_slug(slug: str, db: Session = Depends(get_db)) -> PackageResponse:
    pkg = db.scalar(select(Package).where(Package.slug == slug))
    if pkg is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")
    return PackageResponse.model_validate(pkg)


@router.post("", response_model=PackageResponse, status_code=status.HTTP_201_CREATED)
def create_package(
    payload: PackageCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> PackageResponse:
    existing = db.scalar(select(Package).where(Package.slug == payload.slug))
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Package slug already exists")
    pkg = Package(**payload.model_dump())
    db.add(pkg)
    db.commit()
    db.refresh(pkg)
    return PackageResponse.model_validate(pkg)


@router.put("/{package_id}", response_model=PackageResponse)
def update_package(
    package_id: uuid.UUID,
    payload: PackageUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> PackageResponse:
    pkg = db.scalar(select(Package).where(Package.id == package_id))
    if pkg is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")

    update_data = payload.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != pkg.slug:
        conflict = db.scalar(select(Package).where(Package.slug == update_data["slug"]))
        if conflict is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Package slug already exists")

    for field, value in update_data.items():
        setattr(pkg, field, value)
    db.commit()
    db.refresh(pkg)
    return PackageResponse.model_validate(pkg)


@router.delete("/{package_id}", response_model=MessageResponse)
def delete_package(
    package_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> MessageResponse:
    pkg = db.scalar(select(Package).where(Package.id == package_id))
    if pkg is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")
    db.delete(pkg)
    db.commit()
    return MessageResponse(message="Package deleted successfully")
