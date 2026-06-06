from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from api.core.database import get_db
from api.schemas.car import CarCompareItem, CarSpecOut
from api.services import car_service, photo_service

router = APIRouter()


@router.get("", response_model=List[CarCompareItem])
async def compare_cars(
    ids: List[int] = Query(..., description="Car generation IDs to compare (max 4)"),
    db: AsyncSession = Depends(get_db),
):
    ids = ids[:4]
    cars = await car_service.get_cars_for_compare(db, ids)
    return [
        CarCompareItem(
            id=car.id,
            brand_name_zh=car.brand.name_zh,
            model_zh=car.model_zh,
            year_start=car.year_start,
            body_type=car.body_type.value,
            hero_image_url=photo_service.get_car_photo_url(
                car.brand.name_en, car.model_en, car.year_start
            ),
            specs=[CarSpecOut.model_validate(s) for s in car.specs],
        )
        for car in cars
    ]
