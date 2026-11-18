import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.service import Service, ServiceCategory
from app.models.user import User
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.service import (
    ServiceCategoryCreate,
    ServiceCategoryResponse,
    ServiceCategoryUpdate,
    ServiceCreate,
    ServiceResponse,
    ServiceUpdate,
)
from app.services.auth import require_admin
from app.utils.pagination import paginate

router = APIRouter()


# --- Service Categories ---

@router.get("/categories", response_model=PaginatedResponse[ServiceCategoryResponse])
def list_categories(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    active_only: bool = Query(default=True),
    db: Session = Depends(get_db),
) -> PaginatedResponse[ServiceCategoryResponse]:
    query = select(ServiceCategory).options(selectinload(ServiceCategory.services))
    if active_only:
        query = query.where(ServiceCategory.is_active.is_(True))
    query = query.order_by(ServiceCategory.sort_order.asc(), ServiceCategory.name.asc())
    return paginate(db, query, page=page, page_size=page_size, schema=ServiceCategoryResponse)


@router.get("/categories/{slug}", response_model=ServiceCategoryResponse)
def get_category_by_slug(slug: str, db: Session = Depends(get_db)) -> ServiceCategoryResponse:
    category = db.scalar(
        select(ServiceCategory)
        .options(selectinload(ServiceCategory.services))
        .where(ServiceCategory.slug == slug)
    )
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service category not found")
    return ServiceCategoryResponse.model_validate(category)


@router.post("/categories", response_model=ServiceCategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: ServiceCategoryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> ServiceCategoryResponse:
    existing = db.scalar(select(ServiceCategory).where(ServiceCategory.slug == payload.slug))
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category slug already exists")

    category = ServiceCategory(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return ServiceCategoryResponse.model_validate(category)


@router.put("/categories/{category_id}", response_model=ServiceCategoryResponse)
def update_category(
    category_id: uuid.UUID,
    payload: ServiceCategoryUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> ServiceCategoryResponse:
    category = db.scalar(
        select(ServiceCategory)
        .options(selectinload(ServiceCategory.services))
        .where(ServiceCategory.id == category_id)
    )
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service category not found")

    update_data = payload.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != category.slug:
        conflict = db.scalar(select(ServiceCategory).where(ServiceCategory.slug == update_data["slug"]))
        if conflict is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category slug already exists")

    for field, value in update_data.items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return ServiceCategoryResponse.model_validate(category)


@router.delete("/categories/{category_id}", response_model=MessageResponse)
def delete_category(
    category_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> MessageResponse:
    category = db.scalar(select(ServiceCategory).where(ServiceCategory.id == category_id))
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service category not found")
    db.delete(category)
    db.commit()
    return MessageResponse(message="Service category deleted successfully")


# --- Individual Services ---

@router.get("", response_model=PaginatedResponse[ServiceResponse])
def list_services(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    category_id: Optional[uuid.UUID] = Query(default=None),
    is_popular: Optional[bool] = Query(default=None),
    active_only: bool = Query(default=True),
    db: Session = Depends(get_db),
) -> PaginatedResponse[ServiceResponse]:
    query = select(Service)
    if active_only:
        query = query.where(Service.is_active.is_(True))
    if category_id is not None:
        query = query.where(Service.category_id == category_id)
    if is_popular is not None:
        query = query.where(Service.is_popular.is_(is_popular))
    query = query.order_by(Service.sort_order.asc(), Service.name.asc())
    return paginate(db, query, page=page, page_size=page_size, schema=ServiceResponse)


@router.get("/{slug}", response_model=ServiceResponse)
def get_service_by_slug(slug: str, db: Session = Depends(get_db)) -> ServiceResponse:
    service = db.scalar(select(Service).where(Service.slug == slug))
    if service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return ServiceResponse.model_validate(service)


@router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(
    payload: ServiceCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> ServiceResponse:
    category = db.scalar(select(ServiceCategory).where(ServiceCategory.id == payload.category_id))
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service category not found")
    existing = db.scalar(select(Service).where(Service.slug == payload.slug))
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Service slug already exists")

    service = Service(**payload.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return ServiceResponse.model_validate(service)


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: uuid.UUID,
    payload: ServiceUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> ServiceResponse:
    service = db.scalar(select(Service).where(Service.id == service_id))
    if service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    update_data = payload.model_dump(exclude_unset=True)
    if "category_id" in update_data:
        category = db.scalar(select(ServiceCategory).where(ServiceCategory.id == update_data["category_id"]))
        if category is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service category not found")
    if "slug" in update_data and update_data["slug"] != service.slug:
        conflict = db.scalar(select(Service).where(Service.slug == update_data["slug"]))
        if conflict is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Service slug already exists")

    for field, value in update_data.items():
        setattr(service, field, value)
    db.commit()
    db.refresh(service)
    return ServiceResponse.model_validate(service)


@router.delete("/{service_id}", response_model=MessageResponse)
def delete_service(
    service_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> MessageResponse:
    service = db.scalar(select(Service).where(Service.id == service_id))
    if service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    db.delete(service)
    db.commit()
    return MessageResponse(message="Service deleted successfully")
