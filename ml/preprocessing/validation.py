import hashlib
import logging
from pathlib import Path
from typing import Dict, List, Tuple
import pandas as pd

from ml.datasets.dicom_nifti import read_image_as_rgb

logger = logging.getLogger(__name__)


class DatasetValidator:
    """
    Validates file integrity, detects corrupted images, removes duplicate images via MD5 hashing,
    and calculates class imbalance statistics.
    """

    @staticmethod
    def compute_file_hash(file_path: Path) -> str:
        """Calculates MD5 hash of file content to identify duplicates."""
        hasher = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hasher.update(chunk)
        return hasher.hexdigest()

    def clean_and_validate(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, int]]:
        """
        Validates images in DataFrame, drops unreadable files and duplicate hashes.
        Returns cleaned DataFrame and cleaning summary statistics.
        """
        stats = {
            "total_scanned": len(df),
            "corrupted_removed": 0,
            "duplicates_removed": 0,
            "valid_remaining": 0
        }

        seen_hashes = set()
        valid_indices = []

        for idx, row in df.iterrows():
            file_path = Path(row["file_path"])

            # 1. File existence check
            if not file_path.exists():
                stats["corrupted_removed"] += 1
                continue

            # 2. Duplicate detection by file hash
            try:
                file_hash = self.compute_file_hash(file_path)
                if file_hash in seen_hashes:
                    stats["duplicates_removed"] += 1
                    continue
                seen_hashes.add(file_hash)
            except Exception:
                stats["corrupted_removed"] += 1
                continue

            # 3. Readability & corruption check
            try:
                _ = read_image_as_rgb(file_path, target_size=(32, 32))
                valid_indices.append(idx)
            except Exception as e:
                logger.warning(f"Corrupted image detected at {file_path}: {e}")
                stats["corrupted_removed"] += 1

        cleaned_df = df.loc[valid_indices].reset_index(drop=True)
        stats["valid_remaining"] = len(cleaned_df)

        logger.info(f"Dataset Cleaning Summary: {stats}")
        return cleaned_df, stats

    @staticmethod
    def analyze_class_imbalance(df: pd.DataFrame) -> Dict[str, Dict[str, float]]:
        """Computes count and percentage distribution per canonical label."""
        if df.empty:
            return {}

        counts = df["canonical_label"].value_counts().to_dict()
        total = len(df)
        analysis = {}

        for label, count in counts.items():
            analysis[label] = {
                "count": count,
                "percentage": round((count / total) * 100.0, 2)
            }
        return analysis
