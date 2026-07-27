import os
import random
import logging
from pathlib import Path
from typing import Dict, Any, Optional, Tuple
import numpy as np
import tensorflow as tf
from keras import callbacks

from ml.models.base import BaseAlzheimerModel
from ml.training.tracker import ExperimentTracker

logger = logging.getLogger(__name__)


def set_reproducibility_seed(seed: int = 42):
    """Sets random seeds across Python, NumPy, and TensorFlow for reproducible training."""
    os.environ["PYTHONHASHSEED"] = str(seed)
    random.seed(seed)
    np.random.seed(seed)
    tf.random.set_seed(seed)
    logger.info(f"Random seed set to {seed}")


def enable_mixed_precision():
    """Enables mixed precision policy (fp16) when GPU is available for accelerated training."""
    gpus = tf.config.list_physical_devices("GPU")
    if gpus:
        try:
            tf.keras.mixed_precision.set_global_policy("mixed_float16")
            logger.info("Mixed precision training (mixed_float16) enabled for GPU.")
        except Exception as e:
            logger.warning(f"Could not enable mixed precision: {e}")
    else:
        logger.info("No GPU detected. Running training on CPU with float32 precision.")


class ModelTrainer:
    """
    Orchestrates Keras model training with callbacks:
    - ModelCheckpoint (Best model + Last checkpoint)
    - EarlyStopping
    - ReduceLROnPlateau
    - TensorBoard Logging
    """

    def __init__(
        self,
        output_dir: Path,
        model_wrapper: BaseAlzheimerModel,
        use_mixed_precision: bool = True,
        seed: int = 42
    ):
        self.output_dir = Path(output_dir).resolve()
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.model_wrapper = model_wrapper

        set_reproducibility_seed(seed)
        if use_mixed_precision:
            enable_mixed_precision()

    def train(
        self,
        train_dataset: tf.data.Dataset,
        val_dataset: tf.data.Dataset,
        epochs: int = 50,
        batch_size: int = 32,
        patience_early_stopping: int = 10,
        patience_reduce_lr: int = 5
    ) -> Tuple[tf.keras.callbacks.History, Dict[str, Any]]:
        """
        Executes model training loop with full callback stack.
        Returns Keras History object and training metadata summary.
        """
        model = self.model_wrapper.model
        if model is None:
            model = self.model_wrapper.compile()

        # Checkpoints setup
        best_model_path = self.output_dir / f"{self.model_wrapper.name}_best.keras"
        last_checkpoint_path = self.output_dir / f"{self.model_wrapper.name}_last.keras"
        log_dir = self.output_dir / "logs"
        log_dir.mkdir(parents=True, exist_ok=True)

        cb_stack = [
            callbacks.ModelCheckpoint(
                filepath=str(best_model_path),
                monitor="val_accuracy",
                mode="max",
                save_best_only=True,
                verbose=1
            ),
            callbacks.ModelCheckpoint(
                filepath=str(last_checkpoint_path),
                save_best_only=False,
                verbose=0
            ),
            callbacks.EarlyStopping(
                monitor="val_loss",
                mode="min",
                patience=patience_early_stopping,
                restore_best_weights=True,
                verbose=1
            ),
            callbacks.ReduceLROnPlateau(
                monitor="val_loss",
                factor=0.5,
                patience=patience_reduce_lr,
                min_lr=1e-6,
                verbose=1
            ),
            callbacks.CSVLogger(
                filename=str(self.output_dir / "training_history.csv"),
                append=False
            )
        ]

        try:
            writer = tf.summary.create_file_writer(str(log_dir))
            writer.close()
            cb_stack.append(callbacks.TensorBoard(log_dir=str(log_dir), histogram_freq=0))
        except Exception as e:
            logger.warning(f"TensorBoard summary writer unavailable for path ({e}). Using CSVLogger.")

        logger.info(f"Starting training for {self.model_wrapper.name} for {epochs} epochs...")
        history = model.fit(
            train_dataset,
            validation_data=val_dataset,
            epochs=epochs,
            callbacks=cb_stack,
            verbose=1
        )

        # Log run metadata using ExperimentTracker
        tracker = ExperimentTracker(self.output_dir / "experiments")
        hyperparams = {
            "model_name": self.model_wrapper.name,
            "learning_rate": self.model_wrapper.learning_rate,
            "epochs": epochs,
            "batch_size": batch_size
        }

        # Convert numpy floats to standard Python floats for JSON serialization
        history_dict = {k: [float(val) for val in v] for k, v in history.history.items()}

        run_path = tracker.log_run(
            run_name=self.model_wrapper.name,
            hyperparameters=hyperparams,
            history=history_dict,
            test_metrics={"best_val_accuracy": float(max(history_dict.get("val_accuracy", [0.0])))}
        )

        metadata = {
            "best_model_path": str(best_model_path),
            "last_checkpoint_path": str(last_checkpoint_path),
            "log_dir": str(log_dir),
            "experiment_log_path": str(run_path)
        }

        return history, metadata
