import logging
from pathlib import Path
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from ml.inference.predictor import MRIPredictor
from backend.models.domain import Prediction, User
from backend.services.storage_service import storage_service
from backend.utils.config import settings

logger = logging.getLogger(__name__)

# Global singleton predictor instance
_predictor_instance: Optional[MRIPredictor] = None


def get_predictor() -> MRIPredictor:
    global _predictor_instance
    weights_dir = Path(settings.MODEL_WEIGHTS_DIR)
    model_name = settings.DEFAULT_MODEL_NAME.lower()
    weights_file = weights_dir / f"{model_name}_best.keras"
    if not weights_file.exists():
        weights_file = weights_dir / "neurodxnet_best.keras"
    if not weights_file.exists():
        weights_file = weights_dir / f"{settings.DEFAULT_MODEL_NAME}_best.keras"

    if _predictor_instance is None:
        selected_weights = weights_file if weights_file.exists() else None
        logger.info(f"Initializing singleton MRIPredictor using model '{model_name}' and weights '{selected_weights}'")
        _predictor_instance = MRIPredictor(
            model_name=model_name,
            weights_path=selected_weights,
            class_names=settings.CLASS_NAMES
        )
    return _predictor_instance


class InferenceService:
    """Orchestrates MRI prediction execution, file persistence, and DB logging."""

    @staticmethod
    async def process_prediction(
        file_bytes: bytes,
        filename: str,
        patient_id: Optional[str],
        patient_name: Optional[str] = None,
        patient_age: Optional[int] = None,
        blood_group: Optional[str] = None,
        symptoms: Optional[list] = None,
        current_user: User = None,
        db: AsyncSession = None
    ) -> Prediction:
        # 1. Save uploaded original MRI scan
        file_id, orig_path = storage_service.save_upload_bytes(file_bytes, filename)

        # 2. Run ML Prediction & Grad-CAM
        predictor = get_predictor()
        res = predictor.predict(file_bytes, generate_gradcam=True)

        # 3. Save Processed, Heatmap and Overlay images if present
        processed_path_str, heatmap_path_str, overlay_path_str = None, None, None
        if res.get("processed_base64"):
            _, proc_path = storage_service.save_base64_image(res["processed_base64"], prefix="processed")
            processed_path_str = str(proc_path)

        if res.get("heatmap_base64"):
            _, hm_path = storage_service.save_base64_image(res["heatmap_base64"], prefix="heatmap")
            heatmap_path_str = str(hm_path)

        if res.get("overlay_base64"):
            _, ov_path = storage_service.save_base64_image(res["overlay_base64"], prefix="overlay")
            overlay_path_str = str(ov_path)

        # 4. Create Prediction ORM Record
        prediction_record = Prediction(
            patient_id=patient_id or f"PT-{file_id[:8].upper()}",
            patient_name=patient_name,
            patient_age=patient_age,
            blood_group=blood_group,
            symptoms=symptoms,
            user_id=current_user.id if current_user else None,
            original_image_path=str(orig_path),
            processed_image_path=processed_path_str,
            heatmap_path=heatmap_path_str,
            overlay_path=overlay_path_str,
            preprocessing_metadata=res.get("preprocessing_metadata"),
            predicted_class=res["predicted_class"],
            confidence=res["confidence"],
            class_probabilities=res["class_probabilities"],
            model_version=res["model_version"],
            inference_time_ms=res["inference_time_ms"]
        )

        db.add(prediction_record)
        await db.commit()
        await db.refresh(prediction_record)

        # Attach transient base64 fields & URLs for immediate API response
        prediction_record.original_base64 = res.get("original_base64")
        prediction_record.processed_base64 = res.get("processed_base64")
        prediction_record.heatmap_base64 = res.get("heatmap_base64")
        prediction_record.overlay_base64 = res.get("overlay_base64")
        prediction_record.original_image_url = f"/uploads/{Path(orig_path).name}"
        if processed_path_str:
            prediction_record.processed_image_url = f"/uploads/{Path(processed_path_str).name}"
        prediction_record.preprocessing_metadata = res.get("preprocessing_metadata")
        prediction_record.medical_disclaimer = res["medical_disclaimer"]

        return prediction_record
