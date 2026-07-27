from typing import Tuple
import tensorflow as tf
from keras import layers, Model
from ml.models.base import BaseAlzheimerModel


class Patches(layers.Layer):
    """Splits images into square patches."""

    def __init__(self, patch_size: int, **kwargs):
        super().__init__(**kwargs)
        self.patch_size = patch_size

    def call(self, images):
        batch_size = tf.shape(images)[0]
        patches = tf.image.extract_patches(
            images=images,
            sizes=[1, self.patch_size, self.patch_size, 1],
            strides=[1, self.patch_size, self.patch_size, 1],
            rates=[1, 1, 1, 1],
            padding="VALID"
        )
        patch_dims = patches.shape[-1]
        patches = tf.reshape(patches, [batch_size, -1, patch_dims])
        return patches


class PatchEncoder(layers.Layer):
    """Linear projection of patches and addition of learnable positional embeddings."""

    def __init__(self, num_patches: int, projection_dim: int, **kwargs):
        super().__init__(**kwargs)
        self.num_patches = num_patches
        self.projection = layers.Dense(units=projection_dim)
        self.position_embedding = layers.Embedding(
            input_dim=num_patches, output_dim=projection_dim
        )

    def call(self, patch):
        positions = tf.range(start=0, limit=self.num_patches, delta=1)
        encoded = self.projection(patch) + self.position_embedding(positions)
        return encoded


class VisionTransformerModel(BaseAlzheimerModel):
    """
    Vision Transformer (ViT) architecture implementation for MRI classification.
    """

    def __init__(
        self,
        input_shape: Tuple[int, int, int] = (224, 224, 3),
        patch_size: int = 16,
        projection_dim: int = 64,
        num_heads: int = 4,
        transformer_layers: int = 4,
        mlp_head_units: list = [128, 64],
        num_classes: int = 4,
        learning_rate: float = 1e-4
    ):
        super().__init__(
            input_shape=input_shape,
            num_classes=num_classes,
            learning_rate=learning_rate,
            name="vision_transformer"
        )
        self.patch_size = patch_size
        self.num_patches = (input_shape[0] // patch_size) ** 2
        self.projection_dim = projection_dim
        self.num_heads = num_heads
        self.transformer_layers = transformer_layers
        self.mlp_head_units = mlp_head_units

    def build(self) -> Model:
        inputs = layers.Input(shape=self.input_shape, name="mri_input")

        # Create patches
        patches = Patches(self.patch_size, name="patches")(inputs)
        # Encode patches
        encoded_patches = PatchEncoder(self.num_patches, self.projection_dim, name="patch_encoder")(patches)

        # Transformer blocks
        x = encoded_patches
        for i in range(self.transformer_layers):
            # Layer normalization 1
            x1 = layers.LayerNormalization(epsilon=1e-6, name=f"ln1_{i}")(x)
            # Multi-head attention
            attention_output = layers.MultiHeadAttention(
                num_heads=self.num_heads, key_dim=self.projection_dim, name=f"mha_{i}"
            )(x1, x1)
            # Skip connection 1
            x2 = layers.Add(name=f"add1_{i}")([attention_output, x])

            # Layer normalization 2
            x3 = layers.LayerNormalization(epsilon=1e-6, name=f"ln2_{i}")(x2)
            # MLP block
            mlp_x = layers.Dense(self.projection_dim * 2, activation=tf.nn.gelu, name=f"mlp1_{i}")(x3)
            mlp_x = layers.Dropout(0.1, name=f"drop1_{i}")(mlp_x)
            mlp_x = layers.Dense(self.projection_dim, activation=tf.nn.gelu, name=f"mlp2_{i}")(mlp_x)
            mlp_x = layers.Dropout(0.1, name=f"drop2_{i}")(mlp_x)

            # Skip connection 2
            x = layers.Add(name=f"add2_{i}")([mlp_x, x2])

        # Representation & Classification Head
        representation = layers.LayerNormalization(epsilon=1e-6, name="target_vit_layer")(x)
        representation = layers.Flatten()(representation)
        representation = layers.Dropout(0.5)(representation)

        for idx, units in enumerate(self.mlp_head_units):
            representation = layers.Dense(units, activation=tf.nn.gelu, name=f"dense_head_{idx}")(representation)
            representation = layers.Dropout(0.3)(representation)

        outputs = layers.Dense(self.num_classes, activation="softmax", name="predictions")(representation)

        model = Model(inputs=inputs, outputs=outputs, name=self.name)
        self.model = model
        return model

    def get_gradcam_target_layer_name(self) -> str:
        return "target_vit_layer"
