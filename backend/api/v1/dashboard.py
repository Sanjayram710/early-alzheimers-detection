from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database.session import get_db
from backend.models.domain import User
from backend.models.schemas import DashboardStatsResponse
from backend.auth.rbac import get_current_user
from backend.services.analytics_service import analytics_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Analytics"])


@router.get("/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns aggregated system statistics, class distributions, and active model metrics."""
    stats = await analytics_service.get_dashboard_stats(db)
    return stats
