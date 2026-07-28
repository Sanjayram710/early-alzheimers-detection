import os
import base64
import io
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from PIL import Image


class PDFReportGenerator:
    """
    Generates downloadable publication-ready PDF clinical decision support reports
    using ReportLab. Includes patient metadata, model prediction summary, side-by-side
    MRI scan and Grad-CAM heatmap visualization, and prominent medical disclaimers.
    """

    def __init__(self, output_dir: Path):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def generate_report(
        self,
        report_id: str,
        patient_id: str,
        predicted_class: str,
        confidence: float,
        class_probabilities: Dict[str, float],
        model_version: str,
        inference_time_ms: float,
        patient_name: Optional[str] = None,
        patient_age: Optional[int] = None,
        blood_group: Optional[str] = None,
        symptoms: Optional[list] = None,
        original_image_path: Optional[str] = None,
        overlay_base64: Optional[str] = None,
        disclaimer_text: Optional[str] = None
    ) -> Path:
        """Renders PDF document and returns saved file path."""
        pdf_filename = f"Alzheimers_Report_{report_id[:8]}.pdf"
        pdf_path = self.output_dir / pdf_filename

        doc = SimpleDocTemplate(
            str(pdf_path),
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()

        # Custom Styles
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            textColor=colors.HexColor("#1e293b"),
            alignment=0
        )

        subtitle_style = ParagraphStyle(
            "DocSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=colors.HexColor("#64748b")
        )

        section_heading = ParagraphStyle(
            "SectionHeading",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=10,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#334155")
        )

        disclaimer_style = ParagraphStyle(
            "Disclaimer",
            parent=styles["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8.5,
            leading=12,
            textColor=colors.HexColor("#991b1b")
        )

        story = []

        # Header Section
        story.append(Paragraph("Alzheimer's Disease Detection System", title_style))
        story.append(Paragraph("AI-Assisted MRI Analysis & Clinical Decision Support Report", subtitle_style))
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2563eb"), spaceAfter=15))

        # Metadata Table (Patient Information & Study Metadata)
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        symptoms_str = ", ".join(symptoms) if symptoms else "None Reported"
        meta_data = [
            [Paragraph("<b>Report ID:</b>", body_style), Paragraph(report_id, body_style),
             Paragraph("<b>Date:</b>", body_style), Paragraph(now_str, body_style)],
            [Paragraph("<b>Patient Name:</b>", body_style), Paragraph(patient_name or "N/A", body_style),
             Paragraph("<b>Patient ID:</b>", body_style), Paragraph(patient_id or "N/A", body_style)],
            [Paragraph("<b>Age:</b>", body_style), Paragraph(str(patient_age) if patient_age else "N/A", body_style),
             Paragraph("<b>Blood Group:</b>", body_style), Paragraph(blood_group or "N/A", body_style)],
            [Paragraph("<b>Reported Symptoms:</b>", body_style), Paragraph(symptoms_str, body_style),
             Paragraph("<b>Model Version:</b>", body_style), Paragraph(model_version, body_style)]
        ]

        t_meta = Table(meta_data, colWidths=[1.4*inch, 2.2*inch, 1.3*inch, 2.3*inch])
        t_meta.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
            ('PADDING', (0,0), (-1,-1), 6),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(t_meta)
        story.append(Spacer(1, 15))

        # Prediction Highlight Box
        conf_pct = f"{confidence * 100.0:.2f}%"
        stage_color = "#dc2626" if "Demented" in predicted_class and "Non" not in predicted_class else "#16a34a"

        pred_box_data = [
            [
                Paragraph("<b>Predicted Disease Stage:</b>", body_style),
                Paragraph(f"<font color='{stage_color}'><b>{predicted_class}</b></font>", ParagraphStyle("P1", parent=body_style, fontSize=13)),
                Paragraph("<b>Confidence Score:</b>", body_style),
                Paragraph(f"<b>{conf_pct}</b>", ParagraphStyle("P2", parent=body_style, fontSize=13))
            ]
        ]
        t_pred = Table(pred_box_data, colWidths=[1.8*inch, 2.2*inch, 1.4*inch, 1.8*inch])
        t_pred.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#bfdbfe")),
            ('PADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(t_pred)
        story.append(Spacer(1, 15))

        # MRI & Grad-CAM Images Side-by-Side
        story.append(Paragraph("Visual Analysis & Grad-CAM Heatmap Overlay", section_heading))
        img_table_data = []

        rl_orig_img = self._prepare_rl_image(original_image_path)
        rl_overlay_img = self._prepare_b64_image(overlay_base64)

        if rl_orig_img and rl_overlay_img:
            img_table_data = [
                [rl_orig_img, rl_overlay_img],
                [Paragraph("<b>Original MRI Scan</b>", body_style), Paragraph("<b>Grad-CAM Explainability Heatmap</b>", body_style)]
            ]
        elif rl_orig_img:
            img_table_data = [
                [rl_orig_img, Paragraph("Grad-CAM visualization unavailable", body_style)],
                [Paragraph("<b>Original MRI Scan</b>", body_style), Paragraph("", body_style)]
            ]
        else:
            img_table_data = [[Paragraph("Image visualization not available", body_style)]]

        if img_table_data:
            t_imgs = Table(img_table_data, colWidths=[3.5*inch, 3.5*inch])
            t_imgs.setStyle(TableStyle([
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('PADDING', (0,0), (-1,-1), 4),
            ]))
            story.append(t_imgs)
            story.append(Spacer(1, 15))

        # Class Probabilities Breakdown Table
        story.append(Paragraph("Class Probabilities Distribution", section_heading))
        prob_rows = [["Disease Stage", "Probability Score", "Confidence Bar"]]
        for cls_name, prob_val in class_probabilities.items():
            pct = f"{prob_val * 100.0:.2f}%"
            prob_rows.append([cls_name, pct, self._render_mini_bar(prob_val)])

        t_prob = Table(prob_rows, colWidths=[2.5*inch, 1.8*inch, 2.9*inch])
        t_prob.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(t_prob)
        story.append(Spacer(1, 20))

        # Medical Disclaimer Box
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#fca5a5"), spaceAfter=8))
        disclaimer_banner = disclaimer_text or (
            "MEDICAL DISCLAIMER: This AI prediction and report are generated for research, "
            "educational, and decision-support purposes only. This software is NOT a certified "
            "diagnostic medical device. Results must be independently verified by a qualified medical professional."
        )
        t_disc = Table([[Paragraph(f"<b>IMPORTANT NOTICE:</b> {disclaimer_banner}", disclaimer_style)]], colWidths=[7.2*inch])
        t_disc.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fef2f2")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#f87171")),
            ('PADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(t_disc)

        doc.build(story)
        return pdf_path

    @staticmethod
    def _prepare_rl_image(img_path: Optional[str]) -> Optional[RLImage]:
        if not img_path or not os.path.exists(img_path):
            return None
        try:
            return RLImage(img_path, width=2.6*inch, height=2.6*inch)
        except Exception:
            return None

    @staticmethod
    def _prepare_b64_image(b64_str: Optional[str]) -> Optional[RLImage]:
        if not b64_str:
            return None
        try:
            clean_b64 = b64_str.split(",")[-1]
            img_bytes = base64.b64decode(clean_b64)
            buf = io.BytesIO(img_bytes)
            return RLImage(buf, width=2.6*inch, height=2.6*inch)
        except Exception:
            return None

    @staticmethod
    def _render_mini_bar(val: float) -> Paragraph:
        """Renders visual indicator bar for probability."""
        width_pct = int(val * 100)
        bar_html = f"<font color='#2563eb'><b>{'█' * (width_pct // 5)}</b></font> {width_pct}%"
        return Paragraph(bar_html, ParagraphStyle("BarStyle", fontName="Helvetica", fontSize=8))
