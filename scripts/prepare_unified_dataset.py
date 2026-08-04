"""
Script to scan, extract, and combine all MRI dataset sources:
1. Hugging Face Parquet dataset (datasets/Alzheimer_MRI/data/)
2. Local Project dataset (Alzheimers disease dataset/.../OriginalDataset)

Generates unified, stratified train/val/test manifests in data/processed/.
"""

import io
import os
import sys
import logging
from pathlib import Path
import pandas as pd
import pyarrow.parquet as pq
from PIL import Image
from sklearn.model_selection import train_test_split

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

HF_LABEL_MAP = {
    0: "Mild Demented",
    1: "Moderate Demented",
    2: "Non Demented",
    3: "Very Mild Demented"
}

LOCAL_LABEL_MAP = {
    "milddemented": "Mild Demented",
    "moderatedemented": "Moderate Demented",
    "nondemented": "Non Demented",
    "verymilddemented": "Very Mild Demented"
}

CANONICAL_CLASSES = ["Mild Demented", "Moderate Demented", "Non Demented", "Very Mild Demented"]


def extract_hf_parquet(hf_data_dir: Path, output_base_dir: Path) -> pd.DataFrame:
    """Extracts images from Hugging Face Parquet files if not already extracted."""
    records = []
    parquet_files = [
        (hf_data_dir / "train-00000-of-00001-c08a401c53fe5312.parquet", "hf_train"),
        (hf_data_dir / "test-00000-of-00001-44110b9df98c5585.parquet", "hf_test")
    ]

    for p_file, prefix in parquet_files:
        if not p_file.exists():
            logger.warning(f"Parquet file {p_file} does not exist. Skipping.")
            continue

        table = pq.read_table(str(p_file))
        images = table.column("image").to_pylist()
        labels = table.column("label").to_pylist()

        logger.info(f"Extracting {len(labels)} samples from {p_file.name}...")
        for idx, (img_struct, label_idx) in enumerate(zip(images, labels)):
            raw_bytes = img_struct["bytes"]
            canonical_label = HF_LABEL_MAP.get(label_idx, "Non Demented")
            folder_name = canonical_label.replace(" ", "")

            class_dir = output_base_dir / folder_name
            class_dir.mkdir(parents=True, exist_ok=True)

            img_filename = f"{prefix}_{idx:05d}.jpg"
            file_path = class_dir / img_filename

            if not file_path.exists():
                image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
                image.save(file_path, "JPEG")

            records.append({
                "file_path": str(file_path.resolve()),
                "raw_label": canonical_label,
                "canonical_label": canonical_label,
                "patient_id": f"HF_{prefix}_{idx:05d}",
                "dataset_source": "HuggingFaceAlzheimer"
            })

    return pd.DataFrame(records)


def scan_local_dataset(local_dataset_dir: Path) -> pd.DataFrame:
    """Scans local project folder OriginalDataset directory."""
    records = []
    if not local_dataset_dir.exists():
        logger.warning(f"Local dataset directory {local_dataset_dir} does not exist!")
        return pd.DataFrame()

    supported_exts = {".png", ".jpg", ".jpeg"}

    for root, _, files in os.walk(local_dataset_dir):
        for f in files:
            ext = Path(f).suffix.lower()
            if ext not in supported_exts:
                continue

            file_path = Path(root) / f
            folder_name = file_path.parent.name.lower().replace(" ", "").replace("_", "")
            canonical_label = LOCAL_LABEL_MAP.get(folder_name)

            if canonical_label is None:
                continue

            records.append({
                "file_path": str(file_path.resolve()),
                "raw_label": file_path.parent.name,
                "canonical_label": canonical_label,
                "patient_id": f"LOCAL_{file_path.stem}",
                "dataset_source": "LocalOriginalDataset"
            })

    df = pd.DataFrame(records)
    logger.info(f"Scanned {len(df)} samples from Local OriginalDataset.")
    return df


def main():
    base_dir = Path(__file__).resolve().parent.parent
    hf_data_dir = base_dir / "datasets" / "Alzheimer_MRI" / "data"
    raw_hf_output_dir = base_dir / "data" / "raw" / "HuggingFaceAlzheimer"

    local_orig_dir = base_dir / "Alzheimers disease dataset" / "Alzheimers disease dataset" / "Alzheimer's dataset" / "OriginalDataset"

    processed_dir = base_dir / "data" / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)

    # 1. Extract HuggingFace dataset
    df_hf = extract_hf_parquet(hf_data_dir, raw_hf_output_dir)

    # 2. Scan Local dataset
    df_local = scan_local_dataset(local_orig_dir)

    # 3. Combine both dataset DataFrames
    combined_df = pd.concat([df_hf, df_local], ignore_index=True)
    logger.info(f"Total combined dataset samples: {len(combined_df)}")

    # Log class distribution
    class_counts = combined_df["canonical_label"].value_counts().to_dict()
    logger.info(f"Combined Class Distribution: {class_counts}")

    # 4. Stratified Split into Train (75%), Val (15%), Test (10%)
    train_val_df, test_df = train_test_split(
        combined_df,
        test_size=0.10,
        stratify=combined_df["canonical_label"],
        random_state=42
    )

    train_df, val_df = train_test_split(
        train_val_df,
        test_size=0.1667,  # 0.1667 * 0.90 approx 0.15 of total
        stratify=train_val_df["canonical_label"],
        random_state=42
    )

    logger.info(f"Final Split Counts -> Train: {len(train_df)}, Val: {len(val_df)}, Test: {len(test_df)}")

    # 5. Export Manifest CSVs
    train_df.to_csv(processed_dir / "train.csv", index=False)
    val_df.to_csv(processed_dir / "val.csv", index=False)
    test_df.to_csv(processed_dir / "test.csv", index=False)

    logger.info(f"Unified dataset manifests exported successfully to {processed_dir}")


if __name__ == "__main__":
    main()
