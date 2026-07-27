import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import asyncio
from sqlalchemy import select
from backend.database.connection import init_db, AsyncSessionLocal
from backend.models.domain import User
from backend.auth.security import hash_password

async def reset():
    await init_db()
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).where(User.email == "sanjaysrinivasan.ram@gmail.com"))
        user = res.scalars().first()
        if user:
            user.password_hash = hash_password("sanjay123")
            print("Updated password for sanjaysrinivasan.ram@gmail.com to sanjay123")
        else:
            user = User(
                email="sanjaysrinivasan.ram@gmail.com",
                password_hash=hash_password("sanjay123"),
                full_name="Sanjay Srinivasan Ram",
                role="user"
            )
            db.add(user)
            print("Created account for sanjaysrinivasan.ram@gmail.com with password sanjay123")
        await db.commit()

if __name__ == "__main__":
    asyncio.run(reset())
