from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from api.core.config import settings
from api.core.database import init_db
from api.core.elasticsearch import ensure_index
from api.routers import cars, search, compare, tools, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    try:
        await ensure_index()
    except Exception:
        pass  # ES may not be available in dev
    yield


app = FastAPI(
    title="AutoDB API",
    description="台灣最完整的汽車資料庫 API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(cars.router, prefix="/api/v1/cars", tags=["cars"])
app.include_router(search.router, prefix="/api/v1/search", tags=["search"])
app.include_router(compare.router, prefix="/api/v1/compare", tags=["compare"])
app.include_router(tools.router, prefix="/api/v1/tools", tags=["tools"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
