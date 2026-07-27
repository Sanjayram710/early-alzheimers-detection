import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from backend.utils.config import settings

logger = logging.getLogger(__name__)

# SQLAlchemy Base class
Base = declarative_base()

# Create Async Engine
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")

try:
    engine = create_async_engine(
        db_url,
        echo=settings.DEBUG,
        future=True
    )
except Exception as e:
    logger.warning(f"Could not create async engine with {db_url}: {e}. Falling back to in-memory sqlite.")
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)

# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)


async def init_db():
    """Creates database tables on startup if they do not exist."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized successfully.")
