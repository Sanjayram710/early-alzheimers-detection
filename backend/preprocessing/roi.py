from typing import Tuple, Optional, List
import cv2
import numpy as np
from backend.preprocessing.schemas import DIPConfig


def detect_and_crop_roi(
    gray_img: np.ndarray,
    config: DIPConfig
) -> Tuple[np.ndarray, bool, Optional[List[int]]]:
    """
    Automatically detects brain tissue Region of Interest (ROI) and crops empty outer background borders.
    
    Uses thresholding, morphological closing, and largest contour bounding box extraction.
    Includes safe fallback: if ROI area < roi_min_area_ratio or contour detection fails, returns uncropped original image.
    
    Returns:
        Tuple[cropped_image, roi_detected_bool, bounding_box_list [x, y, w, h]]
    """
    if not config.enable_roi_detection:
        return gray_img, False, None

    h, w = gray_img.shape[:2]
    total_area = h * w

    try:
        # Otsu thresholding to separate brain tissue from dark background
        _, thresh = cv2.threshold(gray_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # Morphological closing to fill internal tissue gaps
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)

        # Find external contours
        contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return gray_img, False, None

        # Select largest contour by area
        largest_contour = max(contours, key=cv2.contourArea)
        contour_area = cv2.contourArea(largest_contour)

        # Safe Fallback: if detected area is too small (< 20% of image), return original
        if (contour_area / float(total_area)) < config.roi_min_area_ratio:
            return gray_img, False, None

        # Extract Bounding Box with Padding
        x, y, bw, bh = cv2.boundingRect(largest_contour)
        pad = config.roi_padding_px
        x_start = max(0, x - pad)
        y_start = max(0, y - pad)
        x_end = min(w, x + bw + pad)
        y_end = min(h, y + bh + pad)

        cropped_img = gray_img[y_start:y_end, x_start:x_end]

        # Verify valid cropped dimensions
        if cropped_img.size == 0 or cropped_img.shape[0] < 10 or cropped_img.shape[1] < 10:
            return gray_img, False, None

        return cropped_img, True, [int(x_start), int(y_start), int(x_end - x_start), int(y_end - y_start)]

    except Exception:
        # Graceful fallback on unexpected error
        return gray_img, False, None
