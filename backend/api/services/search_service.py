from elasticsearch import AsyncElasticsearch
from api.core.elasticsearch import get_es, CAR_INDEX
from api.models.car import CarGeneration
from typing import Optional


async def index_car(car: CarGeneration):
    es = await get_es()
    specs = car.specs
    min_hp = min((s.horsepower for s in specs if s.horsepower), default=None)
    max_hp = max((s.horsepower for s in specs if s.horsepower), default=None)
    min_price = min((s.msrp for s in specs if s.msrp), default=None)

    doc = {
        "brand_en": car.brand.name_en,
        "brand_zh": car.brand.name_zh,
        "model_en": car.model_en,
        "model_zh": car.model_zh,
        "year_start": car.year_start,
        "year_end": car.year_end,
        "body_type": car.body_type.value if car.body_type else None,
        "horsepower_min": min_hp,
        "horsepower_max": max_hp,
        "msrp_min": min_price,
        "description": car.description or "",
        "tags": [car.brand.name_en, car.model_en, car.body_type.value if car.body_type else ""],
    }
    await es.index(index=CAR_INDEX, id=str(car.id), document=doc)


async def search_cars(
    query: str,
    body_type: Optional[str] = None,
    min_hp: Optional[int] = None,
    max_price: Optional[int] = None,
    fuel_type: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
) -> dict:
    es = await get_es()

    must = []
    filter_clauses = []

    if query:
        must.append({
            "multi_match": {
                "query": query,
                "fields": ["model_en^3", "model_zh^3", "brand_en^2", "brand_zh^2", "description", "tags"],
                "fuzziness": "AUTO",
            }
        })
    else:
        must.append({"match_all": {}})

    if body_type:
        filter_clauses.append({"term": {"body_type": body_type}})
    if min_hp:
        filter_clauses.append({"range": {"horsepower_min": {"gte": min_hp}}})
    if max_price:
        filter_clauses.append({"range": {"msrp_min": {"lte": max_price}}})

    es_query = {
        "query": {"bool": {"must": must, "filter": filter_clauses}},
        "from": (page - 1) * page_size,
        "size": page_size,
    }

    try:
        response = await es.search(index=CAR_INDEX, body=es_query)
        hits = response["hits"]
        return {
            "total": hits["total"]["value"],
            "ids": [int(h["_id"]) for h in hits["hits"]],
        }
    except Exception:
        return {"total": 0, "ids": []}
