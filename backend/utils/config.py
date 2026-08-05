from typing import List
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application Settings managed via Environment Variables and Pydantic Settings."""

    APP_NAME: str = "Alzheimer's Disease Early Detection AI"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./alzheimers_ai.db"

    # JWT Authentication
    SECRET_KEY: str = "supersecretjwtkey_change_in_production_32bytes_min"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # File Storage
    UPLOAD_DIR: str = "./uploads"
    REPORTS_DIR: str = "./uploads/reports"
    MAX_UPLOAD_SIZE_MB: int = 25

    # ML Model Configuration
    DEFAULT_MODEL_NAME: str = "custom_cnn"
    MODEL_WEIGHTS_DIR: str = "./ml/saved_models"
    IMAGE_SIZE: int = 224
    CLASS_NAMES: List[str] = ["Non Demented", "Very Mild Demented", "Mild Demented", "Moderate Demented"]

    # Security & CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def get_upload_path(self) -> Path:
        p = Path(self.UPLOAD_DIR)
        p.mkdir(parents=True, exist_ok=True)
        return p

    def get_reports_path(self) -> Path:
        p = Path(self.REPORTS_DIR)
        p.mkdir(parents=True, exist_ok=True)
        return p


settings = Settings()
