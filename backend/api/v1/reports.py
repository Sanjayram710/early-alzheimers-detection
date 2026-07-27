from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database.session import get_db
from backend.models.domain import Report, User
from backend.models.schemas import ReportResponse
from backend.auth.rbac import get_current_user
from backend.services.report_service import report_service

router = APIRouter(prefix="/reports", tags=["PDF Reports"])


@router.post("/generate/{prediction_id}", response_model=ReportResponse)
async def generate_report(
    prediction_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generates PDF clinical report for a prediction ID."""
    report = await report_service.generate_pdf_report(prediction_id, current_user, db)
    return {
        "id": report.id,
        "prediction_id": report.prediction_id,
        "pdf_url": f"/api/v1/reports/{report.id}/download",
        "generated_at": report.generated_at
    }


@router.get("", response_model=List[ReportResponse])
async def list_reports(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lists available PDF reports for current user."""
    query = select(Report).order_by(Report.generated_at.desc())
    if current_user.role.lower() != "admin":
        query = query.where(Report.user_id == current_user.id)

    res = await db.execute(query)
    reports = res.scalars().all()

    return [
        {
            "id": r.id,
            "prediction_id": r.prediction_id,
            "pdf_url": f"/api/v1/reports/{r.id}/download",
            "generated_at": r.generated_at
        }
        for r in reports
    ]


@router.get("/{report_id}/download")
async def download_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Downloads PDF report binary file."""
    res = await db.execute(select(Report).where(Report.id == report_id))
    report = res.scalars().first()

    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    if current_user.role.lower() != "admin" and report.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return FileResponse(
        path=report.pdf_path,
        media_type="application/pdf",
        filename=f"Alzheimers_Report_{report.prediction_id[:8]}.pdf"
    )
