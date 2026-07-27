from abc import ABC, abstractmethod
from typing import Tuple, Optional
import tensorflow as tf
from keras import Model


class BaseAlzheimerModel(ABC):
    """
    Abstract Base Class for all Alzheimer's Disease MRI classification models.
    Defines unified contract for building, compiling, saving, and extracting features/grad-cam target layers.
    """

    def __init__(
        self,
        input_shape: Tuple[int, int, int] = (224, 224, 3),
        num_classes: int = 4,
        learning_rate: float = 1e-3,
        name: str = "base_model"
    ):
        self.input_shape = input_shape
        self.num_classes = num_classes
        self.learning_rate = learning_rate
        self.name = name
        self.model: Optional[Model] = None

    @abstractmethod
    def build() -> Model:
        """Constructs Keras Model instance."""
        pass

    def compile(self, optimizer: Optional[tf.keras.optimizers.Optimizer] = None):
        """Compiles the Keras model with Adam optimizer, Categorical Crossentropy loss, and standard metrics."""
        if self.model is None:
            self.model = self.build()

        if optimizer is None:
            optimizer = tf.keras.optimizers.Adam(learning_rate=self.learning_rate)

        self.model.compile(
            optimizer=optimizer,
            loss="categorical_crossentropy",
            metrics=[
                "accuracy",
                tf.keras.metrics.Precision(name="precision"),
                tf.keras.metrics.Recall(name="recall"),
                tf.keras.metrics.AUC(name="auc")
            ]
        )
        return self.model

    @abstractmethod
    def get_gradcam_target_layer_name(self) -> str:
        """Returns the layer name of the last conv layer for Grad-CAM explainability."""
        pass

    def summary(self):
        """Prints Keras model summary."""
        if self.model is None:
            self.model = self.build()
        self.model.summary()

    def save(self, filepath: str):
        """Saves model weights or full Keras model."""
        if self.model:
            self.model.save(filepath)

    def load(self, filepath: str):
        """Loads model from file."""
        self.model = tf.keras.models.load_model(filepath)
        return self.model
