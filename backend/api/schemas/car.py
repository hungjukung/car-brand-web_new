from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from decimal import Decimal
from api.models.car import BodyType, FuelType, DrivetrainType, TransmissionType


class BrandBase(BaseModel):
    name_en: str
    name_zh: str
    country: Optional[str] = None
    logo_url: Optional[str] = None


class BrandOut(BrandBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class CarSpecOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    trim_name: str
    engine_code: Optional[str] = None
    displacement: Optional[Decimal] = None
    horsepower: Optional[int] = None
    torque: Optional[int] = None
    fuel_type: FuelType
    cylinder_count: Optional[int] = None
    acceleration: Optional[Decimal] = None
    top_speed: Optional[int] = None
    fuel_consumption: Optional[Decimal] = None
    length: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    wheelbase: Optional[int] = None
    curb_weight: Optional[int] = None
    drivetrain: Optional[DrivetrainType] = None
    transmission: Optional[TransmissionType] = None
    gear_count: Optional[int] = None
    seat_count: Optional[int] = None
    trunk_capacity: Optional[int] = None
    battery_capacity: Optional[Decimal] = None
    electric_range: Optional[int] = None
    motor_power: Optional[int] = None
    msrp: Optional[int] = None


class CarGenerationBase(BaseModel):
    model_en: str
    model_zh: str
    generation: int = 1
    year_start: int
    year_end: Optional[int] = None
    body_type: BodyType
    description: Optional[str] = None
    hero_image_url: Optional[str] = None


class CarGenerationOut(CarGenerationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    brand: BrandOut
    specs: List[CarSpecOut] = []


class CarListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    brand_name_en: str
    brand_name_zh: str
    model_en: str
    model_zh: str
    year_start: int
    year_end: Optional[int] = None
    body_type: BodyType
    hero_image_url: Optional[str] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    min_horsepower: Optional[int] = None


class CarSearchResult(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[CarListItem]


class CarCompareItem(BaseModel):
    id: int
    brand_name_zh: str
    model_zh: str
    year_start: int
    body_type: str
    hero_image_url: Optional[str] = None
    specs: List[CarSpecOut]
