import cv2
import numpy as np
from backend.preprocessing.schemas import QualityMetrics


def assess_image_quality(gray_img: np.ndarray) -> QualityMetrics:
    """
    Computes objective image quality metrics on a 2D grayscale MRI slice.
    
    Metrics:
    1. Resolution: (height, width)
    2. Brightness: Mean intensity [0.0 - 255.0]
    3. Contrast: Root Mean Square (RMS) contrast / intensity standard deviation
    4. Sharpness: Laplacian variance (higher values = sharper image, lower = blurry)
    5. Estimated Noise Level: Median Absolute Deviation (MAD) of high-pass filtered image
    6. Overall Quality Score: Normalized 0–100 rating based on clinical clarity criteria
    """
    height, width = gray_img.shape[:2]
    img_float = gray_img.astype(np.float32)

    # 1. Brightness
    brightness = float(np.mean(img_float))

    # 2. RMS Contrast
    contrast = float(np.std(img_float))

    # 3. Sharpness (Laplacian Variance)
    laplacian = cv2.Laplacian(gray_img, cv2.CV_64F)
    sharpness = float(laplacian.var())

    # 4. Estimated Noise Level (MAD Noise Estimator)
    med = np.median(img_float)
    mad = np.median(np.abs(img_float - med))
    noise_level = float(mad * 1.4826)  # Scaled for normal distribution

    # 5. Quality Score Calculation (Weighted composite metric [0.0 - 100.0])
    # - Resolution score: min(1.0, (h*w)/(224*224)) * 25
    # - Sharpness score: min(1.0, sharpness / 300.0) * 35
    # - Contrast score: min(1.0, contrast / 50.0) * 25
    # - Noise penalty: max(0.0, 1.0 - (noise_level / 40.0)) * 15
    res_score = min(1.0, (height * width) / (224.0 * 224.0)) * 25.0
    sharp_score = min(1.0, sharpness / 300.0) * 35.0
    contrast_score = min(1.0, contrast / 55.0) * 25.0
    noise_score = max(0.0, 1.0 - (noise_level / 45.0)) * 15.0

    raw_score = res_score + sharp_score + contrast_score + noise_score
    quality_score = round(float(np.clip(raw_score, 0.0, 100.0)), 1)

    # Determine qualitative rating
    if quality_score >= 85.0:
        rating = "Excellent"
    elif quality_score >= 70.0:
        rating = "Good"
    elif quality_score >= 50.0:
        rating = "Fair"
    else:
        rating = "Poor"

    return QualityMetrics(
        resolution=(height, width),
        brightness=round(brightness, 2),
        contrast=round(contrast, 2),
        sharpness=round(sharpness, 2),
        estimated_noise=round(noise_level, 2),
        quality_score=quality_score,
        rating=rating,
    )
