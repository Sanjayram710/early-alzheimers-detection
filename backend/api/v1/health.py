from fastapi import APIRouter
from backend.utils.config import settings

router = APIRouter(prefix="/health", tags=["Health & System"])


@router.get("")
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "active_model": settings.DEFAULT_MODEL_NAME,
        "version": "1.0.0"
    }
