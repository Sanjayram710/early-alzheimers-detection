"""
CLI script to evaluate a trained model on the test dataset split.
Generates metrics, classification reports, and visual graphs (confusion matrix, ROC curves).

Usage:
    python scripts/evaluate_model.py --model_name neurodxnet --weights ./ml/saved_models/neurodxnet_best.keras
"""

import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import sys
from pathlib import Path
from typing import Tuple

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import argparse
import logging
import numpy as np
import pandas as pd
import tensorflow as tf
from concurrent.futures import ThreadPoolExecutor

from ml.models.registry import ModelRegistry
from ml.evaluation.evaluator import ModelEvaluator
from backend.preprocessing.pipeline import dip_pipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

CLASS_NAMES = ["Mild Demented", "Moderate Demented", "Non Demented", "Very Mild Demented"]
LABEL_MAP = {name: idx for idx, name in enumerate(CLASS_NAMES)}


def load_test_dataset(manifest_path: Path, max_workers: int = 8) -> Tuple[np.ndarray, np.ndarray, pd.DataFrame]:
    """Loads and preprocesses test dataset via DIP pipeline."""
    df = pd.read_csv(manifest_path)
    logger.info(f"Loading {len(df)} test samples from {manifest_path}...")

    paths = df["file_path"].tolist()
    labels = [LABEL_MAP[lbl] for lbl in df["canonical_label"].tolist()]

    def _load(p):
        processed_rgb, _, _ = dip_pipeline.process(p)
        return processed_rgb

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        images = list(executor.map(_load, paths))

    X = np.array(images, dtype=np.float32)
    y = np.array(labels, dtype=int)
    return X, y, df


def main():
    parser = argparse.ArgumentParser(description="Evaluate Trained Alzheimer's MRI Model")
    parser.add_argument("--model_name", default="custom_cnn", help="Model architecture name")
    parser.add_argument("--weights", default="./ml/saved_models/custom_cnn_best.keras", help="Path to trained weights .keras file")
    parser.add_argument("--test_csv", default="./data/processed/test.csv", help="Path to test.csv manifest")
    parser.add_argument("--output_dir", default="./ml/saved_models/evaluation_results", help="Directory to save evaluation reports and plots")
    args = parser.parse_args()

    weights_path = Path(args.weights)
    if not weights_path.exists():
        logger.error(f"Weights file not found at {weights_path}")
        return

    test_csv_path = Path(args.test_csv)
    if not test_csv_path.exists():
        logger.error(f"Test manifest file not found at {test_csv_path}")
        return

    # 1. Load Test Dataset
    X_test, y_test, df_test = load_test_dataset(test_csv_path)

    # 2. Instantiate and Load Model
    logger.info(f"Loading model '{args.model_name}' with weights from {weights_path}...")
    model_wrapper = ModelRegistry.create_model(
        model_name=args.model_name,
        input_shape=(224, 224, 3),
        num_classes=len(CLASS_NAMES)
    )
    model_wrapper.load(str(weights_path))

    # 3. Model Forward Pass
    logger.info("Running model predictions on test dataset...")
    y_pred_probs = model_wrapper.model.predict(X_test, batch_size=32, verbose=1)

    # 4. Evaluate with ModelEvaluator
    evaluator = ModelEvaluator(class_names=CLASS_NAMES)
    out_dir = Path(args.output_dir)
    metrics = evaluator.evaluate(y_true=y_test, y_pred_probs=y_pred_probs, output_dir=out_dir)

    print("\n" + "=" * 60)
    print("                MODEL EVALUATION RESULTS                ")
    print("=" * 60)
    print(f" Test Accuracy  : {metrics['accuracy'] * 100:.2f}%")
    print(f" Weighted Precision: {metrics['precision'] * 100:.2f}%")
    print(f" Weighted Recall   : {metrics['recall'] * 100:.2f}%")
    print(f" Weighted F1-Score : {metrics['f1_score'] * 100:.2f}%")
    print(f" Weighted ROC-AUC  : {metrics['roc_auc']:.4f}")
    print("=" * 60)
    print("\nPer-Class Breakdown:")
    for cls_name, report in metrics["classification_report"].items():
        if isinstance(report, dict):
            print(f"  • {cls_name:<20}: Precision = {report['precision']*100:5.1f}% | Recall = {report['recall']*100:5.1f}% | F1 = {report['f1-score']*100:5.1f}% (Support: {report['support']})")
    
    print("\nConfusion Matrix:")
    cm = np.array(metrics["confusion_matrix"])
    header_title = "True \\ Pred"
    print(f"{header_title:<18} | " + " | ".join(f"{c[:8]:^8}" for c in CLASS_NAMES))
    print("-" * 65)
    for i, row in enumerate(cm):
        row_str = " | ".join(f"{val:^8}" for val in row)
        print(f"{CLASS_NAMES[i]:<18} | {row_str}")

    print("\n" + "=" * 60)
    print(f"Visual plots and JSON exported to: {out_dir.resolve()}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
