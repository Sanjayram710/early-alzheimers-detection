import tensorflow as tf
from keras import layers, Sequential


def get_data_augmentation_pipeline(
    image_shape: tuple = (224, 224, 3),
    rotation_factor: float = 0.1,
    translation_factor: float = 0.05,
    zoom_factor: float = 0.1,
    brightness_factor: float = 0.1,
    contrast_factor: float = 0.1,
    allow_horizontal_flip: bool = False
) -> Sequential:
    """
    Constructs a Keras Sequential layer for data augmentation during training.
    
    Args:
        image_shape: Input image dimensions (H, W, C).
        rotation_factor: Range for random rotation in fraction of 2*pi.
        translation_factor: Range for random vertical/horizontal translation.
        zoom_factor: Range for random zoom.
        brightness_factor: Range for random brightness change.
        contrast_factor: Range for random contrast change.
        allow_horizontal_flip: If True, applies random horizontal flip (False by default for medical MRI consistency).

    Returns:
        Keras Sequential model containing augmentation layers.
    """
    augmentation_layers = [
        layers.InputLayer(input_shape=image_shape),
        layers.RandomRotation(factor=rotation_factor, fill_mode="nearest"),
        layers.RandomTranslation(
            height_factor=translation_factor,
            width_factor=translation_factor,
            fill_mode="nearest"
        ),
        layers.RandomZoom(height_factor=zoom_factor, width_factor=zoom_factor, fill_mode="nearest"),
        layers.RandomBrightness(factor=brightness_factor, value_range=(0.0, 1.0)),
        layers.RandomContrast(factor=contrast_factor)
    ]

    if allow_horizontal_flip:
        augmentation_layers.append(layers.RandomFlip("horizontal"))

    return Sequential(augmentation_layers, name="mri_data_augmentation")
