import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.blog import BlogPost
from app.models.user import User
from app.schemas.blog import BlogPostCreate, BlogPostResponse, BlogPostUpdate
from app.schemas.common import MessageResponse, PaginatedResponse
from app.services.auth import require_admin
from app.utils.pagination import paginate

router = APIRouter()


@router.get("", response_model=PaginatedResponse[BlogPostResponse])
def list_published_posts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> PaginatedResponse[BlogPostResponse]:
    query = (
        select(BlogPost)
        .where(BlogPost.is_published.is_(True))
        .order_by(BlogPost.published_at.desc().nullslast(), BlogPost.created_at.desc())
    )
    return paginate(db, query, page=page, page_size=page_size, schema=BlogPostResponse)


@router.get("/admin", response_model=PaginatedResponse[BlogPostResponse])
def list_all_posts_admin(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    published_only: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> PaginatedResponse[BlogPostResponse]:
    query = select(BlogPost)
    if published_only is not None:
        query = query.where(BlogPost.is_published.is_(published_only))
    query = query.order_by(BlogPost.created_at.desc())
    return paginate(db, query, page=page, page_size=page_size, schema=BlogPostResponse)


@router.get("/{slug}", response_model=BlogPostResponse)
def get_post_by_slug(slug: str, db: Session = Depends(get_db)) -> BlogPostResponse:
    post = db.scalar(
        select(BlogPost).where(BlogPost.slug == slug, BlogPost.is_published.is_(True))
    )
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog post not found")
    return BlogPostResponse.model_validate(post)


@router.post("", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    payload: BlogPostCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> BlogPostResponse:
    existing = db.scalar(select(BlogPost).where(BlogPost.slug == payload.slug))
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Blog post slug already exists")

    data = payload.model_dump()
    if data.get("is_published") and data.get("published_at") is None:
        data["published_at"] = datetime.now(timezone.utc)

    post = BlogPost(**data)
    db.add(post)
    db.commit()
    db.refresh(post)
    return BlogPostResponse.model_validate(post)


@router.put("/{post_id}", response_model=BlogPostResponse)
def update_post(
    post_id: uuid.UUID,
    payload: BlogPostUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> BlogPostResponse:
    post = db.scalar(select(BlogPost).where(BlogPost.id == post_id))
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog post not found")

    update_data = payload.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != post.slug:
        conflict = db.scalar(select(BlogPost).where(BlogPost.slug == update_data["slug"]))
        if conflict is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Blog post slug already exists")

    if update_data.get("is_published") and post.published_at is None and "published_at" not in update_data:
        update_data["published_at"] = datetime.now(timezone.utc)

    for field, value in update_data.items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return BlogPostResponse.model_validate(post)


@router.delete("/{post_id}", response_model=MessageResponse)
def delete_post(
    post_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> MessageResponse:
    post = db.scalar(select(BlogPost).where(BlogPost.id == post_id))
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog post not found")
    db.delete(post)
    db.commit()
    return MessageResponse(message="Blog post deleted successfully")
