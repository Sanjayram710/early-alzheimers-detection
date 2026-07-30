import cv2
import numpy as np
from backend.preprocessing.schemas import DIPConfig


def apply_denoise(img: np.ndarray, config: DIPConfig) -> np.ndarray:
    """
    Applies noise reduction filtering while preserving diagnostic tissue boundaries.
    
    Supported Methods:
    - "gaussian": Gaussian smoothing using configurable kernel size and sigma.
    - "median": Median spatial filtering effective against impulse & speckle noise.
    """
    if not config.enable_denoise:
        return img

    method = config.denoise_method.lower()

    if method == "median":
        ksize = config.median_kernel_size
        # Kernel size must be an odd integer > 1
        if ksize % 2 == 0:
            ksize += 1
        return cv2.medianBlur(img, ksize)

    # Default: Gaussian Filtering
    k_h, k_w = config.gaussian_kernel_size
    if k_h % 2 == 0:
        k_h += 1
    if k_w % 2 == 0:
        k_w += 1
    
    return cv2.GaussianBlur(img, (k_h, k_w), config.gaussian_sigma)
