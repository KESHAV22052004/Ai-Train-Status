"""Database connection scaffolding; replace with real driver when persistence is added."""

from collections.abc import Generator
from typing import Any

from app.core.config import Settings, get_settings


def get_db_config(settings: Settings | None = None) -> dict[str, Any]:
    """
    Return a placeholder config dict for future database wiring.

    Args:
        settings: Optional settings override; defaults to cached app settings.

    Returns:
        Empty mapping for now; extend with DSN, pool size, etc. later.
    """
    _ = settings or get_settings()
    return {}


def get_db() -> Generator[None, None, None]:
    """
    FastAPI dependency yielding a database session placeholder.

    Yields:
        None until a real session factory is implemented.

    Note:
        Routes can `Depends(get_db)` today for forward compatibility.
    """
    yield None
