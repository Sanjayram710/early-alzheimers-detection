import json
import logging
from pathlib import Path
from typing import List, Dict, Tuple, Any, Optional
from sklearn.model_selection import StratifiedShuffleSplit

logger = logging.getLogger(__name__)

DEFAULT_LABEL_MAPPING = {
    "MildDemented": 0,
    "ModerateDemented": 1,
    "NonDemented": 2,
    "VeryMildDemented": 3
}


class StratifiedDatasetSplitter:
    """
    Splits dataset into Train (70%), Validation (15%), and Test (15%) partitions
    using class-stratified shuffle splitting with fixed seed=42 for exact reproducibility.
    """

    def __init__(
        self,
        train_ratio: float = 0.70,
        val_ratio: float = 0.15,
        test_ratio: float = 0.15,
        seed: int = 42,
        label_mapping: Optional[Dict[str, int]] = None
    ):
        assert abs((train_ratio + val_ratio + test_ratio) - 1.0) < 1e-5, "Ratios must sum to 1.0"
        self.train_ratio = train_ratio
        self.val_ratio = val_ratio
        self.test_ratio = test_ratio
        self.seed = seed
        self.label_mapping = label_mapping or DEFAULT_LABEL_MAPPING

    def split(
        self,
        records: List[Dict[str, Any]]
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Splits image records into (train_records, val_records, test_records).
        """
        if not records:
            raise ValueError("Cannot split empty records list.")

        labels = [r["label"] for r in records]
        val_test_ratio = self.val_ratio + self.test_ratio

        from collections import Counter
        from sklearn.model_selection import ShuffleSplit

        # 1. Stratified Split Train vs (Val + Test)
        counts1 = Counter(labels)
        if min(counts1.values()) >= 2:
            sss1 = StratifiedShuffleSplit(n_splits=1, test_size=val_test_ratio, random_state=self.seed)
            train_idx, temp_idx = next(sss1.split(records, labels))
        else:
            ss1 = ShuffleSplit(n_splits=1, test_size=val_test_ratio, random_state=self.seed)
            train_idx, temp_idx = next(ss1.split(records))

        train_records = [records[i] for i in train_idx]
        temp_records = [records[i] for i in temp_idx]
        temp_labels = [labels[i] for i in temp_idx]

        # 2. Stratified Split Val vs Test
        val_relative_ratio = self.val_ratio / val_test_ratio
        counts2 = Counter(temp_labels)
        if len(counts2) > 0 and min(counts2.values()) >= 2:
            sss2 = StratifiedShuffleSplit(n_splits=1, test_size=(1.0 - val_relative_ratio), random_state=self.seed)
            val_idx, test_idx = next(sss2.split(temp_records, temp_labels))
        else:
            ss2 = ShuffleSplit(n_splits=1, test_size=(1.0 - val_relative_ratio), random_state=self.seed)
            val_idx, test_idx = next(ss2.split(temp_records))

        val_records = [temp_records[i] for i in val_idx]
        test_records = [temp_records[i] for i in test_idx]

        # Attach encoded integer label to each record
        for r in train_records + val_records + test_records:
            r["encoded_label"] = self.label_mapping.get(r["label"], 0)

        logger.info(
            f"Stratified Split Complete: Train={len(train_records)}, "
            f"Val={len(val_records)}, Test={len(test_records)}"
        )
        return train_records, val_records, test_records

    def save_label_encoder(self, output_path: Path):
        """Generates and saves label_encoder.json file."""
        output_path = Path(output_path).resolve()
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w") as f:
            json.dump(self.label_mapping, f, indent=2)
        logger.info(f"Saved label encoder dictionary to {output_path}")
