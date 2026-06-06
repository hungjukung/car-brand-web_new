from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis
from typing import Optional
import json

from api.core.database import get_db
from api.core.redis import get_redis
from api.schemas.car import CarGenerationOut, CarSearchResult, CarListItem, BrandOut
from api.services import car_service, cache_service, photo_service

router = APIRouter()


@router.get("/brands", response_model=list[BrandOut])
async def list_brands(db: AsyncSession = Depends(get_db)):
    brands = await car_service.get_brands(db)
    return brands


@router.get("", response_model=CarSearchResult)
async def list_cars(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    brand: Optional[str] = None,
    body_type: Optional[str] = None,
    fuel_type: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    min_hp: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    cache_key = f"cars:list:v2:{page}:{page_size}:{brand}:{body_type}:{fuel_type}:{min_price}:{max_price}:{min_hp}"
    cached = await cache_service.get_cached(redis, cache_key)
    if cached:
        return cached

    total, cars = await car_service.get_cars_list(
        db, page=page, page_size=page_size,
        brand=brand, body_type=body_type, fuel_type=fuel_type,
        min_price=min_price, max_price=max_price, min_hp=min_hp,
    )

    items = []
    for car in cars:
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

    result = {"total": total, "page": page, "page_size": page_size, "items": [i.model_dump() for i in items]}
    await cache_service.set_cached(redis, cache_key, result, ttl=300)
    return result


@router.get("/{brand}/{model}", response_model=CarGenerationOut)
async def get_car_detail(
    brand: str,
    model: str,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    cache_key = f"car:detail:v2:{brand}:{model}"
    cached = await cache_service.get_cached(redis, cache_key)
    if cached:
        return cached

    car = await car_service.get_car_detail(db, brand, model)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    result = CarGenerationOut.model_validate(car)
    result.hero_image_url = photo_service.get_car_photo_url(
        car.brand.name_en, car.model_en, car.year_start
    )
    await cache_service.set_cached(redis, cache_key, result.model_dump(), ttl=86400)
    return result


@router.get("/{brand}", response_model=list[CarGenerationOut])
async def get_brand_cars(
    brand: str,
    db: AsyncSession = Depends(get_db),
):
    cars = await car_service.get_cars_by_brand(db, brand)
    if not cars:
        raise HTTPException(status_code=404, detail="Brand not found")
    results = []
    for car in cars:
        item = CarGenerationOut.model_validate(car)
        item.hero_image_url = photo_service.get_car_photo_url(
            car.brand.name_en, car.model_en, car.year_start
        )
        results.append(item)
    return results
