import uuid
import base64
from pathlib import Path
from typing import Tuple
from backend.utils.config import settings


class StorageService:
    """Manages file storage for original uploaded MRI scans, Grad-CAM images, and PDF reports."""

    def __init__(self):
        self.upload_dir = settings.get_upload_path()
        self.reports_dir = settings.get_reports_path()

    def save_upload_bytes(self, file_bytes: bytes, original_filename: str) -> Tuple[str, Path]:
        """Saves uploaded raw image file to disk and returns unique file ID and absolute path."""
        ext = Path(original_filename).suffix or ".png"
        file_id = f"mri_{uuid.uuid4().hex[:12]}{ext}"
        abs_path = self.upload_dir / file_id

        with open(abs_path, "wb") as f:
            f.write(file_bytes)

        return file_id, abs_path

    def save_base64_image(self, b64_str: str, prefix: str = "gradcam") -> Tuple[str, Path]:
        """Decodes base64 PNG data URL string and saves as file."""
        clean_b64 = b64_str.split(",")[-1]
        img_bytes = base64.b64decode(clean_b64)

        file_id = f"{prefix}_{uuid.uuid4().hex[:12]}.png"
        abs_path = self.upload_dir / file_id

        with open(abs_path, "wb") as f:
            f.write(img_bytes)

        return file_id, abs_path


storage_service = StorageService()
