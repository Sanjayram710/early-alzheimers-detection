import cv2
import numpy as np
from typing import Tuple


def apply_clahe(
    image: np.ndarray,
    clip_limit: float = 2.0,
    tile_grid_size: Tuple[int, int] = (8, 8)
) -> np.ndarray:
    """
    Applies Contrast Limited Adaptive Histogram Equalization (CLAHE) to improve tissue contrast.

    Args:
        image: Grayscale or BGR image array (uint8 or float32).
        clip_limit: Threshold for contrast limiting (default 2.0).
        tile_grid_size: Grid size for contextual histogram equalization (default (8, 8)).

    Returns:
        CLAHE enhanced image array matching original input dtype.
    """
    is_float = (image.dtype == np.float32 or image.dtype == np.float64)
    if is_float:
        uint8_img = np.clip(image * 255.0, 0, 255).astype(np.uint8)
    else:
        uint8_img = image.copy()

    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)

    if len(uint8_img.shape) == 2:
        enhanced = clahe.apply(uint8_img)
    elif len(uint8_img.shape) == 3 and uint8_img.shape[2] == 1:
        enhanced = clahe.apply(np.squeeze(uint8_img, axis=-1))
        enhanced = np.expand_dims(enhanced, axis=-1)
    elif len(uint8_img.shape) == 3 and uint8_img.shape[2] == 3:
        # Convert to LAB color space and apply CLAHE to L channel
        lab = cv2.cvtColor(uint8_img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        l_enhanced = clahe.apply(l)
        lab_enhanced = cv2.merge((l_enhanced, a, b))
        enhanced = cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)
    else:
        enhanced = uint8_img

    if is_float:
        return enhanced.astype(np.float32) / 255.0
    return enhanced
