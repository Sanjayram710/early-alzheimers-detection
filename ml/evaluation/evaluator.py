import json
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Any
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support, roc_auc_score,
    confusion_matrix, classification_report, roc_curve, precision_recall_curve
)

logger = logging.getLogger(__name__)


class ModelEvaluator:
    """
    Evaluates trained MRI classification models on test dataset splits.
    Generates quantitative metrics (Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix)
    and plots/exports publication-grade metric charts.
    """

    def __init__(self, class_names: List[str]):
        self.class_names = class_names
        self.num_classes = len(class_names)

    def evaluate(
        self,
        y_true: np.ndarray,
        y_pred_probs: np.ndarray,
        output_dir: Path
    ) -> Dict[str, Any]:
        """
        Computes all evaluation metrics and exports plots to output_dir.
        
        Args:
            y_true: Ground truth class indices array (N,) or one-hot (N, C).
            y_pred_probs: Predicted class probabilities array (N, C).
            output_dir: Directory where plots and json metrics will be saved.

        Returns:
            Dictionary containing computed evaluation metrics.
        """
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        if y_true.ndim == 2:
            y_true_indices = np.argmax(y_true, axis=1)
        else:
            y_true_indices = y_true.astype(int)

        y_pred_indices = np.argmax(y_pred_probs, axis=1)

        # Quantitative Metrics
        acc = accuracy_score(y_true_indices, y_pred_indices)
        precision, recall, f1, _ = precision_recall_fscore_support(
            y_true_indices, y_pred_indices, average="weighted", zero_division=0
        )

        try:
            auc = roc_auc_score(
                y_true if y_true.ndim == 2 else np.eye(self.num_classes)[y_true_indices],
                y_pred_probs,
                multi_class="ovr",
                average="weighted"
            )
        except Exception as e:
            logger.warning(f"Could not compute ROC-AUC: {e}")
            auc = 0.0

        cm = confusion_matrix(y_true_indices, y_pred_indices)
        clf_report_dict = classification_report(
            y_true_indices, y_pred_indices, target_names=self.class_names, output_dict=True, zero_division=0
        )

        metrics_summary = {
            "accuracy": float(acc),
            "precision": float(precision),
            "recall": float(recall),
            "f1_score": float(f1),
            "roc_auc": float(auc),
            "confusion_matrix": cm.tolist(),
            "classification_report": clf_report_dict
        }

        # Save metrics as JSON
        metrics_json_path = output_dir / "evaluation_metrics.json"
        with open(metrics_json_path, "w") as f:
            json.dump(metrics_summary, f, indent=2)

        # Export Plots
        self.plot_confusion_matrix(cm, output_dir / "confusion_matrix.png")
        self.plot_roc_curves(y_true_indices, y_pred_probs, output_dir / "roc_curves.png")
        self.plot_pr_curves(y_true_indices, y_pred_probs, output_dir / "precision_recall_curves.png")

        logger.info(f"Evaluation complete. Metrics exported to {output_dir}")
        return metrics_summary

    def plot_confusion_matrix(self, cm: np.ndarray, save_path: Path):
        """Generates heatmap plot of the confusion matrix."""
        plt.figure(figsize=(8, 6))
        sns.heatmap(
            cm,
            annot=True,
            fmt="d",
            cmap="Blues",
            xticklabels=self.class_names,
            yticklabels=self.class_names
        )
        plt.title("Alzheimer's Detection - Confusion Matrix", fontsize=14, pad=12)
        plt.ylabel("True Diagnosis Stage", fontsize=12)
        plt.xlabel("Predicted Stage", fontsize=12)
        plt.tight_layout()
        plt.savefig(save_path, dpi=300)
        plt.close()

    def plot_roc_curves(self, y_true_indices: np.ndarray, y_pred_probs: np.ndarray, save_path: Path):
        """Plots One-vs-Rest ROC curves per disease class."""
        plt.figure(figsize=(9, 7))
        y_true_onehot = np.eye(self.num_classes)[y_true_indices]

        for i, class_name in enumerate(self.class_names):
            fpr, tpr, _ = roc_curve(y_true_onehot[:, i], y_pred_probs[:, i])
            try:
                class_auc = roc_auc_score(y_true_onehot[:, i], y_pred_probs[:, i])
            except Exception:
                class_auc = 0.0
            plt.plot(fpr, tpr, label=f"{class_name} (AUC = {class_auc:.3f})")

        plt.plot([0, 1], [0, 1], "k--", label="Random Classifier")
        plt.xlabel("False Positive Rate", fontsize=12)
        plt.ylabel("True Positive Rate", fontsize=12)
        plt.title("Receiver Operating Characteristic (ROC) Curves", fontsize=14, pad=12)
        plt.legend(loc="lower right")
        plt.grid(True, linestyle=":", alpha=0.6)
        plt.tight_layout()
        plt.savefig(save_path, dpi=300)
        plt.close()

    def plot_pr_curves(self, y_true_indices: np.ndarray, y_pred_probs: np.ndarray, save_path: Path):
        """Plots Precision-Recall curves per class."""
        plt.figure(figsize=(9, 7))
        y_true_onehot = np.eye(self.num_classes)[y_true_indices]

        for i, class_name in enumerate(self.class_names):
            precision, recall, _ = precision_recall_curve(y_true_onehot[:, i], y_pred_probs[:, i])
            plt.plot(recall, precision, label=f"{class_name}")

        plt.xlabel("Recall", fontsize=12)
        plt.ylabel("Precision", fontsize=12)
        plt.title("Precision-Recall Curves by Disease Stage", fontsize=14, pad=12)
        plt.legend(loc="lower left")
        plt.grid(True, linestyle=":", alpha=0.6)
        plt.tight_layout()
        plt.savefig(save_path, dpi=300)
        plt.close()

    @staticmethod
    def plot_training_history(history_dict: Dict[str, list], save_path: Path):
        """Plots accuracy and loss training history curves."""
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))

        # Accuracy Curve
        if "accuracy" in history_dict:
            axes[0].plot(history_dict["accuracy"], label="Train Accuracy", linewidth=2)
        if "val_accuracy" in history_dict:
            axes[0].plot(history_dict["val_accuracy"], label="Val Accuracy", linewidth=2, linestyle="--")
        axes[0].set_title("Model Accuracy Curve", fontsize=13)
        axes[0].set_xlabel("Epoch")
        axes[0].set_ylabel("Accuracy")
        axes[0].legend()
        axes[0].grid(True, alpha=0.4)

        # Loss Curve
        if "loss" in history_dict:
            axes[1].plot(history_dict["loss"], label="Train Loss", linewidth=2, color="crimson")
        if "val_loss" in history_dict:
            axes[1].plot(history_dict["val_loss"], label="Val Loss", linewidth=2, linestyle="--", color="coral")
        axes[1].set_title("Model Loss Curve", fontsize=13)
        axes[1].set_xlabel("Epoch")
        axes[1].set_ylabel("Loss")
        axes[1].legend()
        axes[1].grid(True, alpha=0.4)

        plt.tight_layout()
        plt.savefig(save_path, dpi=300)
        plt.close()
