"""Small reusable helpers (validation, formatting)."""

import re
from typing import Final

_TRAIN_ID_PATTERN: Final[re.Pattern[str]] = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]{1,63}$")


def is_valid_train_id(train_id: str) -> bool:
    """
    Return True if `train_id` is a non-empty, safe identifier for routing.

    Args:
        train_id: Raw path segment from the client.

    Returns:
        Whether the ID matches allowed pattern and length bounds.
    """
    if not train_id or not train_id.strip():
        return False
    return bool(_TRAIN_ID_PATTERN.fullmatch(train_id.strip()))
