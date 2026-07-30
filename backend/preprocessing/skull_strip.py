from typing import Tuple
import cv2
import numpy as np
from backend.preprocessing.schemas import DIPConfig


def apply_skull_stripping(
    gray_img: np.ndarray,
    config: DIPConfig
) -> Tuple[np.ndarray, bool]:
    """
    Applies Otsu thresholding mask extraction for skull stripping (separating scalp/skull from brain tissue).
    
    Optional stage controlled by config.enable_skull_strip. If disabled or fails, returns original image cleanly.
    
    Returns:
        Tuple[stripped_image, skull_stripping_applied_bool]
    """
    if not config.enable_skull_strip:
        return gray_img, False

    try:
        # Otsu thresholding
        _, thresh = cv2.threshold(gray_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # Morphological erosion followed by dilation (Opening) to remove scalp border bridges
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        mask = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2)
        mask = cv2.dilate(mask, kernel, iterations=2)

        # Apply binary brain tissue mask
        stripped = cv2.bitwise_and(gray_img, gray_img, mask=mask)
        return stripped, True

    except Exception:
        # Safe bypass on error
        return gray_img, False
