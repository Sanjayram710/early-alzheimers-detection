"""
CLI script to scan, clean, validate, and split raw public MRI image datasets (ADNI, OASIS, Kaggle).
Usage:
    python scripts/prepare_dataset.py --dataset_dir ./data/raw --output_dir ./data/processed
"""

import sys
from pathlib import Path

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import argparse
import logging
from ml.datasets.loader import MRIDatasetLoader
from ml.preprocessing.validation import DatasetValidator
from ml.preprocessing.splitter import PatientDataSplitter

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(description="Alzheimer's MRI Dataset Preparation Tool")
    parser.add_argument("--dataset_dirs", nargs="+", required=True, help="List of dataset directories to scan")
    parser.add_argument("--output_dir", required=True, help="Directory to save split manifest CSVs")
    args = parser.parse_args()

    # 1. Scan Datasets
    loader = MRIDatasetLoader([Path(d) for d in args.dataset_dirs])
    raw_df = loader.scan_dataset()
    logger.info(f"Raw scanned samples: {len(raw_df)}")

    # 2. Validate & Clean
    validator = DatasetValidator()
    cleaned_df, stats = validator.clean_and_validate(raw_df)
    logger.info(f"Cleaned dataset summary: {stats}")

    # 3. Analyze Imbalance
    imbalance = validator.analyze_class_imbalance(cleaned_df)
    logger.info(f"Class Distribution: {imbalance}")

    # 4. Patient-Aware Split
    splitter = PatientDataSplitter(train_ratio=0.70, val_ratio=0.15, test_ratio=0.15)
    train_df, val_df, test_df = splitter.split(cleaned_df)

    # 5. Export Split Manifest CSVs
    out_path = Path(args.output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    train_df.to_csv(out_path / "train.csv", index=False)
    val_df.to_csv(out_path / "val.csv", index=False)
    test_df.to_csv(out_path / "test.csv", index=False)
    logger.info(f"Dataset manifests exported successfully to {out_path}")


if __name__ == "__main__":
    main()
