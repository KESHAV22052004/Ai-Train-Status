"""Pydantic schemas for train status, delay prediction, and alerts APIs."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, model_validator

TrainStatusResponseLiteral = Literal["On Time", "Delayed"]


class TrainStatusResponse(BaseModel):
    """Response body for GET /api/train/{train_id}."""

    train_name: str = Field(..., description="Commercial or service name of the train")
    status: TrainStatusResponseLiteral
    delay: int = Field(..., ge=0, description="Current delay in minutes")
    speed: float = Field(..., description="Reported speed in km/h")
    next_station: str
    eta: str = Field(..., description="Estimated time of arrival at next station")


class PredictDelayResponse(BaseModel):
    """Response body for GET /api/predict-delay/{train_id}."""

    predicted_delay_min: int = Field(..., ge=0)
    predicted_delay_max: int = Field(..., ge=0)
    reason: str = Field(..., description="Primary factor driving the prediction")

    @model_validator(mode="after")
    def max_gte_min(self) -> "PredictDelayResponse":
        """Ensure the predicted band is internally consistent."""
        if self.predicted_delay_max < self.predicted_delay_min:
            return self.model_copy(update={"predicted_delay_max": self.predicted_delay_min})
        return self


class AlertItem(BaseModel):
    """Single alert entry."""

    type: str
    message: str
    time: str
