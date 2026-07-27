import random
import cv2
import numpy as np
from typing import Dict, Any, Optional


def augment_medical_image(
    image: np.ndarray,
    config: Optional[Dict[str, Any]] = None
) -> np.ndarray:
    """
    Applies medical data augmentation safely (Training set ONLY).

    Allowed transformations:
    - Random rotation (+/- 15 degrees)
    - Random zoom (0.9 to 1.1)
    - Random shift (x/y up to 10%)
    - Random brightness (0.8 to 1.2)
    - Random contrast (subtle)
    - Horizontal flip (only if explicitly enabled)

    Disallowed transformations:
    - Vertical flip (distorts anatomical top-bottom orientation)
    - Elastic deformation or extreme rotations

    Args:
        image: Input image array (uint8 or float32).
        config: Augmentation parameter dictionary.

    Returns:
        Augmented image array of same dimensions and dtype.
    """
    cfg = config or {}
    rotation_deg = cfg.get("rotation", 15)
    zoom_range = cfg.get("zoom", 0.1)
    shift_ratio = cfg.get("width_shift", 0.1)
    brightness_range = cfg.get("brightness", 0.2)
    allow_flip = cfg.get("horizontal_flip", False)

    is_float = (image.dtype == np.float32 or image.dtype == np.float64)
    if is_float:
        img_work = np.clip(image * 255.0, 0, 255).astype(np.uint8)
    else:
        img_work = image.copy()

    h, w = img_work.shape[:2]

    # 1. Random Rotation (+/- rotation_deg)
    if rotation_deg > 0:
        angle = random.uniform(-rotation_deg, rotation_deg)
        M_rot = cv2.getRotationMatrix2D((w / 2.0, h / 2.0), angle, 1.0)
        img_work = cv2.warpAffine(img_work, M_rot, (w, h), borderMode=cv2.BORDER_REFLECT_101)

    # 2. Random Zoom (0.9 to 1.1)
    if zoom_range > 0:
        scale = random.uniform(1.0 - zoom_range, 1.0 + zoom_range)
        if scale != 1.0:
            M_zoom = cv2.getRotationMatrix2D((w / 2.0, h / 2.0), 0, scale)
            img_work = cv2.warpAffine(img_work, M_zoom, (w, h), borderMode=cv2.BORDER_REFLECT_101)

    # 3. Random Shift (dx, dy up to 10%)
    if shift_ratio > 0:
        dx = random.uniform(-shift_ratio, shift_ratio) * w
        dy = random.uniform(-shift_ratio, shift_ratio) * h
        M_shift = np.float32([[1, 0, dx], [0, 1, dy]])
        img_work = cv2.warpAffine(img_work, M_shift, (w, h), borderMode=cv2.BORDER_REFLECT_101)

    # 4. Random Brightness & Contrast
    if brightness_range > 0:
        alpha = random.uniform(0.9, 1.1)  # Contrast scaling
        beta = random.uniform(-brightness_range * 255.0, brightness_range * 255.0)  # Brightness shift
        img_work = cv2.convertScaleAbs(img_work, alpha=alpha, beta=beta)

    # 5. Optional Horizontal Flip (Never vertical flip)
    if allow_flip and random.random() > 0.5:
        img_work = cv2.flip(img_work, 1)

    if is_float:
        return img_work.astype(np.float32) / 255.0
    return img_work
