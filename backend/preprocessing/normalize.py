from typing import Tuple
import cv2
import numpy as np
from backend.preprocessing.schemas import DIPConfig


def normalize_intensity(
    img: np.ndarray,
    config: DIPConfig,
    target_size: Tuple[int, int] = (224, 224)
) -> np.ndarray:
    """
    Normalizes pixel intensity values and standardizes tensor dimensions to (target_h, target_w, 3).
    
    Processing Steps:
    1. Scale intensities (Min-Max [0, 1] or Z-score)
    2. Broadcast to 3 RGB channels expected by CNN architecture
    3. Bilinear resize to target dimensions (default 224x224)
    
    Returns:
        float32 NumPy array with shape (target_size[0], target_size[1], 3) and values in [0.0, 1.0].
    """
    img_float = img.astype(np.float32)

    # 1. Intensity Normalization
    if config.enable_normalization:
        if config.normalization_type == "z_score":
            std = np.std(img_float)
            if std > 1e-6:
                img_float = (img_float - np.mean(img_float)) / std
                # Rescale Z-scores to [0, 1] for CNN input compatibility
                min_val, max_val = img_float.min(), img_float.max()
                if max_val > min_val:
                    img_float = (img_float - min_val) / (max_val - min_val)
        else:
            # Default Min-Max Normalization to [0, 1]
            max_val = img_float.max()
            if max_val > 1.0:
                img_float /= 255.0

    # 2. Ensure 3 RGB Channels
    if img_float.ndim == 2:
        img_rgb = cv2.cvtColor((img_float * 255.0).astype(np.uint8), cv2.COLOR_GRAY2RGB).astype(np.float32) / 255.0
    elif img_float.ndim == 3 and img_float.shape[-1] == 1:
        img_rgb = np.repeat(img_float, 3, axis=-1)
    elif img_float.ndim == 3 and img_float.shape[-1] >= 3:
        img_rgb = img_float[:, :, :3]
    else:
        img_rgb = img_float

    # 3. Resize to Target Resolution
    if (img_rgb.shape[0], img_rgb.shape[1]) != target_size:
        img_rgb = cv2.resize(img_rgb, (target_size[1], target_size[0]), interpolation=cv2.INTER_LINEAR)

    return np.clip(img_rgb, 0.0, 1.0)
