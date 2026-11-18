from typing import Any, Type, TypeVar

from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from app.schemas.common import PaginatedResponse

T = TypeVar("T")


def paginate(
    db: Session,
    query: Select[tuple[Any]],
    page: int = 1,
    page_size: int = 10,
    schema: Type[T] | None = None,
) -> PaginatedResponse[Any]:
    count_query = select(func.count()).select_from(query.order_by(None).subquery())
    total = db.scalar(count_query) or 0
    offset = (page - 1) * page_size
    rows = list(db.scalars(query.offset(offset).limit(page_size)).all())
    items = [schema.model_validate(row) for row in rows] if schema is not None else rows
    return PaginatedResponse.create(items=items, total=total, page=page, page_size=page_size)
