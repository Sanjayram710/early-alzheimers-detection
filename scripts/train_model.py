"""
CLI script to execute end-to-end model training, checkpointing, and evaluation.
Usage:
    python scripts/train_model.py --model_name custom_cnn --epochs 20 --output_dir ./ml/saved_models
"""

import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import sys
from pathlib import Path
from typing import Tuple, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import argparse
import logging
import numpy as np
import pandas as pd
import tensorflow as tf

from ml.models.registry import ModelRegistry
from ml.training.trainer import ModelTrainer
from backend.preprocessing.pipeline import dip_pipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CLASS_NAMES = ["Non Demented", "Very Mild Demented", "Mild Demented", "Moderate Demented"]
LABEL_MAP = {name: idx for idx, name in enumerate(CLASS_NAMES)}


def build_streaming_dataset(df: pd.DataFrame, batch_size: int = 32, is_training: bool = True) -> tf.data.Dataset:
    """Creates a memory-efficient streaming tf.data.Dataset that loads and preprocesses images per batch."""
    paths = df["file_path"].tolist()
    labels = [LABEL_MAP[lbl] for lbl in df["canonical_label"].tolist()]
    y_cat = tf.keras.utils.to_categorical(labels, num_classes=len(CLASS_NAMES))

    def _py_func_loader(path_tensor, label_tensor):
        path_str = path_tensor.numpy().decode("utf-8")
        try:
            processed_rgb, _, _ = dip_pipeline.process(path_str)
        except Exception:
            processed_rgb = np.zeros((224, 224, 3), dtype=np.float32)
        return processed_rgb.astype(np.float32), label_tensor.numpy().astype(np.float32)

    def _map_fn(path, label):
        img, lbl = tf.py_function(
            func=_py_func_loader,
            inp=[path, label],
            Tout=[tf.float32, tf.float32]
        )
        img.set_shape((224, 224, 3))
        lbl.set_shape((len(CLASS_NAMES),))
        return img, lbl

    ds = tf.data.Dataset.from_tensor_slices((paths, y_cat))
    if is_training:
        ds = ds.shuffle(buffer_size=min(len(paths), 2000), seed=42)
    ds = ds.map(_map_fn, num_parallel_calls=tf.data.AUTOTUNE)
    ds = ds.batch(batch_size).prefetch(tf.data.AUTOTUNE)
    return ds


def main():
    parser = argparse.ArgumentParser(description="Alzheimer's MRI Model Training CLI")
    parser.add_argument("--model_name", default="neurodxnet", help="Model architecture name")
    parser.add_argument("--epochs", type=int, default=20, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size")
    parser.add_argument("--learning_rate", type=float, default=1e-3, help="Learning rate")
    parser.add_argument("--manifest_dir", default="./data/processed", help="Path to train.csv/val.csv")
    parser.add_argument("--output_dir", default="./ml/saved_models", help="Output directory for model weights")
    parser.add_argument("--resume", action="store_true", help="Resume training from last saved checkpoint if available")
    args = parser.parse_args()

    manifest_path = Path(args.manifest_dir)
    train_csv = manifest_path / "train.csv"
    val_csv = manifest_path / "val.csv"

    if not train_csv.exists() or not val_csv.exists():
        logger.error(f"Manifest files not found at {manifest_path}. Run prepare_hf_dataset.py first.")
        return

    train_df = pd.read_csv(train_csv)
    val_df = pd.read_csv(val_csv)

    logger.info(f"Building streaming datasets for {len(train_df)} train samples and {len(val_df)} val samples...")
    train_ds = build_streaming_dataset(train_df, batch_size=args.batch_size, is_training=True)
    val_ds = build_streaming_dataset(val_df, batch_size=args.batch_size, is_training=False)

    # Instantiate model from registry
    model_wrapper = ModelRegistry.create_model(
        model_name=args.model_name,
        input_shape=(224, 224, 3),
        num_classes=len(CLASS_NAMES),
        learning_rate=args.learning_rate
    )

    from sklearn.utils.class_weight import compute_class_weight
    train_labels = [LABEL_MAP[lbl] for lbl in train_df["canonical_label"].tolist()]
    raw_weights = compute_class_weight("balanced", classes=np.unique(train_labels), y=train_labels)
    # Apply square root scaling and clipping to prevent disproportionately heavy loss penalties
    smoothed_weights = np.clip(np.sqrt(raw_weights), 0.8, 3.0)
    class_weight_dict = {int(i): float(w) for i, w in enumerate(smoothed_weights)}
    logger.info(f"Computed smoothed class weights for balanced training: {class_weight_dict}")

    trainer = ModelTrainer(output_dir=Path(args.output_dir), model_wrapper=model_wrapper)
    history, metadata = trainer.train(
        train_dataset=train_ds,
        val_dataset=val_ds,
        epochs=args.epochs,
        batch_size=args.batch_size,
        class_weight=class_weight_dict,
        resume=args.resume
    )

    logger.info(f"Training completed successfully. Artifacts saved: {metadata}")


if __name__ == "__main__":
    main()
