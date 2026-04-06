"""Routes for train search and status."""

from fastapi import APIRouter, Query, HTTPException

from train_service import search_trains, fetch_train_status, predict_delay

router = APIRouter(prefix="/api", tags=["trains"])


@router.get("/trains/search")
async def search(q: str = Query(..., min_length=1, description="Search query")):
    """
    Search trains by name or number.
    Returns up to 8 matching trains.
    """
    try:
        results = search_trains(q)
        return {"results": results, "query": q}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.get("/train")
async def get_train_status(query: str = Query(..., min_length=1, description="Train name or number")):
    """
    Get the live status of a specific train.
    Returns normalized train data.
    """
    try:
        result = fetch_train_status(query)
        if not result:
            raise HTTPException(status_code=404, detail=f"Train not found: {query}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch train status: {str(e)}")


@router.get("/predict-delay")
async def get_delay_prediction(query: str = Query(..., min_length=1, description="Train name or number")):
    """
    Get AI-simulated delay prediction for a train.
    """
    try:
        result = predict_delay(query)
        if not result:
            raise HTTPException(status_code=404, detail=f"Train not found: {query}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
