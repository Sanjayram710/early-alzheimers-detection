import cv2
import numpy as np
from typing import Tuple


def resize_letterbox(
    image: np.ndarray,
    target_size: Tuple[int, int] = (224, 224),
    pad_color: int = 0
) -> np.ndarray:
    """
    Resizes image to target dimensions while maintaining aspect ratio via letterbox padding.

    Args:
        image: NumPy array representing input image (H, W) or (H, W, C).
        target_size: Desired (height, width) dimensions, default (224, 224).
        pad_color: Pixel fill value for border padding (default 0 for black).

    Returns:
        Letterboxed image array of exact shape (target_size[0], target_size[1]) or (target_size[0], target_size[1], C).
    """
    target_h, target_w = target_size
    h, w = image.shape[:2]

    if h == 0 or w == 0:
        raise ValueError("Invalid image dimensions (zero height or width).")

    # Compute scale factor preserving aspect ratio
    scale = min(target_w / float(w), target_h / float(h))
    new_w = max(1, int(round(w * scale)))
    new_h = max(1, int(round(h * scale)))

    # High-quality interpolation selection
    interpolation = cv2.INTER_AREA if scale < 1.0 else cv2.INTER_CUBIC
    resized = cv2.resize(image, (new_w, new_h), interpolation=interpolation)

    # Compute symmetric black padding offsets
    pad_w = target_w - new_w
    pad_h = target_h - new_h

    top = pad_h // 2
    bottom = pad_h - top
    left = pad_w // 2
    right = pad_w - left

    # Apply padding
    if len(image.shape) == 3:
        padded = cv2.copyMakeBorder(
            resized, top, bottom, left, right, cv2.BORDER_CONSTANT, value=[pad_color] * image.shape[2]
        )
    else:
        padded = cv2.copyMakeBorder(
            resized, top, bottom, left, right, cv2.BORDER_CONSTANT, value=pad_color
        )

    return padded
