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
    - CSVLogger & Optional TensorBoard Logging
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
        steps_per_epoch: Optional[int] = None,
        validation_steps: Optional[int] = None,
        patience_early_stopping: int = 10,
        patience_reduce_lr: int = 5,
        class_weight: Optional[Dict[int, float]] = None,
        resume: bool = False
    ) -> Tuple[tf.keras.callbacks.History, Dict[str, Any]]:
        """
        Executes model training loop with full callback stack.
        Returns Keras History object and training metadata summary.
        """
        # Checkpoints setup
        best_model_path = self.output_dir / f"{self.model_wrapper.name}_best.keras"
        last_checkpoint_path = self.output_dir / f"{self.model_wrapper.name}_last.keras"
        csv_history_path = self.output_dir / "training_history.csv"
        log_dir = self.output_dir / "logs"
        log_dir.mkdir(parents=True, exist_ok=True)

        initial_epoch = 0
        if resume and last_checkpoint_path.exists():
            logger.info(f"Resuming training from checkpoint: {last_checkpoint_path}")
            try:
                self.model_wrapper.model = tf.keras.models.load_model(str(last_checkpoint_path))
                if csv_history_path.exists():
                    import pandas as pd
                    df_hist = pd.read_csv(csv_history_path)
                    if not df_hist.empty and "epoch" in df_hist.columns:
                        initial_epoch = int(df_hist["epoch"].max()) + 1
                    else:
                        initial_epoch = len(df_hist)
                    logger.info(f"Loaded training history ({len(df_hist)} entries). Resuming from epoch {initial_epoch}.")
            except Exception as e:
                logger.warning(f"Could not load checkpoint for resuming ({e}). Starting fresh training.")

        model = self.model_wrapper.model
        if model is None:
            model = self.model_wrapper.compile()

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
                filename=str(csv_history_path),
                append=resume and initial_epoch > 0
            )
        ]

        try:
            import tensorboard
            writer = tf.summary.create_file_writer(str(log_dir))
            writer.close()
            cb_stack.append(callbacks.TensorBoard(log_dir=str(log_dir), histogram_freq=0))
        except Exception as e:
            logger.warning(f"TensorBoard summary writer unavailable ({e}). Using CSVLogger.")

        logger.info(f"Starting training for {self.model_wrapper.name} for {epochs} epochs (initial_epoch={initial_epoch})...")
        history = model.fit(
            train_dataset,
            validation_data=val_dataset,
            epochs=epochs,
            initial_epoch=initial_epoch,
            steps_per_epoch=steps_per_epoch,
            validation_steps=validation_steps,
            callbacks=cb_stack,
            class_weight=class_weight,
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
