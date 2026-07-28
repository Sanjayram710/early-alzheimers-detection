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


from sqlalchemy import text


async def init_db():
    """Creates database tables on startup if they do not exist and updates schema if needed."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
        def migrate_schema(sync_conn):
            try:
                from sqlalchemy import inspect
                inspector = inspect(sync_conn)
                if "predictions" in inspector.get_table_names():
                    existing_cols = {col["name"] for col in inspector.get_columns("predictions")}
                    col_defs = [
                        ("patient_name", "VARCHAR(255)"),
                        ("patient_age", "INTEGER"),
                        ("blood_group", "VARCHAR(10)"),
                        ("symptoms", "JSON"),
                    ]
                    for col_name, col_type in col_defs:
                        if col_name not in existing_cols:
                            sync_conn.execute(text(f"ALTER TABLE predictions ADD COLUMN {col_name} {col_type}"))
                            logger.info(f"Added missing column '{col_name}' to predictions table.")
            except Exception as e:
                logger.warning(f"Schema migration check skipped or failed: {e}")

        await conn.run_sync(migrate_schema)
    logger.info("Database tables initialized successfully.")

