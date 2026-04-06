"""Domain models representing train-related entities (not Pydantic)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

TrainStatusLiteral = Literal["On Time", "Delayed"]


@dataclass(frozen=True, slots=True)
class TrainRecord:
    """Internal representation of a train row used by services."""

    train_id: str
    train_name: str
    status: TrainStatusLiteral
    delay_minutes: int
    speed_kmh: float
    next_station: str
    eta: str


@dataclass(frozen=True, slots=True)
class PredictedDelayFactors:
    """Inputs used by the simple heuristic delay model."""

    congestion_level: float
    weather_severity: float
    maintenance_risk: float


@dataclass(frozen=True, slots=True)
class AlertRecord:
    """A single operational or passenger-facing alert."""

    alert_type: str
    message: str
    time_iso: str
