from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database.session import get_db
from backend.models.domain import User
from backend.models.schemas import UserRegister, UserResponse, Token
from backend.auth.security import hash_password, verify_password, create_access_token
from backend.auth.rbac import get_current_user
from backend.services.audit_service import audit_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    """Registers new user or admin account."""
    existing_res = await db.execute(select(User).where(User.email == user_in.email))
    if existing_res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    role_clean = "admin" if user_in.role and user_in.role.lower() == "admin" else "user"

    new_user = User(
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        full_name=user_in.full_name,
        role=role_clean
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    await audit_service.log(db, action="USER_REGISTER", resource=f"user:{new_user.id}", user_id=new_user.id)
    return new_user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """Authenticates user email/password and returns JWT access token."""
    res = await db.execute(select(User).where(User.email == form_data.username))
    user = res.scalars().first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    await audit_service.log(db, action="USER_LOGIN", resource=f"user:{user.id}", user_id=user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Returns currently authenticated user profile."""
    return current_user
