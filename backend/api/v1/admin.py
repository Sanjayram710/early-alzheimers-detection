from typing import List, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database.session import get_db
from backend.models.domain import User, AuditLog
from backend.models.schemas import UserResponse
from backend.auth.rbac import require_admin

router = APIRouter(prefix="/admin", tags=["Admin Panel"])


@router.get("/users", response_model=List[UserResponse])
async def list_users(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Lists all registered system users (Admin only)."""
    res = await db.execute(select(User).order_by(User.created_at.desc()))
    return res.scalars().all()


@router.get("/audit-logs")
async def get_audit_logs(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves system security and action audit logs (Admin only)."""
    res = await db.execute(select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100))
    logs = res.scalars().all()
    return logs
