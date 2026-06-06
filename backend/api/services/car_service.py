from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from typing import Optional
from api.models.car import Brand, CarGeneration, CarSpec


async def get_brands(db: AsyncSession) -> list[Brand]:
    result = await db.execute(
        select(Brand).where(Brand.is_active == True).order_by(Brand.name_en)
    )
    return result.scalars().all()


async def get_brand_by_slug(db: AsyncSession, slug: str) -> Brand | None:
    result = await db.execute(
        select(Brand).where(Brand.name_en.ilike(slug))
    )
    return result.scalar_one_or_none()


async def get_cars_by_brand(db: AsyncSession, brand_slug: str) -> list[CarGeneration]:
    result = await db.execute(
        select(CarGeneration)
        .join(Brand)
        .where(Brand.name_en.ilike(brand_slug), CarGeneration.is_active == True)
        .options(selectinload(CarGeneration.brand), selectinload(CarGeneration.specs))
        .order_by(CarGeneration.model_en)
    )
    return result.scalars().all()


async def get_car_detail(
    db: AsyncSession, brand_slug: str, model_slug: str
) -> CarGeneration | None:
    result = await db.execute(
        select(CarGeneration)
        .join(Brand)
        .where(
            Brand.name_en.ilike(brand_slug),
            or_(
                CarGeneration.model_en.ilike(model_slug),
                CarGeneration.model_en.ilike(model_slug.replace("-", " ")),
            ),
            CarGeneration.is_active == True,
        )
        .options(selectinload(CarGeneration.brand), selectinload(CarGeneration.specs))
    )
    return result.scalar_one_or_none()


async def get_cars_list(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 20,
    brand: Optional[str] = None,
    body_type: Optional[str] = None,
    fuel_type: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    min_hp: Optional[int] = None,
) -> tuple[int, list[CarGeneration]]:
    query = (
        select(CarGeneration)
        .join(Brand)
        .where(CarGeneration.is_active == True)
        .options(selectinload(CarGeneration.brand), selectinload(CarGeneration.specs))
    )
    if brand:
        query = query.where(Brand.name_en.ilike(brand))
    if body_type:
        query = query.where(CarGeneration.body_type == body_type)

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    items = (
        await db.execute(
            query.offset((page - 1) * page_size).limit(page_size)
            .order_by(Brand.name_en, CarGeneration.model_en)
        )
    ).scalars().all()

    return total, items


async def get_cars_for_compare(db: AsyncSession, ids: list[int]) -> list[CarGeneration]:
    result = await db.execute(
        select(CarGeneration)
        .where(CarGeneration.id.in_(ids))
        .options(selectinload(CarGeneration.brand), selectinload(CarGeneration.specs))
    )
    return result.scalars().all()
