import pytest
from pathlib import Path
from backend.reports.pdf_generator import PDFReportGenerator


def test_pdf_report_generation(tmp_path):
    generator = PDFReportGenerator(output_dir=tmp_path)

    pdf_path = generator.generate_report(
        report_id="test-pred-123",
        patient_id="PT-9999",
        predicted_class="Very Mild Demented",
        confidence=0.885,
        class_probabilities={
            "Non Demented": 0.05,
            "Very Mild Demented": 0.885,
            "Mild Demented": 0.05,
            "Moderate Demented": 0.015
        },
        model_version="custom_cnn",
        inference_time_ms=120.5
    )

    assert pdf_path.exists()
    assert pdf_path.stat().st_size > 0
    assert pdf_path.suffix == ".pdf"


def test_pdf_report_generation_with_patient_info(tmp_path):
    generator = PDFReportGenerator(output_dir=tmp_path)

    pdf_path = generator.generate_report(
        report_id="test-pred-456",
        patient_id="PT-8888",
        patient_name="Jane Doe",
        patient_age=72,
        blood_group="O+",
        symptoms=["Memory loss disrupting daily life", "Confusion with time"],
        predicted_class="Mild Demented",
        confidence=0.92,
        class_probabilities={
            "Non Demented": 0.02,
            "Very Mild Demented": 0.05,
            "Mild Demented": 0.92,
            "Moderate Demented": 0.01
        },
        model_version="custom_cnn",
        inference_time_ms=105.0
    )

    assert pdf_path.exists()
    assert pdf_path.stat().st_size > 0
    assert pdf_path.suffix == ".pdf"
