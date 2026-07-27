import numpy as np


def normalize_intensity(image: np.ndarray) -> np.ndarray:
    """
    Normalizes image pixel intensity values to float32 range [0.0, 1.0].

    Args:
        image: NumPy image array (uint8 or float).

    Returns:
        Normalized float32 image array scaled to [0.0, 1.0].
    """
    if image.dtype != np.float32:
        img_float = image.astype(np.float32)
    else:
        img_float = image.copy()

    # Scale to [0.0, 1.0] if range is [0, 255]
    if img_float.max() > 1.0:
        img_float = img_float / 255.0

    return np.clip(img_float, 0.0, 1.0)


def denormalize_to_uint8(image: np.ndarray) -> np.ndarray:
    """Converts normalized float32 [0.0, 1.0] image back to uint8 [0, 255]."""
    if image.dtype == np.uint8:
        return image
    scaled = np.clip(image * 255.0, 0.0, 255.0)
    return scaled.astype(np.uint8)
