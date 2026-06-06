import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Numeric, DateTime, ForeignKey,
    Enum as SAEnum, Boolean
)
from sqlalchemy.orm import relationship
from api.core.database import Base


class BodyType(str, enum.Enum):
    sedan = "sedan"
    suv = "suv"
    hatchback = "hatchback"
    coupe = "coupe"
    convertible = "convertible"
    wagon = "wagon"
    pickup = "pickup"
    van = "van"
    sports = "sports"
    mpv = "mpv"


class FuelType(str, enum.Enum):
    gasoline = "gasoline"
    diesel = "diesel"
    hybrid = "hybrid"
    phev = "phev"
    electric = "electric"
    hydrogen = "hydrogen"


class DrivetrainType(str, enum.Enum):
    fwd = "FWD"
    rwd = "RWD"
    awd = "AWD"
    four_wd = "4WD"


class TransmissionType(str, enum.Enum):
    manual = "manual"
    automatic = "automatic"
    cvt = "CVT"
    dct = "DCT"
    amt = "AMT"


class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String(50), unique=True, nullable=False)
    name_zh = Column(String(50), nullable=False)
    country = Column(String(50))
    logo_url = Column(Text)
    is_active = Column(Boolean, default=True)

    generations = relationship("CarGeneration", back_populates="brand")


class CarGeneration(Base):
    __tablename__ = "car_generations"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    model_en = Column(String(100), nullable=False)
    model_zh = Column(String(100), nullable=False)
    generation = Column(Integer, default=1)
    year_start = Column(Integer, nullable=False)
    year_end = Column(Integer, nullable=True)
    body_type = Column(SAEnum(BodyType), nullable=False)
    description = Column(Text)
    hero_image_url = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    brand = relationship("Brand", back_populates="generations")
    specs = relationship("CarSpec", back_populates="generation")


class CarSpec(Base):
    __tablename__ = "car_specs"

    id = Column(Integer, primary_key=True, index=True)
    generation_id = Column(Integer, ForeignKey("car_generations.id"), nullable=False)
    trim_name = Column(String(100), nullable=False)

    # Engine
    engine_code = Column(String(50))
    displacement = Column(Numeric(4, 1))
    horsepower = Column(Integer)
    torque = Column(Integer)
    fuel_type = Column(SAEnum(FuelType), nullable=False)
    cylinder_count = Column(Integer)

    # Performance
    acceleration = Column(Numeric(4, 2))
    top_speed = Column(Integer)
    fuel_consumption = Column(Numeric(4, 2))

    # Dimensions
    length = Column(Integer)
    width = Column(Integer)
    height = Column(Integer)
    wheelbase = Column(Integer)
    curb_weight = Column(Integer)

    # Drivetrain
    drivetrain = Column(SAEnum(DrivetrainType))
    transmission = Column(SAEnum(TransmissionType))
    gear_count = Column(Integer)

    # Capacity
    seat_count = Column(Integer, default=5)
    trunk_capacity = Column(Integer)

    # Electric / Hybrid
    battery_capacity = Column(Numeric(5, 1))
    electric_range = Column(Integer)
    motor_power = Column(Integer)

    # Price
    msrp = Column(Integer)

    created_at = Column(DateTime, default=datetime.utcnow)

    generation = relationship("CarGeneration", back_populates="specs")
