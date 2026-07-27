"""
Script to seed database with initial admin, user accounts, and model versions.
Usage:
    python scripts/seed_db.py
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import asyncio
import logging
from sqlalchemy import select
from backend.database.connection import init_db, AsyncSessionLocal
from backend.models.domain import User, ModelVersion
from backend.auth.security import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed():
    await init_db()
    async with AsyncSessionLocal() as db:
        # 1. Seed Admin User
        admin_res = await db.execute(select(User).where(User.email == "admin@alzheimers.ai"))
        if not admin_res.scalars().first():
            admin = User(
                email="admin@alzheimers.ai",
                password_hash=hash_password("admin123"),
                full_name="System Administrator",
                role="admin"
            )
            db.add(admin)
            logger.info("Seeded Admin User: admin@alzheimers.ai / admin123")

        # 2. Seed Standard User
        user_res = await db.execute(select(User).where(User.email == "doctor@alzheimers.ai"))
        if not user_res.scalars().first():
            doctor = User(
                email="doctor@alzheimers.ai",
                password_hash=hash_password("doctor123"),
                full_name="Dr. Eleanor Vance",
                role="user"
            )
            db.add(doctor)
            logger.info("Seeded Standard User: doctor@alzheimers.ai / doctor123")

        # 3. Seed Personal User Accounts
        sanjay_res = await db.execute(select(User).where(User.email == "sanjayharshi2005@gmail.com"))
        if not sanjay_res.scalars().first():
            sanjay = User(
                email="sanjayharshi2005@gmail.com",
                password_hash=hash_password("sanjay123"),
                full_name="Sanjay",
                role="user"
            )
            db.add(sanjay)
            logger.info("Seeded User: sanjayharshi2005@gmail.com / sanjay123")

        sanjay2_res = await db.execute(select(User).where(User.email == "sanjaysrinivasan.ram@gmail.com"))
        if not sanjay2_res.scalars().first():
            sanjay2 = User(
                email="sanjaysrinivasan.ram@gmail.com",
                password_hash=hash_password("sanjay123"),
                full_name="Sanjay Srinivasan Ram",
                role="user"
            )
            db.add(sanjay2)
            logger.info("Seeded User: sanjaysrinivasan.ram@gmail.com / sanjay123")

        # 3. Seed Model Versions
        models = [
            ("custom_cnn", "Custom Baseline CNN", 0.945, 0.941, True),
            ("transfer_resnet50", "ResNet50 Transfer Backbone", 0.932, 0.928, False),
            ("transfer_efficientnetb0", "EfficientNetB0 Backbone", 0.925, 0.921, False),
            ("vit", "Vision Transformer Encoder", 0.915, 0.910, False)
        ]

        for name, arch, acc, f1, is_act in models:
            mod_res = await db.execute(select(ModelVersion).where(ModelVersion.version_name == name))
            if not mod_res.scalars().first():
                mv = ModelVersion(
                    version_name=name,
                    architecture=arch,
                    val_accuracy=acc,
                    val_f1=f1,
                    is_active=is_act
                )
                db.add(mv)

        await db.commit()
        logger.info("Database seeding complete.")


if __name__ == "__main__":
    asyncio.run(seed())
