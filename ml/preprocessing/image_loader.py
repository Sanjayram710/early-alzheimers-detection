import os
import logging
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any
import cv2
import numpy as np

logger = logging.getLogger(__name__)

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff"}


class MRIImageLoader:
    """
    Robust image loader that recursively scans class-based dataset subfolders,
    filters out unreadable/corrupted image files without crashing, and logs activity.
    """

    def __init__(self, supported_exts: Optional[set] = None):
        self.supported_exts = supported_exts or SUPPORTED_EXTENSIONS

    def scan_dataset(self, dataset_dir: Path) -> Tuple[List[Dict[str, Any]], Dict[str, int]]:
        """
        Scans input directory recursively for class folders and image paths.

        Returns:
            records: List of dicts containing 'filepath', 'label', 'filename'
            stats: Summary dictionary of total scanned, valid, skipped, corrupted counts
        """
        dataset_dir = Path(dataset_dir).resolve()
        records = []
        stats = {
            "total_scanned": 0,
            "valid_loaded": 0,
            "corrupted_skipped": 0
        }

        if not dataset_dir.exists():
            logger.error(f"Input dataset directory does not exist: {dataset_dir}")
            return records, stats

        logger.info(f"Scanning dataset directory: {dataset_dir}")
        for path in dataset_dir.rglob("*"):
            if path.is_file() and path.suffix.lower() in self.supported_exts:
                stats["total_scanned"] += 1
                class_label = path.parent.name

                # Readability check
                if self.is_valid_image(path):
                    records.append({
                        "filepath": str(path),
                        "label": class_label,
                        "filename": path.name
                    })
                    stats["valid_loaded"] += 1
                else:
                    logger.warning(f"Corrupted or unreadable image skipped: {path}")
                    stats["corrupted_skipped"] += 1

        logger.info(
            f"Scanning complete. Scanned: {stats['total_scanned']}, "
            f"Valid: {stats['valid_loaded']}, Corrupted/Skipped: {stats['corrupted_skipped']}"
        )
        return records, stats

    @staticmethod
    def is_valid_image(filepath: Path) -> bool:
        """Verifies if image file can be read and decoded by OpenCV."""
        try:
            img = cv2.imread(str(filepath), cv2.IMREAD_UNCHANGED)
            return img is not None and img.size > 0
        except Exception:
            return False

    @staticmethod
    def load_single_image(filepath: Path) -> Tuple[np.ndarray, str]:
        """Loads a single image file from disk in BGR format."""
        filepath = Path(filepath)
        img = cv2.imread(str(filepath), cv2.IMREAD_UNCHANGED)
        if img is None:
            raise ValueError(f"Failed to read image at {filepath}")
        return img, filepath.parent.name
