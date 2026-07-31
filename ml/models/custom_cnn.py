from typing import Tuple
import tensorflow as tf
from keras import layers, Model, Sequential
from ml.models.base import BaseAlzheimerModel


class CustomCNNModel(BaseAlzheimerModel):
    """
    Custom Baseline CNN architecture for MRI Alzheimer's classification.
    
    Architecture Flow:
    Input -> Conv2D(32, 3x3) -> ReLU -> MaxPool2D(2x2)
          -> Conv2D(64, 3x3) -> BatchNorm -> ReLU -> MaxPool2D(2x2)
          -> Conv2D(128, 3x3) -> Dropout(0.3)
          -> Flatten -> Dense(256) -> Dropout(0.5) -> Dense(num_classes, Softmax)
    """

    def __init__(
        self,
        input_shape: Tuple[int, int, int] = (224, 224, 3),
        num_classes: int = 4,
        learning_rate: float = 1e-3,
        name: str = "neurodxnet"
    ):
        super().__init__(
            input_shape=input_shape,
            num_classes=num_classes,
            learning_rate=learning_rate,
            name=name
        )

    def build(self) -> Model:
        inputs = layers.Input(shape=self.input_shape, name="mri_input")

        # Block 1
        x = layers.Conv2D(32, (3, 3), padding="same", name="conv2d_1")(inputs)
        x = layers.Activation("relu", name="relu_1")(x)
        x = layers.MaxPooling2D((2, 2), name="maxpool_1")(x)

        # Block 2
        x = layers.Conv2D(64, (3, 3), padding="same", name="conv2d_2")(x)
        x = layers.BatchNormalization(name="batchnorm_1")(x)
        x = layers.Activation("relu", name="relu_2")(x)
        x = layers.MaxPooling2D((2, 2), name="maxpool_2")(x)

        # Block 3
        x = layers.Conv2D(128, (3, 3), padding="same", name="target_conv_layer")(x)
        x = layers.Activation("relu", name="relu_3")(x)
        x = layers.Dropout(0.3, name="dropout_1")(x)

        # Classifier Head
        x = layers.Flatten(name="flatten")(x)
        x = layers.Dense(256, activation="relu", name="dense_1")(x)
        x = layers.Dropout(0.5, name="dropout_2")(x)
        outputs = layers.Dense(self.num_classes, activation="softmax", name="predictions")(x)

        model = Model(inputs=inputs, outputs=outputs, name=self.name)
        self.model = model
        return model

    def get_gradcam_target_layer_name(self) -> str:
        return "target_conv_layer"
