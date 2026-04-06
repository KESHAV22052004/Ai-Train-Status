"""Application settings loaded from environment and optional `.env` file."""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration for the API."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "AI Train Status & Smart Alerts API"
    debug: bool = False
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    def cors_origin_list(self) -> List[str]:
        """Return CORS origins as a list for Starlette middleware."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance (singleton per process)."""
    return Settings()
