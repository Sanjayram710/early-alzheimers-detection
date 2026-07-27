from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, EmailStr, Field


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    role: Optional[str] = "user"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None


# Prediction Schemas
class PredictionResponse(BaseModel):
    id: str
    patient_id: Optional[str]
    predicted_class: str
    confidence: float
    class_probabilities: Dict[str, float]
    model_version: str
    inference_time_ms: float
    heatmap_base64: Optional[str] = None
    overlay_base64: Optional[str] = None
    original_base64: Optional[str] = None
    original_image_url: Optional[str] = None
    heatmap_url: Optional[str] = None
    overlay_url: Optional[str] = None
    medical_disclaimer: str
    created_at: datetime

    class Config:
        from_attributes = True


class PredictionHistoryItem(BaseModel):
    id: str
    patient_id: Optional[str]
    predicted_class: str
    confidence: float
    model_version: str
    created_at: datetime

    class Config:
        from_attributes = True


# Report Schema
class ReportResponse(BaseModel):
    id: str
    prediction_id: str
    pdf_url: str
    generated_at: datetime

    class Config:
        from_attributes = True


# Model Version Schema
class ModelVersionResponse(BaseModel):
    id: str
    version_name: str
    architecture: str
    val_accuracy: Optional[float]
    val_f1: Optional[float]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Feedback Schema
class FeedbackCreate(BaseModel):
    prediction_id: str
    rating: int = Field(..., ge=1, le=5)
    feedback_text: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: str
    prediction_id: str
    rating: int
    feedback_text: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Dashboard Statistics Schema
class DashboardStatsResponse(BaseModel):
    total_mris_analyzed: int
    class_distribution: Dict[str, int]
    active_model_version: str
    average_confidence: float
    recent_predictions: List[PredictionHistoryItem]
    accuracy_metrics: Dict[str, float]
