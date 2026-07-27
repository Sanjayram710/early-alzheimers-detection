import cv2
import numpy as np
from typing import Tuple, Optional


def apply_gaussian_blur(
    image: np.ndarray,
    kernel_size: Tuple[int, int] = (3, 3),
    sigma: float = 0.0
) -> np.ndarray:
    """Applies Gaussian Blur smoothing to reduce scanner noise."""
    return cv2.GaussianBlur(image, kernel_size, sigmaX=sigma)


def apply_median_filter(
    image: np.ndarray,
    kernel_size: int = 3
) -> np.ndarray:
    """Applies Median Filter smoothing to remove salt-and-pepper noise."""
    return cv2.medianBlur(image, kernel_size)


def denoise_image(
    image: np.ndarray,
    use_gaussian: bool = True,
    gaussian_kernel: Tuple[int, int] = (3, 3),
    gaussian_sigma: float = 0.0,
    use_median: bool = False,
    median_kernel: int = 3
) -> np.ndarray:
    """
    Modular noise reduction wrapper applying configured noise filters.

    Args:
        image: Grayscale or BGR image array.
        use_gaussian: If True, applies Gaussian blur filter.
        gaussian_kernel: Gaussian kernel size tuple (default (3, 3)).
        gaussian_sigma: Gaussian sigma (default 0.0).
        use_median: If True, applies Median filter.
        median_kernel: Median filter kernel size (default 3).

    Returns:
        Denoised image array.
    """
    out = image.copy()
    if use_gaussian:
        out = apply_gaussian_blur(out, kernel_size=gaussian_kernel, sigma=gaussian_sigma)
    if use_median:
        out = apply_median_filter(out, kernel_size=median_kernel)
    return out
