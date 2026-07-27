import cv2
import numpy as np
from typing import Tuple
from ml.preprocessing.resize import resize_letterbox


def crop_brain_region(
    image: np.ndarray,
    target_size: Tuple[int, int] = (224, 224),
    threshold: int = 10
) -> np.ndarray:
    """
    Extracts largest likely brain contour, crops bounding box around brain ROI,
    preserves aspect ratio, and resizes back to target_size.

    Fallback: If contour detection fails, returns original resized image without crashing.

    Args:
        image: Input image array (grayscale or BGR).
        target_size: Output dimensions (default (224, 224)).
        threshold: Binarization threshold intensity (default 10).

    Returns:
        Brain ROI cropped and letterboxed image matching target_size.
    """
    try:
        # Convert to uint8 grayscale for contour detection
        if image.dtype != np.uint8:
            gray = np.clip(image * 255.0, 0, 255).astype(np.uint8)
        else:
            gray = image.copy()

        if len(gray.shape) == 3:
            gray = cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY)

        # Thresholding to separate brain tissue from dark background
        _, thresh = cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        if not contours:
            return resize_letterbox(image, target_size=target_size)

        # Locate largest contour area
        largest_contour = max(contours, key=cv2.contourArea)
        if cv2.contourArea(largest_contour) < 100:  # Noise check
            return resize_letterbox(image, target_size=target_size)

        x, y, w, h = cv2.boundingRect(largest_contour)

        # Add 2% padding margin around bounding box
        margin_x = int(w * 0.02)
        margin_y = int(h * 0.02)

        img_h, img_w = image.shape[:2]
        x1 = max(0, x - margin_x)
        y1 = max(0, y - margin_y)
        x2 = min(img_w, x + w + margin_x)
        y2 = min(img_h, y + h + margin_y)

        cropped = image[y1:y2, x1:x2]

        if cropped.size == 0 or cropped.shape[0] < 10 or cropped.shape[1] < 10:
            return resize_letterbox(image, target_size=target_size)

        return resize_letterbox(cropped, target_size=target_size)
    except Exception:
        # Fallback to standard resize without crashing
        return resize_letterbox(image, target_size=target_size)
