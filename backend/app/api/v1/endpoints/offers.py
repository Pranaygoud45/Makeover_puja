import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.offer import Offer
from app.models.user import User
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.offer import OfferCreate, OfferResponse, OfferUpdate
from app.services.auth import require_admin
from app.utils.pagination import paginate

router = APIRouter()


@router.get("", response_model=PaginatedResponse[OfferResponse])
def list_offers(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    active_only: bool = Query(default=True),
    db: Session = Depends(get_db),
) -> PaginatedResponse[OfferResponse]:
    query = select(Offer)
    if active_only:
        query = query.where(Offer.is_active.is_(True))
    query = query.order_by(Offer.created_at.desc())
    return paginate(db, query, page=page, page_size=page_size, schema=OfferResponse)


@router.get("/{offer_id}", response_model=OfferResponse)
def get_offer(offer_id: uuid.UUID, db: Session = Depends(get_db)) -> OfferResponse:
    offer = db.scalar(select(Offer).where(Offer.id == offer_id))
    if offer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found")
    return OfferResponse.model_validate(offer)


@router.post("", response_model=OfferResponse, status_code=status.HTTP_201_CREATED)
def create_offer(
    payload: OfferCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> OfferResponse:
    offer = Offer(**payload.model_dump())
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return OfferResponse.model_validate(offer)


@router.put("/{offer_id}", response_model=OfferResponse)
def update_offer(
    offer_id: uuid.UUID,
    payload: OfferUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> OfferResponse:
    offer = db.scalar(select(Offer).where(Offer.id == offer_id))
    if offer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(offer, field, value)
    db.commit()
    db.refresh(offer)
    return OfferResponse.model_validate(offer)


@router.delete("/{offer_id}", response_model=MessageResponse)
def delete_offer(
    offer_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> MessageResponse:
    offer = db.scalar(select(Offer).where(Offer.id == offer_id))
    if offer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found")
    db.delete(offer)
    db.commit()
    return MessageResponse(message="Offer deleted successfully")
