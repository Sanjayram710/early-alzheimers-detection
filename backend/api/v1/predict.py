from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database.session import get_db
from backend.models.domain import User
from backend.models.schemas import PredictionResponse
from backend.auth.rbac import get_current_user
from backend.services.inference_service import InferenceService
from backend.services.audit_service import audit_service
from backend.utils.config import settings

router = APIRouter(tags=["Inference & MRI Uploads"])

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".dcm", ".dicom", ".nii", ".gz"}


@router.post("/predict", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
@router.post("/upload", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
async def predict_mri(
    file: UploadFile = File(...),
    patient_id: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Accepts brain MRI image upload (DICOM, NIfTI, PNG, JPG), runs deep learning inference,
    generates Grad-CAM visual explainability heatmap, logs prediction record, and returns response.
    """
    # 1. Validate File extension
    filename = file.filename or "upload.png"
    ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS and not filename.endswith(".nii.gz"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed: DICOM, NIfTI, PNG, JPG."
        )

    # 2. Validate File Size
    contents = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    # 3. Process Prediction
    pred_record = await InferenceService.process_prediction(
        file_bytes=contents,
        filename=filename,
        patient_id=patient_id,
        current_user=current_user,
        db=db
    )

    await audit_service.log(
        db,
        action="PREDICT_MRI",
        resource=f"prediction:{pred_record.id}",
        user_id=current_user.id,
        details={"patient_id": pred_record.patient_id, "predicted_class": pred_record.predicted_class}
    )

    return pred_record
