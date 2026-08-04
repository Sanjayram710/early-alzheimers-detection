from typing import Optional
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database.session import get_db
from backend.models.domain import User
from backend.auth.security import decode_access_token
from backend.utils.exceptions import CredentialsException, PermissionDeniedException


def get_token_from_header(request: Request) -> Optional[str]:
    """Extracts Bearer token from Authorization header without registering OpenAPI security schemes."""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    return None


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> User:
    """FastAPI Dependency resolving current authenticated User ORM model from JWT token or fallback default user."""
    token = get_token_from_header(request)
    if token:
        try:
            token_data = decode_access_token(token)
            if token_data.user_id is not None:
                result = await db.execute(select(User).where(User.id == token_data.user_id))
                user = result.scalars().first()
                if user and user.is_active:
                    return user
        except Exception:
            pass

    # Fallback to default admin/active user for unauthenticated mode
    result = await db.execute(select(User).where(User.is_active == True))
    user = result.scalars().first()

    if user is None:
        # Create an in-memory fallback user object if DB has no users yet
        user = User(
            id=1,
            email="admin@alzheimers.ai",
            full_name="System Administrator",
            role="admin",
            is_active=True
        )

    return user


async def require_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """FastAPI Dependency enforcing Admin role access control."""
    if current_user.role.lower() != "admin":
        raise PermissionDeniedException("Admin privileges required for this action")
    return current_user

