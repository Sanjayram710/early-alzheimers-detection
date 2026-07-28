"""
Script to extract binary image data from Hugging Face Parquet dataset files
(datasets/Alzheimer_MRI/data/) into disk images and generate train/val/test split manifests.
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import io
import os
import logging
import pandas as pd
import pyarrow.parquet as pq
from PIL import Image
from sklearn.model_selection import train_test_split

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

LABEL_MAP = {
    0: "Mild Demented",
    1: "Moderate Demented",
    2: "Non Demented",
    3: "Very Mild Demented"
}


def extract_parquet_to_images(parquet_path: Path, output_base_dir: Path, prefix: str) -> pd.DataFrame:
    """Reads a parquet file, extracts image bytes, saves JPG files, and returns DataFrame manifest."""
    table = pq.read_table(str(parquet_path))
    records = []
    
    output_base_dir.mkdir(parents=True, exist_ok=True)
    
    images = table.column("image").to_pylist()
    labels = table.column("label").to_pylist()
    
    logger.info(f"Extracting {len(labels)} samples from {parquet_path.name}...")
    
    for idx, (img_struct, label_idx) in enumerate(zip(images, labels)):
        raw_bytes = img_struct["bytes"]
        canonical_label = LABEL_MAP.get(label_idx, "Non Demented")
        folder_name = canonical_label.replace(" ", "")
        
        class_dir = output_base_dir / folder_name
        class_dir.mkdir(parents=True, exist_ok=True)
        
        img_filename = f"{prefix}_{idx:05d}.jpg"
        file_path = class_dir / img_filename
        
        # Save image file
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


def main():
    base_dir = Path(__file__).resolve().parent.parent
    hf_data_dir = base_dir / "datasets" / "Alzheimer_MRI" / "data"
    
    train_parquet = hf_data_dir / "train-00000-of-00001-c08a401c53fe5312.parquet"
    test_parquet = hf_data_dir / "test-00000-of-00001-44110b9df98c5585.parquet"
    
    if not train_parquet.exists() or not test_parquet.exists():
        logger.error("Hugging Face Parquet files not found!")
        return
    
    raw_output_dir = base_dir / "data" / "raw" / "HuggingFaceAlzheimer"
    processed_dir = base_dir / "data" / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. Extract Train & Test splits
    train_val_df = extract_parquet_to_images(train_parquet, raw_output_dir, prefix="hf_train")
    test_df = extract_parquet_to_images(test_parquet, raw_output_dir, prefix="hf_test")
    
    # 2. Split train into Train (80%) and Validation (20%)
    train_df, val_df = train_test_split(
        train_val_df,
        test_size=0.20,
        stratify=train_val_df["canonical_label"],
        random_state=42
    )
    
    logger.info(f"Splits summary - Train: {len(train_df)}, Val: {len(val_df)}, Test: {len(test_df)}")
    
    # 3. Save manifests
    train_df.to_csv(processed_dir / "train.csv", index=False)
    val_df.to_csv(processed_dir / "val.csv", index=False)
    test_df.to_csv(processed_dir / "test.csv", index=False)
    
    logger.info("Exported train.csv, val.csv, test.csv to data/processed/")


if __name__ == "__main__":
    main()
