import cv2
import numpy as np


def ensure_grayscale(image: np.ndarray) -> np.ndarray:
    """
    Converts multi-channel RGB/BGR image to single grayscale channel (H, W).

    Args:
        image: Input NumPy image array.

    Returns:
        Grayscale 2D array (H, W).
    """
    if len(image.shape) == 3 and image.shape[2] in (3, 4):
        if image.shape[2] == 3:
            return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            return cv2.cvtColor(image, cv2.COLOR_BGRA2GRAY)
    elif len(image.shape) == 3 and image.shape[2] == 1:
        return np.squeeze(image, axis=-1)
    return image


def format_channels(image: np.ndarray, target_channels: int = 1) -> np.ndarray:
    """
    Ensures image array matches target channel count (1 or 3).
    For 3 channels, replicates grayscale across RGB channels without adding artificial color.

    Args:
        image: Grayscale or BGR image array.
        target_channels: 1 for single channel (H, W, 1), 3 for replicated RGB (H, W, 3).

    Returns:
        Image array formatted with specified target channel count.
    """
    gray = ensure_grayscale(image)

    if target_channels == 1:
        return np.expand_dims(gray, axis=-1) if len(gray.shape) == 2 else gray
    elif target_channels == 3:
        return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
    else:
        raise ValueError(f"Unsupported target_channels: {target_channels}. Must be 1 or 3.")
