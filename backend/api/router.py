from fastapi import APIRouter
from backend.api.v1 import (
    auth, predict, history, reports, models, feedback, health, admin, dashboard
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(predict.router)
api_router.include_router(history.router)
api_router.include_router(reports.router)
api_router.include_router(models.router)
api_router.include_router(feedback.router)
api_router.include_router(health.router)
api_router.include_router(admin.router)
api_router.include_router(dashboard.router)
