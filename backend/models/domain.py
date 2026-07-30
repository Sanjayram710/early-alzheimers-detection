from datetime import datetime
import uuid
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, JSON, Boolean, Text
from sqlalchemy.orm import relationship
from backend.database.connection import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="user", nullable=False)  # "user" or "admin"
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(String(100), index=True, nullable=True)
    patient_name = Column(String(255), nullable=True)
    patient_age = Column(Integer, nullable=True)
    blood_group = Column(String(10), nullable=True)
    symptoms = Column(JSON, nullable=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    original_image_path = Column(String(500), nullable=False)
    processed_image_path = Column(String(500), nullable=True)
    heatmap_path = Column(String(500), nullable=True)
    overlay_path = Column(String(500), nullable=True)
    preprocessing_metadata = Column(JSON, nullable=True)

    predicted_class = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    class_probabilities = Column(JSON, nullable=False)
    
    model_version = Column(String(100), default="custom_cnn", nullable=False)
    inference_time_ms = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="predictions")
    report = relationship("Report", back_populates="prediction", uselist=False, cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="prediction", uselist=False, cascade="all, delete-orphan")


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    prediction_id = Column(String(36), ForeignKey("predictions.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    pdf_path = Column(String(500), nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    prediction = relationship("Prediction", back_populates="report")
    user = relationship("User", back_populates="reports")


class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    version_name = Column(String(100), unique=True, nullable=False)
    architecture = Column(String(100), nullable=False)
    val_accuracy = Column(Float, nullable=True)
    val_f1 = Column(Float, nullable=True)
    weights_path = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    prediction_id = Column(String(36), ForeignKey("predictions.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5 stars
    feedback_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    prediction = relationship("Prediction", back_populates="feedback")
    user = relationship("User", back_populates="feedback")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(255), nullable=False)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="audit_logs")
