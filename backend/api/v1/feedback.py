from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database.session import get_db
from backend.models.domain import Feedback, User
from backend.models.schemas import FeedbackCreate, FeedbackResponse
from backend.auth.rbac import get_current_user, require_admin

router = APIRouter(prefix="/feedback", tags=["User Feedback"])


@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    fb_in: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submits user feedback and rating for a specific prediction."""
    feedback = Feedback(
        prediction_id=fb_in.prediction_id,
        user_id=current_user.id,
        rating=fb_in.rating,
        feedback_text=fb_in.feedback_text
    )

    db.add(feedback)
    await db.commit()
    await db.refresh(feedback)
    return feedback


@router.get("", response_model=List[FeedbackResponse])
async def get_all_feedback(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Lists all user feedback (Admin only)."""
    res = await db.execute(select(Feedback).order_by(Feedback.created_at.desc()))
    return res.scalars().all()
