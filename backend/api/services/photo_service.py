from __future__ import annotations

import csv
import re
from functools import lru_cache
from pathlib import Path
from typing import Optional


CSV_PATH = Path(__file__).resolve().parents[3] / "car_photo_url_table.csv"

IMAGE_URL_RE = re.compile(
    r"^https?://.+\.(?:jpg|jpeg|png|webp|gif|avif)(?:[?#].*)?$",
    re.IGNORECASE,
)


def _normalize(value: object) -> str:
    return re.sub(r"[^a-z0-9]+", "", str(value or "").lower())


def _row_key(brand: str, year: int | str, model: str) -> tuple[str, str, str]:
    return (_normalize(brand), str(year), _normalize(model))


def _is_direct_image_url(value: str) -> bool:
    return bool(IMAGE_URL_RE.match(value.strip()))


def _find_column(fieldnames: list[str], token: str, fallback_index: int) -> str:
    normalized_token = _normalize(token)
    for fieldname in fieldnames:
        if normalized_token in _normalize(fieldname):
            return fieldname
    return fieldnames[fallback_index]


def _direct_image_columns(fieldnames: list[str]) -> list[str]:
    source_markers = (
        "official",
        "newsroom",
        "wikimedia",
        "bing",
        "google",
        "motortrend",
        "cargurus",
    )

    columns = []
    for fieldname in fieldnames:
        normalized_fieldname = _normalize(fieldname)
        looks_direct = (
            "imageurl" in normalized_fieldname
            or "photourl" in normalized_fieldname
            or "directimageurl" in normalized_fieldname
        )
        is_source_page = any(marker in normalized_fieldname for marker in source_markers)
        if looks_direct and not is_source_page:
            columns.append(fieldname)

    return columns


def _source_url_columns(fieldnames: list[str]) -> list[str]:
    markers = ("official", "newsroom", "wikimedia", "bing", "google", "motortrend", "cargurus")
    return [
        fieldname
        for fieldname in fieldnames
        if any(marker in _normalize(fieldname) for marker in markers)
    ]


@lru_cache(maxsize=1)
def _load_photo_table() -> dict[tuple[str, str, str], dict[str, str]]:
    if not CSV_PATH.exists():
        return {}

    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as file:
        rows = csv.DictReader(file)
        fieldnames = rows.fieldnames or []
        if len(fieldnames) < 3:
            return {}

        brand_column = _find_column(fieldnames, "brand", fallback_index=0)
        year_column = _find_column(fieldnames, "year", fallback_index=1)
        model_column = _find_column(fieldnames, "model", fallback_index=2)

        return {
            _row_key(row.get(brand_column, ""), row.get(year_column, ""), row.get(model_column, "")): row
            for row in rows
        }


def get_car_photo_url(
    brand: str,
    model: str,
    year: int,
    fallback_url: Optional[str] = None,
) -> Optional[str]:
    row = _load_photo_table().get(_row_key(brand, year, model))
    if not row:
        return fallback_url

    fieldnames = list(row.keys())

    for column in _direct_image_columns(fieldnames):
        value = (row.get(column) or "").strip()
        if value:
            return value

    for column in _source_url_columns(fieldnames):
        value = (row.get(column) or "").strip()
        if _is_direct_image_url(value):
            return value

    return fallback_url
