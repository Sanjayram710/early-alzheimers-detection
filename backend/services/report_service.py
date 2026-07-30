import os
import base64
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.domain import Prediction, Report, User
from backend.reports.pdf_generator import PDFReportGenerator
from backend.utils.config import settings
from backend.utils.exceptions import NotFoundException

logger = logging.getLogger(__name__)


class ReportService:
    def __init__(self):
        self.pdf_generator = PDFReportGenerator(settings.get_reports_path())

    async def generate_pdf_report(
        self,
        prediction_id: str,
        current_user: User,
        db: AsyncSession
    ) -> Report:
        # Fetch Prediction
        result = await db.execute(select(Prediction).where(Prediction.id == prediction_id))
        pred = result.scalars().first()

        if not pred:
            raise NotFoundException("Prediction record")

        # Check existing report
        report_res = await db.execute(select(Report).where(Report.prediction_id == prediction_id))
        existing_report = report_res.scalars().first()
        if existing_report:
            return existing_report

        # Encode overlay image if present
        overlay_b64 = None
        if pred.overlay_path and os.path.exists(pred.overlay_path):
            with open(pred.overlay_path, "rb") as f:
                b64_data = base64.b64encode(f.read()).decode("utf-8")
                overlay_b64 = f"data:image/png;base64,{b64_data}"

        pdf_path = self.pdf_generator.generate_report(
            report_id=pred.id,
            patient_id=pred.patient_id or "N/A",
            patient_name=pred.patient_name,
            patient_age=pred.patient_age,
            blood_group=pred.blood_group,
            symptoms=pred.symptoms,
            predicted_class=pred.predicted_class,
            confidence=pred.confidence,
            class_probabilities=pred.class_probabilities,
            model_version=pred.model_version,
            inference_time_ms=pred.inference_time_ms,
            original_image_path=pred.original_image_path,
            processed_image_path=pred.processed_image_path,
            overlay_base64=overlay_b64,
            preprocessing_metadata=pred.preprocessing_metadata
        )

        new_report = Report(
            prediction_id=pred.id,
            user_id=current_user.id,
            pdf_path=str(pdf_path)
        )

        db.add(new_report)
        await db.commit()
        await db.refresh(new_report)
        return new_report


report_service = ReportService()
