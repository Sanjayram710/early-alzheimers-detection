import pytest
import numpy as np
from backend.preprocessing.schemas import DIPConfig, PreprocessingMetadata
from backend.preprocessing.pipeline import DIPPipeline
from backend.preprocessing.quality import assess_image_quality
from backend.preprocessing.denoise import apply_denoise
from backend.preprocessing.clahe import apply_clahe
from backend.preprocessing.roi import detect_and_crop_roi
from backend.preprocessing.normalize import normalize_intensity


def create_synthetic_mri(width=256, height=256):
    """Generates synthetic brain slice image array for testing."""
    img = np.zeros((height, width), dtype=np.uint8)
    cv2_center = (width // 2, height // 2)
    # Draw brain ellipse
    import cv2
    cv2.ellipse(img, cv2_center, (width // 3, height // 3), 0, 0, 360, 180, -1)
    # Add noise
    noise = np.random.normal(0, 10, (height, width)).astype(np.uint8)
    return cv2.add(img, noise)


def test_assess_image_quality():
    img = create_synthetic_mri(256, 256)
    metrics = assess_image_quality(img)
    
    assert metrics.resolution == (256, 256)
    assert 0 <= metrics.quality_score <= 100
    assert metrics.rating in ["Excellent", "Good", "Fair", "Poor"]
    assert metrics.brightness >= 0
    assert metrics.contrast >= 0


def test_dip_pipeline_process():
    img = create_synthetic_mri(256, 256)
    pipeline = DIPPipeline()
    
    processed_rgb, processed_b64, metadata = pipeline.process(img)
    
    assert isinstance(processed_rgb, np.ndarray)
    assert processed_rgb.shape == (224, 224, 3)
    assert processed_rgb.dtype == np.float32
    assert 0.0 <= processed_rgb.min() <= processed_rgb.max() <= 1.0
    
    assert processed_b64.startswith("data:image/png;base64,")
    assert isinstance(metadata, PreprocessingMetadata)
    assert metadata.validation_status == "passed"
    assert metadata.denoise_applied is True
    assert metadata.clahe_applied is True
    assert metadata.normalization_applied is True
    assert metadata.total_processing_time_ms > 0


def test_invalid_image_raises_validation_error():
    pipeline = DIPPipeline()
    with pytest.raises(ValueError):
        pipeline.process(np.array([]))
