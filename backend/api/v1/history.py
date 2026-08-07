from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database.session import get_db
from backend.models.domain import Prediction, User
from backend.models.schemas import PredictionResponse, PredictionHistoryItem
from backend.auth.rbac import get_current_user

router = APIRouter(prefix="/history", tags=["Upload History"])


@router.get("", response_model=List[PredictionHistoryItem])
async def get_prediction_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves list of past MRI upload predictions for current authenticated user (or all if admin)."""
    query = select(Prediction).order_by(Prediction.created_at.desc())
    if current_user.role.lower() != "admin":
        query = query.where(Prediction.user_id == current_user.id)

    res = await db.execute(query)
    records = res.scalars().all()
    return records


@router.get("/{prediction_id}", response_model=PredictionResponse)
async def get_prediction_detail(
    prediction_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves full details for a single prediction ID."""
    res = await db.execute(select(Prediction).where(Prediction.id == prediction_id))
    pred = res.scalars().first()

    if not pred:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction record not found")

    if current_user.role.lower() != "admin" and pred.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    pred.populate_urls()
    pred.medical_disclaimer = (
        "DISCLAIMER: Research and clinical decision-support only. Not a medical diagnostic device."
    )
    return pred
