from typing import Tuple
import tensorflow as tf
from keras import layers, Model
from keras.applications import ResNet50, EfficientNetB0, DenseNet121, MobileNetV2
from ml.models.base import BaseAlzheimerModel


class TransferLearningModel(BaseAlzheimerModel):
    """
    Modular Transfer Learning wrapper for ImageNet pretrained backbones:
    - ResNet50
    - EfficientNetB0
    - DenseNet121
    - MobileNetV2
    """

    BACKBONE_MAP = {
        "resnet50": (ResNet50, "conv5_block3_out"),
        "efficientnetb0": (EfficientNetB0, "top_activation"),
        "densenet121": (DenseNet121, "relu"),
        "mobilenetv2": (MobileNetV2, "out_relu")
    }

    def __init__(
        self,
        backbone_name: str = "resnet50",
        input_shape: Tuple[int, int, int] = (224, 224, 3),
        num_classes: int = 4,
        freeze_backbone: bool = True,
        learning_rate: float = 1e-4
    ):
        backbone_key = backbone_name.lower()
        if backbone_key not in self.BACKBONE_MAP:
            raise ValueError(f"Unsupported backbone '{backbone_name}'. Choose from: {list(self.BACKBONE_MAP.keys())}")

        super().__init__(
            input_shape=input_shape,
            num_classes=num_classes,
            learning_rate=learning_rate,
            name=f"transfer_{backbone_key}"
        )
        self.backbone_name = backbone_key
        self.freeze_backbone = freeze_backbone
        self.backbone_cls, self.target_layer_name = self.BACKBONE_MAP[backbone_key]

    def build(self) -> Model:
        inputs = layers.Input(shape=self.input_shape, name="mri_input")

        # Load Pretrained Backbone without top classifier
        base_backbone = self.backbone_cls(
            include_top=False,
            weights="imagenet",
            input_tensor=inputs
        )

        if self.freeze_backbone:
            # Freeze early feature layers, keep top blocks trainable for fine-grained MRI feature extraction
            for layer in base_backbone.layers[:-30]:
                layer.trainable = False
            for layer in base_backbone.layers[-30:]:
                layer.trainable = True
        else:
            base_backbone.trainable = True

        x = base_backbone.output
        x = layers.GlobalAveragePooling2D(name="global_avg_pool")(x)
        x = layers.BatchNormalization(name="batchnorm_head")(x)
        x = layers.Dropout(0.4, name="dropout_head_1")(x)
        x = layers.Dense(256, activation="relu", name="dense_head_1")(x)
        x = layers.Dropout(0.3, name="dropout_head_2")(x)
        outputs = layers.Dense(self.num_classes, activation="softmax", name="predictions")(x)

        model = Model(inputs=inputs, outputs=outputs, name=self.name)
        self.model = model
        return model

    def get_gradcam_target_layer_name(self) -> str:
        return self.target_layer_name
