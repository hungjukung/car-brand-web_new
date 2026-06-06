"""
Run: python seed_data.py
Seeds the database with sample car data.
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from api.models.car import (
    Brand, CarGeneration, CarSpec,
    BodyType, FuelType, DrivetrainType, TransmissionType
)
from api.core.database import Base

import os
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://caruser:carpassword@localhost:5432/cardb")

engine = create_async_engine(DATABASE_URL, echo=False)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

BRANDS = [
    {"name_en": "Toyota",   "name_zh": "豐田",    "country": "Japan"},
    {"name_en": "Honda",    "name_zh": "本田",    "country": "Japan"},
    {"name_en": "BMW",      "name_zh": "寶馬",    "country": "Germany"},
    {"name_en": "Mercedes", "name_zh": "賓士",    "country": "Germany"},
    {"name_en": "Mazda",    "name_zh": "馬自達",  "country": "Japan"},
    {"name_en": "Hyundai",  "name_zh": "現代",    "country": "South Korea"},
    {"name_en": "Ford",     "name_zh": "福特",    "country": "USA"},
    {"name_en": "Subaru",   "name_zh": "速霸陸",  "country": "Japan"},
    {"name_en": "Lexus",    "name_zh": "凌志",    "country": "Japan"},
    {"name_en": "Volkswagen","name_zh": "福斯",   "country": "Germany"},
]

CARS = [
    # Toyota
    {
        "brand": "Toyota", "model_en": "Camry", "model_zh": "凱美瑞",
        "generation": 9, "year_start": 2024, "year_end": None,
        "body_type": BodyType.sedan,
        "description": "豐田旗艦房車，寬敞舒適，搭載2.5L油電混合動力系統，兼具省油與動力。",
        "hero_image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
        "specs": [
            {
                "trim_name": "2.5G", "displacement": 2.5, "horsepower": 178, "torque": 221,
                "fuel_type": FuelType.gasoline, "acceleration": 8.4, "top_speed": 195,
                "fuel_consumption": 10.2, "length": 4920, "width": 1840, "height": 1445,
                "wheelbase": 2825, "curb_weight": 1545, "drivetrain": DrivetrainType.fwd,
                "transmission": TransmissionType.automatic, "gear_count": 8,
                "seat_count": 5, "trunk_capacity": 524, "msrp": 1088000,
            },
            {
                "trim_name": "2.5 Hybrid", "displacement": 2.5, "horsepower": 218, "torque": 221,
                "fuel_type": FuelType.hybrid, "acceleration": 7.2, "top_speed": 200,
                "fuel_consumption": 5.8, "length": 4920, "width": 1840, "height": 1445,
                "wheelbase": 2825, "curb_weight": 1640, "drivetrain": DrivetrainType.awd,
                "transmission": TransmissionType.cvt, "gear_count": 0,
                "seat_count": 5, "trunk_capacity": 493, "battery_capacity": 1.3, "msrp": 1388000,
            },
        ],
    },
    {
        "brand": "Toyota", "model_en": "GR86", "model_zh": "GR86",
        "generation": 2, "year_start": 2022, "year_end": None,
        "body_type": BodyType.sports,
        "description": "純正後驅跑車，搭載2.4L水平對臥引擎，回歸純粹駕駛樂趣。",
        "hero_image_url": "https://images.unsplash.com/photo-1541878117466-0e3000a65864?w=800",
        "specs": [
            {
                "trim_name": "2.4 Standard", "displacement": 2.4, "horsepower": 234, "torque": 250,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 6.3, "top_speed": 226, "fuel_consumption": 11.5,
                "length": 4265, "width": 1775, "height": 1310, "wheelbase": 2575,
                "curb_weight": 1270, "drivetrain": DrivetrainType.rwd,
                "transmission": TransmissionType.manual, "gear_count": 6,
                "seat_count": 4, "trunk_capacity": 237, "msrp": 1530000,
            },
            {
                "trim_name": "2.4 Premium", "displacement": 2.4, "horsepower": 234, "torque": 250,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 6.3, "top_speed": 226, "fuel_consumption": 11.5,
                "length": 4265, "width": 1775, "height": 1310, "wheelbase": 2575,
                "curb_weight": 1280, "drivetrain": DrivetrainType.rwd,
                "transmission": TransmissionType.automatic, "gear_count": 6,
                "seat_count": 4, "trunk_capacity": 237, "msrp": 1680000,
            },
        ],
    },
    {
        "brand": "Toyota", "model_en": "RAV4", "model_zh": "RAV4",
        "generation": 5, "year_start": 2019, "year_end": None,
        "body_type": BodyType.suv,
        "description": "全球熱銷SUV，多動力選擇，兼顧日常通勤與越野能力。",
        "hero_image_url": "https://images.unsplash.com/photo-1632137924251-fcea5ff46035?w=800",
        "specs": [
            {
                "trim_name": "2.0 汽油", "displacement": 2.0, "horsepower": 173, "torque": 203,
                "fuel_type": FuelType.gasoline, "acceleration": 10.1, "top_speed": 185,
                "fuel_consumption": 11.3, "length": 4600, "width": 1855, "height": 1685,
                "wheelbase": 2690, "curb_weight": 1560, "drivetrain": DrivetrainType.fwd,
                "transmission": TransmissionType.cvt, "seat_count": 5,
                "trunk_capacity": 580, "msrp": 1068000,
            },
            {
                "trim_name": "2.5 Hybrid AWD", "displacement": 2.5, "horsepower": 222, "torque": 221,
                "fuel_type": FuelType.hybrid, "acceleration": 8.1, "top_speed": 180,
                "fuel_consumption": 6.5, "length": 4600, "width": 1855, "height": 1685,
                "wheelbase": 2690, "curb_weight": 1780, "drivetrain": DrivetrainType.awd,
                "transmission": TransmissionType.cvt, "seat_count": 5,
                "trunk_capacity": 580, "battery_capacity": 1.6, "msrp": 1398000,
            },
        ],
    },
    {
        "brand": "Toyota", "model_en": "Crown", "model_zh": "Crown",
        "generation": 16, "year_start": 2023, "year_end": None,
        "body_type": BodyType.sedan,
        "description": "革命性跨界旗艦，融合轎車優雅與SUV高坐姿，油電四驅系統。",
        "hero_image_url": "https://images.pexels.com/photos/18362808/pexels-photo-18362808/free-photo-of-white-toyota-crown.jpeg?auto=compress&cs=tinysrgb&w=800",
        "specs": [
            {
                "trim_name": "2.5 Hybrid AWD", "displacement": 2.5, "horsepower": 236, "torque": 221,
                "fuel_type": FuelType.hybrid, "acceleration": 7.7, "top_speed": 200,
                "fuel_consumption": 5.9, "length": 4930, "width": 1840, "height": 1540,
                "wheelbase": 2850, "curb_weight": 1800, "drivetrain": DrivetrainType.awd,
                "transmission": TransmissionType.cvt, "seat_count": 5,
                "trunk_capacity": 531, "battery_capacity": 1.3, "msrp": 1988000,
            },
        ],
    },
    # Honda
    {
        "brand": "Honda", "model_en": "Civic", "model_zh": "Civic",
        "generation": 11, "year_start": 2022, "year_end": None,
        "body_type": BodyType.sedan,
        "description": "Honda全球熱銷房車，第11代更具運動氣息，1.5T渦輪引擎強勁有力。",
        "hero_image_url": "https://images.unsplash.com/photo-1742445129873-ccd0af96c60f?w=800",
        "specs": [
            {
                "trim_name": "1.5 VTEC Turbo", "displacement": 1.5, "horsepower": 182, "torque": 240,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 7.8, "top_speed": 212, "fuel_consumption": 9.5,
                "length": 4674, "width": 1802, "height": 1415, "wheelbase": 2735,
                "curb_weight": 1340, "drivetrain": DrivetrainType.fwd,
                "transmission": TransmissionType.cvt, "gear_count": 0,
                "seat_count": 5, "trunk_capacity": 519, "msrp": 988000,
            },
        ],
    },
    {
        "brand": "Honda", "model_en": "CR-V", "model_zh": "CR-V",
        "generation": 6, "year_start": 2023, "year_end": None,
        "body_type": BodyType.suv,
        "description": "Honda人氣跨界休旅，第六代更加寬敞，搭載e:HEV油電系統。",
        "hero_image_url": "https://images.unsplash.com/photo-1681697390363-1142eb46b76d?w=800",
        "specs": [
            {
                "trim_name": "1.5T", "displacement": 1.5, "horsepower": 192, "torque": 243,
                "fuel_type": FuelType.gasoline, "acceleration": 8.7, "top_speed": 185,
                "fuel_consumption": 10.8, "length": 4700, "width": 1866, "height": 1689,
                "wheelbase": 2701, "curb_weight": 1623, "drivetrain": DrivetrainType.awd,
                "transmission": TransmissionType.cvt, "seat_count": 5,
                "trunk_capacity": 589, "msrp": 1268000,
            },
            {
                "trim_name": "e:HEV", "displacement": 2.0, "horsepower": 204, "torque": 315,
                "fuel_type": FuelType.hybrid, "acceleration": 8.1, "top_speed": 180,
                "fuel_consumption": 6.9, "length": 4700, "width": 1866, "height": 1689,
                "wheelbase": 2701, "curb_weight": 1730, "drivetrain": DrivetrainType.awd,
                "transmission": TransmissionType.automatic, "seat_count": 5,
                "trunk_capacity": 589, "battery_capacity": 1.0, "msrp": 1488000,
            },
        ],
    },
    # BMW
    {
        "brand": "BMW", "model_en": "3 Series", "model_zh": "3系列",
        "generation": 7, "year_start": 2022, "year_end": None,
        "body_type": BodyType.sedan,
        "description": "BMW駕駛樂趣的最佳代言，後驅平衡完美，2.0T引擎動力充沛。",
        "hero_image_url": "https://images.unsplash.com/photo-1558486137-0634dd211be0?w=800",
        "specs": [
            {
                "trim_name": "320i", "displacement": 2.0, "horsepower": 184, "torque": 300,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 7.1, "top_speed": 250, "fuel_consumption": 9.4,
                "length": 4709, "width": 1827, "height": 1442, "wheelbase": 2851,
                "curb_weight": 1520, "drivetrain": DrivetrainType.rwd,
                "transmission": TransmissionType.automatic, "gear_count": 8,
                "seat_count": 5, "trunk_capacity": 480, "msrp": 2080000,
            },
            {
                "trim_name": "330i", "displacement": 2.0, "horsepower": 258, "torque": 400,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 5.8, "top_speed": 250, "fuel_consumption": 10.1,
                "length": 4709, "width": 1827, "height": 1442, "wheelbase": 2851,
                "curb_weight": 1545, "drivetrain": DrivetrainType.rwd,
                "transmission": TransmissionType.automatic, "gear_count": 8,
                "seat_count": 5, "trunk_capacity": 480, "msrp": 2480000,
            },
            {
                "trim_name": "M340i", "displacement": 3.0, "horsepower": 382, "torque": 500,
                "fuel_type": FuelType.gasoline, "cylinder_count": 6,
                "acceleration": 4.4, "top_speed": 250, "fuel_consumption": 11.0,
                "length": 4709, "width": 1827, "height": 1442, "wheelbase": 2851,
                "curb_weight": 1720, "drivetrain": DrivetrainType.awd,
                "transmission": TransmissionType.automatic, "gear_count": 8,
                "seat_count": 5, "trunk_capacity": 480, "msrp": 3680000,
            },
        ],
    },
    {
        "brand": "BMW", "model_en": "5 Series", "model_zh": "5系列",
        "generation": 8, "year_start": 2024, "year_end": None,
        "body_type": BodyType.sedan,
        "description": "全新第八代5系列，大幅進化科技配備，更長軸距帶來更寬敞後座。",
        "hero_image_url": "https://images.unsplash.com/photo-1552234816-0ea7b995a55c?w=800",
        "specs": [
            {
                "trim_name": "520i", "displacement": 2.0, "horsepower": 208, "torque": 330,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 7.5, "top_speed": 250, "fuel_consumption": 9.8,
                "length": 5060, "width": 1900, "height": 1515, "wheelbase": 2995,
                "curb_weight": 1765, "drivetrain": DrivetrainType.rwd,
                "transmission": TransmissionType.automatic, "gear_count": 8,
                "seat_count": 5, "trunk_capacity": 520, "msrp": 2980000,
            },
            {
                "trim_name": "530e", "displacement": 2.0, "horsepower": 299, "torque": 420,
                "fuel_type": FuelType.phev, "cylinder_count": 4,
                "acceleration": 6.2, "top_speed": 250, "fuel_consumption": 2.3,
                "length": 5060, "width": 1900, "height": 1515, "wheelbase": 2995,
                "curb_weight": 2015, "drivetrain": DrivetrainType.rwd,
                "transmission": TransmissionType.automatic, "gear_count": 8,
                "seat_count": 5, "trunk_capacity": 410, "battery_capacity": 19.4,
                "electric_range": 82, "msrp": 3780000,
            },
        ],
    },
    # Mercedes
    {
        "brand": "Mercedes", "model_en": "C-Class", "model_zh": "C-Class",
        "generation": 6, "year_start": 2022, "year_end": None,
        "body_type": BodyType.sedan,
        "description": "賓士中階旗艦，W206世代再次進化，豪華科技並重，MBUX升級更聰明。",
        "hero_image_url": "https://images.unsplash.com/photo-1604755940678-ffbf0c1fcc37?w=800",
        "specs": [
            {
                "trim_name": "C200", "displacement": 1.5, "horsepower": 204, "torque": 300,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 7.3, "top_speed": 250, "fuel_consumption": 9.2,
                "length": 4751, "width": 1820, "height": 1438, "wheelbase": 2865,
                "curb_weight": 1605, "drivetrain": DrivetrainType.rwd,
                "transmission": TransmissionType.automatic, "gear_count": 9,
                "seat_count": 5, "trunk_capacity": 455, "msrp": 2280000,
            },
            {
                "trim_name": "C300e AMG Line", "displacement": 2.0, "horsepower": 313, "torque": 550,
                "fuel_type": FuelType.phev, "cylinder_count": 4,
                "acceleration": 5.6, "top_speed": 250, "fuel_consumption": 1.9,
                "length": 4751, "width": 1820, "height": 1438, "wheelbase": 2865,
                "curb_weight": 1905, "drivetrain": DrivetrainType.rwd,
                "transmission": TransmissionType.automatic, "gear_count": 9,
                "seat_count": 5, "trunk_capacity": 345, "battery_capacity": 25.4,
                "electric_range": 100, "msrp": 3480000,
            },
        ],
    },
    # Mazda
    {
        "brand": "Mazda", "model_en": "CX-5", "model_zh": "CX-5",
        "generation": 2, "year_start": 2023, "year_end": None,
        "body_type": BodyType.suv,
        "description": "魂動設計美學代表作，精緻豪華內裝，2.5T引擎強勁性能。",
        "hero_image_url": "https://images.unsplash.com/photo-1643142311296-304953706775?w=800",
        "specs": [
            {
                "trim_name": "2.0 天悅型", "displacement": 2.0, "horsepower": 165, "torque": 213,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 9.8, "top_speed": 185, "fuel_consumption": 10.2,
                "length": 4575, "width": 1845, "height": 1680, "wheelbase": 2700,
                "curb_weight": 1540, "drivetrain": DrivetrainType.fwd,
                "transmission": TransmissionType.automatic, "gear_count": 6,
                "seat_count": 5, "trunk_capacity": 506, "msrp": 1028000,
            },
            {
                "trim_name": "2.5T 旗艦型 AWD", "displacement": 2.5, "horsepower": 228, "torque": 420,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 7.1, "top_speed": 200, "fuel_consumption": 11.8,
                "length": 4575, "width": 1845, "height": 1680, "wheelbase": 2700,
                "curb_weight": 1700, "drivetrain": DrivetrainType.awd,
                "transmission": TransmissionType.automatic, "gear_count": 6,
                "seat_count": 5, "trunk_capacity": 506, "msrp": 1568000,
            },
        ],
    },
    {
        "brand": "Mazda", "model_en": "Mazda3", "model_zh": "Mazda3",
        "generation": 4, "year_start": 2019, "year_end": None,
        "body_type": BodyType.sedan,
        "description": "工藝品般的緊湊房車，2.5L自然進氣搭載創馳藍天技術，油耗優異。",
        "hero_image_url": "https://images.unsplash.com/photo-1495364152808-2676f284aac8?w=800",
        "specs": [
            {
                "trim_name": "2.0 尊榮型", "displacement": 2.0, "horsepower": 165, "torque": 213,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 8.5, "top_speed": 210, "fuel_consumption": 9.2,
                "length": 4662, "width": 1797, "height": 1440, "wheelbase": 2726,
                "curb_weight": 1345, "drivetrain": DrivetrainType.fwd,
                "transmission": TransmissionType.automatic, "gear_count": 6,
                "seat_count": 5, "trunk_capacity": 444, "msrp": 868000,
            },
        ],
    },
    # Hyundai
    {
        "brand": "Hyundai", "model_en": "Tucson", "model_zh": "Tucson",
        "generation": 4, "year_start": 2021, "year_end": None,
        "body_type": BodyType.suv,
        "description": "大膽參數化設計，引領韓系SUV美學革命，HTRAC全輪驅動系統。",
        "hero_image_url": "https://images.unsplash.com/photo-1575090536203-2a6193126514?w=800",
        "specs": [
            {
                "trim_name": "1.6T 旗艦版", "displacement": 1.6, "horsepower": 180, "torque": 265,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 9.5, "top_speed": 195, "fuel_consumption": 10.6,
                "length": 4500, "width": 1865, "height": 1650, "wheelbase": 2680,
                "curb_weight": 1558, "drivetrain": DrivetrainType.fwd,
                "transmission": TransmissionType.dct, "gear_count": 7,
                "seat_count": 5, "trunk_capacity": 620, "msrp": 1028000,
            },
        ],
    },
    # Ford
    {
        "brand": "Ford", "model_en": "Mustang", "model_zh": "野馬",
        "generation": 7, "year_start": 2024, "year_end": None,
        "body_type": BodyType.coupe,
        "description": "美式肌肉車傳奇，第七代野馬搭載5.0V8引擎，傳統V8轟鳴永不過時。",
        "hero_image_url": "https://images.unsplash.com/photo-1567284575269-d4be568f1072?w=800",
        "specs": [
            {
                "trim_name": "2.3 EcoBoost", "displacement": 2.3, "horsepower": 315, "torque": 448,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 5.8, "top_speed": 233, "fuel_consumption": 12.4,
                "length": 4788, "width": 1916, "height": 1394, "wheelbase": 2720,
                "curb_weight": 1656, "drivetrain": DrivetrainType.rwd,
                "transmission": TransmissionType.automatic, "gear_count": 10,
                "seat_count": 4, "trunk_capacity": 408, "msrp": 1980000,
            },
            {
                "trim_name": "5.0 V8 GT", "displacement": 5.0, "horsepower": 450, "torque": 529,
                "fuel_type": FuelType.gasoline, "cylinder_count": 8,
                "acceleration": 4.3, "top_speed": 250, "fuel_consumption": 15.7,
                "length": 4788, "width": 1916, "height": 1394, "wheelbase": 2720,
                "curb_weight": 1824, "drivetrain": DrivetrainType.rwd,
                "transmission": TransmissionType.manual, "gear_count": 6,
                "seat_count": 4, "trunk_capacity": 408, "msrp": 2680000,
            },
        ],
    },
    # Subaru
    {
        "brand": "Subaru", "model_en": "WRX", "model_zh": "WRX",
        "generation": 5, "year_start": 2022, "year_end": None,
        "body_type": BodyType.sedan,
        "description": "拉力賽道的街道版，2.4T水平對臥引擎搭配對稱式AWD，操控樂趣一流。",
        "hero_image_url": "https://images.unsplash.com/photo-1572471275423-a6e40c020a46?w=800",
        "specs": [
            {
                "trim_name": "2.4T", "displacement": 2.4, "horsepower": 271, "torque": 350,
                "fuel_type": FuelType.gasoline, "cylinder_count": 4,
                "acceleration": 5.4, "top_speed": 240, "fuel_consumption": 12.5,
                "length": 4670, "width": 1825, "height": 1480, "wheelbase": 2670,
                "curb_weight": 1521, "drivetrain": DrivetrainType.awd,
                "transmission": TransmissionType.manual, "gear_count": 6,
                "seat_count": 5, "trunk_capacity": 361, "msrp": 1680000,
            },
        ],
    },
    # Lexus
    {
        "brand": "Lexus", "model_en": "LC500", "model_zh": "LC500",
        "generation": 1, "year_start": 2017, "year_end": None,
        "body_type": BodyType.coupe,
        "description": "凌志旗艦跑車，5.0L自然進氣V8引擎，車身設計令人窒息的美麗。",
        "hero_image_url": "https://images.unsplash.com/photo-1577496549771-036979fd95e2?w=800",
        "specs": [
            {
                "trim_name": "5.0 V8", "displacement": 5.0, "horsepower": 477, "torque": 540,
                "fuel_type": FuelType.gasoline, "cylinder_count": 8,
                "acceleration": 4.4, "top_speed": 270, "fuel_consumption": 16.4,
                "length": 4770, "width": 1920, "height": 1350, "wheelbase": 2870,
                "curb_weight": 1940, "drivetrain": DrivetrainType.rwd,
                "transmission": TransmissionType.automatic, "gear_count": 10,
                "seat_count": 4, "trunk_capacity": 197, "msrp": 5680000,
            },
        ],
    },
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        brand_map: dict[str, Brand] = {}

        for b in BRANDS:
            brand = Brand(**b)
            db.add(brand)
            await db.flush()
            brand_map[b["name_en"]] = brand

        for car_data in CARS:
            brand = brand_map[car_data["brand"]]
            specs_data = car_data.pop("specs")
            car_data.pop("brand")

            gen = CarGeneration(brand_id=brand.id, **car_data)
            db.add(gen)
            await db.flush()

            for s in specs_data:
                spec = CarSpec(generation_id=gen.id, **s)
                db.add(spec)

        await db.commit()
        print(f"Seeded {len(BRANDS)} brands and {len(CARS)} car models.")


if __name__ == "__main__":
    asyncio.run(seed())
