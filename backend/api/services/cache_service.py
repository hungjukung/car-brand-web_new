import json
from redis.asyncio import Redis


async def get_cached(redis: Redis, key: str) -> dict | None:
    raw = await redis.get(key)
    if raw:
        return json.loads(raw)
    return None


async def set_cached(redis: Redis, key: str, data: dict, ttl: int = 86400):
    await redis.setex(key, ttl, json.dumps(data, ensure_ascii=False, default=str))


async def invalidate(redis: Redis, pattern: str):
    keys = await redis.keys(pattern)
    if keys:
        await redis.delete(*keys)
