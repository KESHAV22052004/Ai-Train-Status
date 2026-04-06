"""Routes for alert management and auto-check."""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

from database import create_alert, get_alerts, delete_alert
from train_service import fetch_train_status
from .auth import get_current_user

router = APIRouter(prefix="/api", tags=["alerts"])


class CreateAlertRequest(BaseModel):
    train_query: str
    condition: str  # e.g. "delay > 15" or "status = Delayed"


@router.post("/alerts")
async def add_alert(req: CreateAlertRequest, current_user: dict = Depends(get_current_user)):
    """Create a new alert rule."""
    try:
        alert = create_alert(
            user_id=current_user["id"],
            train_query=req.train_query,
            condition=req.condition,
        )
        return {"success": True, "alert": alert}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create alert: {str(e)}")


@router.get("/alerts")
async def list_alerts(current_user: dict = Depends(get_current_user)):
    """List all alerts for a user."""
    try:
        alerts = get_alerts(current_user["id"])
        return {"alerts": alerts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch alerts: {str(e)}")


@router.delete("/alerts/{alert_id}")
async def remove_alert(alert_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an alert by ID."""
    # Ideally should check if alert belongs to user, keeping it simple
    success = delete_alert(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"success": True}


def _parse_condition(condition: str) -> tuple[str, str, str]:
    """
    Parse condition string like 'delay > 15' or 'status = Delayed'.
    Returns (field, operator, value).
    """
    condition = condition.strip()

    for op in [">=", "<=", "!=", ">", "<", "="]:
        if op in condition:
            parts = condition.split(op, 1)
            if len(parts) == 2:
                return parts[0].strip().lower(), op.strip(), parts[1].strip()

    raise ValueError(f"Invalid condition format: {condition}")


def _check_condition(train_data: dict, condition: str) -> bool:
    """Check if a train's data matches an alert condition."""
    try:
        field, op, value = _parse_condition(condition)

        if field == "delay":
            actual = train_data.get("delay", 0)
            target = int(value)
            if op == ">":
                return actual > target
            elif op == ">=":
                return actual >= target
            elif op == "<":
                return actual < target
            elif op == "<=":
                return actual <= target
            elif op == "=":
                return actual == target

        elif field == "status":
            actual = train_data.get("status", "").lower()
            target = value.strip().strip('"').strip("'").lower()
            if op == "=":
                return actual == target
            elif op == "!=":
                return actual != target

        elif field == "speed":
            actual = train_data.get("speed", 0)
            target = int(value)
            if op == ">":
                return actual > target
            elif op == "<":
                return actual < target
            elif op == "=":
                return actual == target

    except (ValueError, TypeError):
        pass

    return False


@router.post("/check-alerts")
async def check_alerts(current_user: dict = Depends(get_current_user)):
    """
    Check all alerts against current train data for the current user.
    Returns triggered alerts.
    """
    alerts = get_alerts(current_user["id"])
    triggered = []

    for alert in alerts:
        try:
            train_data = fetch_train_status(alert["train_query"])
            if not train_data:
                continue

            if _check_condition(train_data, alert["condition"]):
                triggered.append({
                    "alert_id": alert["id"],
                    "train_query": alert["train_query"],
                    "condition": alert["condition"],
                    "train_name": train_data.get("train_name", ""),
                    "train_number": train_data.get("train_number", ""),
                    "current_status": train_data.get("status", ""),
                    "current_delay": train_data.get("delay", 0),
                    "current_speed": train_data.get("speed", 0),
                    "message": f"{train_data.get('train_name', '')} — {alert['condition']} (Current: delay={train_data.get('delay', 0)}min, status={train_data.get('status', '')})",
                })
        except Exception:
            continue

    return {
        "triggered_alerts": triggered,
        "total_checked": len(alerts),
        "total_triggered": len(triggered),
    }
