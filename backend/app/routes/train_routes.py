"""HTTP routes for train status, delay prediction, and alerts."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status

from app.schemas.train_schema import AlertItem, PredictDelayResponse, TrainStatusResponse
from app.services.train_service import TrainService
from app.utils.helpers import is_valid_train_id

router = APIRouter(prefix="/api", tags=["trains"])


def get_train_service() -> TrainService:
    """Provide a `TrainService` instance per request (stateless; cheap to construct)."""
    return TrainService()


def require_train_id(
    train_id: Annotated[str, Path(description="Unique train identifier")],
) -> str:
    """
    Normalize and validate `train_id` from the path.

    Args:
        train_id: Raw path segment supplied by the client.

    Returns:
        Stripped, validated identifier.

    Raises:
        HTTPException: 400 when the identifier format is not allowed.
    """
    tid = train_id.strip()
    if not is_valid_train_id(tid):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "invalid_train_id", "message": "Train ID format is not valid"},
        )
    return tid


@router.get(
    "/train/{train_id}",
    response_model=TrainStatusResponse,
    summary="Get train status",
)
def get_train_status(
    train_id: Annotated[str, Depends(require_train_id)],
    service: Annotated[TrainService, Depends(get_train_service)],
) -> TrainStatusResponse:
    """
    Return live (mock) status for the given train.

    Raises:
        HTTPException: 404 when the train is unknown.
    """
    result = service.get_train_status(train_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "train_not_found", "message": f"No train registered for id '{train_id}'"},
        )
    return result


@router.get(
    "/predict-delay/{train_id}",
    response_model=PredictDelayResponse,
    summary="Predict delay (simulated)",
)
def get_predicted_delay(
    train_id: Annotated[str, Depends(require_train_id)],
    service: Annotated[TrainService, Depends(get_train_service)],
) -> PredictDelayResponse:
    """
    Return a simulated delay band and primary contributing reason.

    Raises:
        HTTPException: 404 when the train is unknown.
    """
    result = service.predict_delay(train_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "train_not_found", "message": f"No train registered for id '{train_id}'"},
        )
    return result


@router.get(
    "/alerts",
    response_model=list[AlertItem],
    summary="List smart alerts",
)
def list_alerts(service: Annotated[TrainService, Depends(get_train_service)]) -> list[AlertItem]:
    """Return operational alerts for dashboard and notification surfaces."""
    return service.list_alerts()
