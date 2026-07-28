import os
import re
import logging
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import pandas as pd

logger = logging.getLogger(__name__)

# Standard label mapping across different dataset naming schemes
LABEL_MAPPINGS: Dict[str, str] = {
    # Standard 4 classes
    "nondemented": "Non Demented",
    "non_demented": "Non Demented",
    "non-demented": "Non Demented",
    "cn": "Non Demented",  # Cognitive Normal (ADNI)
    "control": "Non Demented",
    "normal": "Non Demented",
    "0": "Non Demented",

    "verymilddemented": "Very Mild Demented",
    "very_mild_demented": "Very Mild Demented",
    "very-mild-demented": "Very Mild Demented",
    "very_mild": "Very Mild Demented",
    "1": "Very Mild Demented",

    "milddemented": "Mild Demented",
    "mild_demented": "Mild Demented",
    "mild-demented": "Mild Demented",
    "mci": "Mild Demented",  # Mild Cognitive Impairment (ADNI/OASIS)
    "2": "Mild Demented",

    "moderatedemented": "Moderate Demented",
    "moderate_demented": "Moderate Demented",
    "moderate-demented": "Moderate Demented",
    "ad": "Moderate Demented",  # Alzheimer's Disease (ADNI/OASIS)
    "demented": "Moderate Demented",
    "3": "Moderate Demented"
}

CANONICAL_CLASSES: List[str] = [
    "Non Demented",
    "Very Mild Demented",
    "Mild Demented",
    "Moderate Demented"
]


class MRIDatasetLoader:
    """
    Ingests and merges MRI image datasets from multiple sources (ADNI, OASIS, AIBL, Kaggle),
    maps target labels to standardized canonical classes, and extracts patient identifiers.
    """

    def __init__(self, dataset_dirs: List[Path]):
        self.dataset_dirs = [Path(d) for d in dataset_dirs]

    def scan_dataset(self) -> pd.DataFrame:
        """
        Scans all provided dataset directories recursively and returns a DataFrame containing:
        - file_path
        - raw_label
        - canonical_label
        - patient_id (extracted from filename/folder if present)
        - dataset_source
        """
        records = []
        supported_exts = {".png", ".jpg", ".jpeg", ".dcm", ".dicom", ".nii", ".gz"}

        for base_dir in self.dataset_dirs:
            if not base_dir.exists():
                logger.warning(f"Dataset path {base_dir} does not exist. Skipping.")
                continue

            source_name = base_dir.name
            for root, _, files in os.walk(base_dir):
                for f in files:
                    file_path = Path(root) / f
                    ext = file_path.suffix.lower()
                    if ext not in supported_exts:
                        continue

                    # Extract class label from folder structure or filename
                    raw_label = self._extract_raw_label(file_path, base_dir)
                    canonical_label = self.normalize_label(raw_label)

                    if canonical_label is None:
                        continue

                    patient_id = self.extract_patient_id(file_path)

                    records.append({
                        "file_path": str(file_path.resolve()),
                        "raw_label": raw_label,
                        "canonical_label": canonical_label,
                        "patient_id": patient_id,
                        "dataset_source": source_name
                    })

        df = pd.DataFrame(records)
        logger.info(f"Scanned {len(df)} images across {len(self.dataset_dirs)} dataset sources.")
        return df

    @staticmethod
    def normalize_label(raw_label: str) -> Optional[str]:
        """Normalizes raw class string to one of the canonical 4 disease stage classes."""
        clean = raw_label.strip().lower().replace(" ", "_")
        return LABEL_MAPPINGS.get(clean, None)

    @staticmethod
    def _extract_raw_label(file_path: Path, base_dir: Path) -> str:
        """Extracts label from parent directory relative to base_dir."""
        rel_parts = file_path.relative_to(base_dir).parts
        if len(rel_parts) > 1:
            return rel_parts[0]
        return file_path.stem

    @staticmethod
    def extract_patient_id(file_path: Path) -> str:
        """
        Extracts patient identifier using common patterns:
        - OASIS format: OAS1_0001_MR1 -> patient_id: OAS1_0001
        - ADNI format: 002_S_0295 -> patient_id: 002_S_0295
        - Kaggle/Generic: fallback to parent folder name + prefix
        """
        filename = file_path.name
        # Match OASIS pattern
        oasis_match = re.search(r"(OAS\d+_\d+)", filename, re.IGNORECASE)
        if oasis_match:
            return oasis_match.group(1).upper()

        # Match ADNI pattern
        adni_match = re.search(r"(\d{3}_S_\d{4})", filename, re.IGNORECASE)
        if adni_match:
            return adni_match.group(1).upper()

        # Match generic Subject ID format (e.g. sub-001 or sub_001)
        sub_match = re.search(r"(sub[-_]\w+)", filename, re.IGNORECASE)
        if sub_match:
            return sub_match.group(1).lower()

        # Fallback to parent directory name as pseudo-patient grouping
        return file_path.parent.name
