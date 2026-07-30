import cv2
import numpy as np
from backend.preprocessing.schemas import DIPConfig


def apply_clahe(gray_img: np.ndarray, config: DIPConfig) -> np.ndarray:
    """
    Applies Contrast Limited Adaptive Histogram Equalization (CLAHE).
    Enhances local contrast across tissue regions without amplifying noise.
    
    Args:
        gray_img: 2D uint8 NumPy grayscale image array.
        config: DIPConfig containing clahe_clip_limit and clahe_tile_grid_size.
        
    Returns:
        Contrast-enhanced 2D uint8 grayscale image.
    """
    if not config.enable_clahe:
        return gray_img

    # Ensure uint8 image format for CLAHE
    if gray_img.dtype != np.uint8:
        if gray_img.max() <= 1.0:
            gray_img = (gray_img * 255.0).astype(np.uint8)
        else:
            gray_img = np.clip(gray_img, 0, 255).astype(np.uint8)

    clahe = cv2.createCLAHE(
        clipLimit=config.clahe_clip_limit,
        tileGridSize=config.clahe_tile_grid_size
    )
    return clahe.apply(gray_img)
