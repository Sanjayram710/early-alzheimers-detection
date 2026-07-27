"""
CLI script to execute end-to-end model training, checkpointing, and evaluation.
Usage:
    python scripts/train_model.py --model_name custom_cnn --epochs 25 --output_dir ./ml/saved_models
"""

import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import sys
from pathlib import Path

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import argparse
import logging
import pandas as pd
import tensorflow as tf

from ml.models.registry import ModelRegistry
from ml.training.trainer import ModelTrainer
from ml.evaluation.evaluator import ModelEvaluator
from ml.preprocessing.normalization import load_and_preprocess_single

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CLASS_NAMES = ["Non Demented", "Very Mild Demented", "Mild Demented", "Moderate Demented"]
LABEL_MAP = {name: idx for idx, name in enumerate(CLASS_NAMES)}


def build_tf_dataset(df: pd.DataFrame, batch_size: int = 32, is_training: bool = True) -> tf.data.Dataset:
    """Helper to convert DataFrame manifest into a batched tf.data.Dataset."""
    paths = df["file_path"].tolist()
    labels = [LABEL_MAP[lbl] for lbl in df["canonical_label"].tolist()]

    def _generator():
        for p, l in zip(paths, labels):
            img = load_and_preprocess_single(p, target_size=(224, 224), normalize_pixels=True)
            one_hot = tf.one_hot(l, depth=len(CLASS_NAMES))
            yield img, one_hot

    ds = tf.data.Dataset.from_generator(
        _generator,
        output_signature=(
            tf.TensorSpec(shape=(224, 224, 3), dtype=tf.float32),
            tf.TensorSpec(shape=(len(CLASS_NAMES),), dtype=tf.float32)
        )
    )

    if is_training:
        ds = ds.shuffle(buffer_size=1000).repeat()

    return ds.batch(batch_size).prefetch(tf.data.AUTOTUNE)


def main():
    parser = argparse.ArgumentParser(description="Alzheimer's MRI Model Training CLI")
    parser.add_argument("--model_name", default="custom_cnn", help="Model architecture name")
    parser.add_argument("--epochs", type=int, default=20, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size")
    parser.add_argument("--learning_rate", type=float, default=1e-3, help="Learning rate")
    parser.add_argument("--manifest_dir", default="./data/processed", help="Path to train.csv/val.csv")
    parser.add_argument("--output_dir", default="./ml/saved_models", help="Output directory for model weights")
    args = parser.parse_args()

    manifest_path = Path(args.manifest_dir)
    train_csv = manifest_path / "train.csv"
    val_csv = manifest_path / "val.csv"

    if not train_csv.exists() or not val_csv.exists():
        logger.error(f"Manifest files not found at {manifest_path}. Run prepare_dataset.py first.")
        return

    train_df = pd.read_csv(train_csv)
    val_df = pd.read_csv(val_csv)

    train_ds = build_tf_dataset(train_df, batch_size=args.batch_size, is_training=True)
    val_ds = build_tf_dataset(val_df, batch_size=args.batch_size, is_training=False)

    # Instantiate model from registry
    model_wrapper = ModelRegistry.create_model(
        model_name=args.model_name,
        input_shape=(224, 224, 3),
        num_classes=len(CLASS_NAMES),
        learning_rate=args.learning_rate
    )

    trainer = ModelTrainer(output_dir=Path(args.output_dir), model_wrapper=model_wrapper)
    history, metadata = trainer.train(
        train_dataset=train_ds,
        val_dataset=val_ds,
        epochs=args.epochs,
        batch_size=args.batch_size
    )

    logger.info(f"Training completed successfully. Artifacts saved: {metadata}")


if __name__ == "__main__":
    main()
