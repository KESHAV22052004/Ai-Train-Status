"""Business logic and mock data for trains, predictions, and alerts."""

from __future__ import annotations

import hashlib
import logging
import random
from typing import Final

from app.models.train import AlertRecord, PredictedDelayFactors, TrainRecord
from app.schemas.train_schema import AlertItem, PredictDelayResponse, TrainStatusResponse

logger = logging.getLogger(__name__)

_MOCK_TRAINS: Final[dict[str, TrainRecord]] = {
    "EXP101": TrainRecord(
        train_id="EXP101",
        train_name="City Express 101",
        status="On Time",
        delay_minutes=0,
        speed_kmh=95.0,
        next_station="Central Junction",
        eta="10:42",
    ),
    "REG204": TrainRecord(
        train_id="REG204",
        train_name="Regional 204",
        status="Delayed",
        delay_minutes=12,
        speed_kmh=62.5,
        next_station="Northgate",
        eta="11:18",
    ),
    "FRT330": TrainRecord(
        train_id="FRT330",
        train_name="Freight Link 330",
        status="Delayed",
        delay_minutes=25,
        speed_kmh=48.0,
        next_station="Industrial Yard",
        eta="12:05",
    ),
}

_MOCK_ALERTS: Final[tuple[AlertRecord, ...]] = (
    AlertRecord(
        alert_type="weather",
        message="Light rain may add 5–10 minutes to northeast corridor trains.",
        time_iso="2026-04-07T08:15:00Z",
    ),
    AlertRecord(
        alert_type="congestion",
        message="Peak congestion near Central Junction; expect platform crowding.",
        time_iso="2026-04-07T08:22:00Z",
    ),
    AlertRecord(
        alert_type="maintenance",
        message="Single-track working between Northgate and Riverside until 14:00.",
        time_iso="2026-04-07T07:45:00Z",
    ),
)


def _rng_for_train(train_id: str) -> random.Random:
    """
    Build a deterministic RNG from a train id for stable mock predictions.

    Args:
        train_id: Identifier used as entropy source (hashed).

    Returns:
        A `random.Random` instance scoped to this train.
    """
    digest = hashlib.sha256(train_id.encode("utf-8")).digest()
    seed = int.from_bytes(digest[:8], "big", signed=False)
    return random.Random(seed)


def _score_to_factors(train_id: str, base_record: TrainRecord | None) -> PredictedDelayFactors:
    """
    Derive pseudo environmental factors from the train id and optional live row.

    Args:
        train_id: Train used for deterministic variation.
        base_record: Current mock row, if any; delays bump congestion slightly.

    Returns:
        Factor bundle consumed by the heuristic delay model.
    """
    rng = _rng_for_train(train_id)
    congestion = rng.uniform(0.15, 0.95)
    weather = rng.uniform(0.1, 0.9)
    maintenance = rng.uniform(0.05, 0.85)
    if base_record and base_record.status == "Delayed":
        congestion = min(1.0, congestion + 0.15)
    return PredictedDelayFactors(
        congestion_level=congestion,
        weather_severity=weather,
        maintenance_risk=maintenance,
    )


def _pick_primary_reason(factors: PredictedDelayFactors) -> str:
    """
    Choose the dominant delay reason from relative factor magnitudes.

    Args:
        factors: Congestion, weather, and maintenance scores.

    Returns:
        A short reason label such as "weather" or "congestion".
    """
    scores = {
        "weather": factors.weather_severity,
        "congestion": factors.congestion_level,
        "track maintenance": factors.maintenance_risk,
    }
    top = max(scores, key=scores.get)
    return top


class TrainService:
    """Facade for train lookups, delay simulation, and alerts."""

    def get_train_status(self, train_id: str) -> TrainStatusResponse | None:
        """
        Return current (mock) status for a train, or None if unknown.

        Args:
            train_id: Caller-supplied identifier (already normalized upstream).

        Returns:
            Pydantic response model or None when the train is not in mock data.
        """
        row = _MOCK_TRAINS.get(train_id)
        if not row:
            logger.info("Train not found in mock store: %s", train_id)
            return None
        return TrainStatusResponse(
            train_name=row.train_name,
            status=row.status,
            delay=row.delay_minutes,
            speed=row.speed_kmh,
            next_station=row.next_station,
            eta=row.eta,
        )

    def predict_delay(self, train_id: str) -> PredictDelayResponse | None:
        """
        Simulate AI-style delay bounds using factors plus light randomness.

        Args:
            train_id: Train to predict for.

        Returns:
            Prediction model, or None when the train is not in mock data.
        """
        base = _MOCK_TRAINS.get(train_id)
        if not base:
            logger.info("Predict delay: train not found: %s", train_id)
            return None
        factors = _score_to_factors(train_id, base)
        reason = _pick_primary_reason(factors)

        rng = _rng_for_train(train_id + "|predict")
        base_delay = base.delay_minutes
        spread = int(4 + rng.random() * 12 + factors.weather_severity * 8)
        pred_min = max(0, base_delay + int(factors.maintenance_risk * 5))
        pred_max = pred_min + spread
        if pred_max < pred_min:
            pred_max = pred_min

        return PredictDelayResponse(
            predicted_delay_min=pred_min,
            predicted_delay_max=pred_max,
            reason=reason,
        )

    def list_alerts(self) -> list[AlertItem]:
        """
        Return mock operational alerts for dashboard consumers.

        Returns:
            List of alert DTOs (types and messages vary by mock data).
        """
        return [
            AlertItem(type=a.alert_type, message=a.message, time=a.time_iso)
            for a in _MOCK_ALERTS
        ]
