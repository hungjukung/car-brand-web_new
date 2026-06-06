from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from api.core.database import get_db
from api.schemas.car import CarSearchResult, CarListItem
from api.services import search_service, car_service, photo_service

router = APIRouter()


@router.get("", response_model=CarSearchResult)
async def search(
    q: str = Query("", description="搜尋關鍵字"),
    body_type: Optional[str] = None,
    fuel_type: Optional[str] = None,
    min_hp: Optional[int] = None,
    max_price: Optional[int] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    es_result = await search_service.search_cars(
        query=q,
        body_type=body_type,
        min_hp=min_hp,
        max_price=max_price,
        fuel_type=fuel_type,
        page=page,
        page_size=page_size,
    )

    if not es_result["ids"]:
        # Fallback: direct DB search
        total, cars = await car_service.get_cars_list(
            db, page=page, page_size=page_size, body_type=body_type
        )
        ids_in_order = [c.id for c in cars]
        cars_map = {c.id: c for c in cars}
    else:
        total = es_result["total"]
        cars = await car_service.get_cars_for_compare(db, es_result["ids"])
        cars_map = {c.id: c for c in cars}
        ids_in_order = es_result["ids"]

    items = []
    for cid in ids_in_order:
        car = cars_map.get(cid)
        if not car:
            continue
        prices = [s.msrp for s in car.specs if s.msrp]
        hps = [s.horsepower for s in car.specs if s.horsepower]
        items.append(CarListItem(
            id=car.id,
            brand_name_en=car.brand.name_en,
            brand_name_zh=car.brand.name_zh,
            model_en=car.model_en,
            model_zh=car.model_zh,
            year_start=car.year_start,
            year_end=car.year_end,
            body_type=car.body_type,
            hero_image_url=photo_service.get_car_photo_url(
                car.brand.name_en, car.model_en, car.year_start
            ),
            min_price=min(prices) if prices else None,
            max_price=max(prices) if prices else None,
            min_horsepower=min(hps) if hps else None,
        ))

    return {"total": total if es_result["ids"] else total, "page": page, "page_size": page_size, "items": items}
