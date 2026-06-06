from elasticsearch import AsyncElasticsearch
from api.core.config import settings

_es: AsyncElasticsearch | None = None

CAR_INDEX = "cars"

CAR_MAPPING = {
    "mappings": {
        "properties": {
            "brand_en": {"type": "keyword"},
            "brand_zh": {"type": "text", "analyzer": "standard"},
            "model_en": {"type": "text", "boost": 3},
            "model_zh": {"type": "text", "boost": 3, "analyzer": "standard"},
            "year_start": {"type": "integer"},
            "year_end": {"type": "integer"},
            "body_type": {"type": "keyword"},
            "horsepower": {"type": "integer"},
            "torque": {"type": "integer"},
            "acceleration": {"type": "float"},
            "fuel_type": {"type": "keyword"},
            "drivetrain": {"type": "keyword"},
            "msrp": {"type": "integer"},
            "tags": {"type": "keyword"},
            "description": {"type": "text", "analyzer": "standard"},
        }
    }
}


async def get_es() -> AsyncElasticsearch:
    global _es
    if _es is None:
        _es = AsyncElasticsearch(settings.elasticsearch_url)
    return _es


async def ensure_index():
    es = await get_es()
    if not await es.indices.exists(index=CAR_INDEX):
        await es.indices.create(index=CAR_INDEX, body=CAR_MAPPING)
