import logging
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.domain import AuditLog

logger = logging.getLogger(__name__)


class AuditService:
    @staticmethod
    async def log(
        db: AsyncSession,
        action: str,
        resource: str,
        user_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        try:
            log_entry = AuditLog(
                user_id=user_id,
                action=action,
                resource=resource,
                details=details
            )
            db.add(log_entry)
            await db.commit()
        except Exception as e:
            logger.error(f"Failed to create audit log entry: {e}")


audit_service = AuditService()
