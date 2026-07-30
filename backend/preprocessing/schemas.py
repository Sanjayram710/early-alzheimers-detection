from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
from pydantic import BaseModel


@dataclass
class DIPConfig:
    """Central configuration parameters for the Digital Image Processing (DIP) pipeline."""
    # Quality Assessment
    min_resolution: Tuple[int, int] = (64, 64)
    target_resolution: Tuple[int, int] = (224, 224)

    # Noise Reduction
    enable_denoise: bool = True
    denoise_method: str = "gaussian"  # "gaussian" or "median"
    gaussian_kernel_size: Tuple[int, int] = (3, 3)
    gaussian_sigma: float = 0.8
    median_kernel_size: int = 3

    # Contrast Enhancement (CLAHE)
    enable_clahe: bool = True
    clahe_clip_limit: float = 2.0
    clahe_tile_grid_size: Tuple[int, int] = (8, 8)

    # Intensity Normalization
    enable_normalization: bool = True
    normalization_type: str = "min_max"  # "min_max" or "z_score"

    # ROI Detection
    enable_roi_detection: bool = True
    roi_padding_px: int = 5
    roi_min_area_ratio: float = 0.20  # Minimum 20% area threshold for ROI fallback

    # Skull Stripping (Optional / Experimental)
    enable_skull_strip: bool = False
    skull_strip_method: str = "otsu_mask"


@dataclass
class QualityMetrics:
    """Structured metrics produced during Image Quality Assessment."""
    resolution: Tuple[int, int]
    brightness: float          # Mean pixel value [0 - 255]
    contrast: float            # RMS Contrast (Standard deviation of pixel values)
    sharpness: float           # Variance of Laplacian
    estimated_noise: float     # Median Absolute Deviation (MAD) noise score
    quality_score: float       # Overall calculated score [0 - 100]
    rating: str                # "Excellent", "Good", "Fair", or "Poor"


@dataclass
class StepResult:
    """Status tracking for each individual DIP pipeline stage."""
    step_name: str
    applied: bool
    status: str                # "success", "skipped", "failed"
    duration_ms: float
    message: Optional[str] = None
    params: Dict[str, Any] = field(default_factory=dict)


class PreprocessingMetadata(BaseModel):
    """Structured preprocessing result metadata returned to API responses, DB, and UI."""
    quality_score: float
    rating: str
    brightness: float
    contrast: float
    sharpness: float
    estimated_noise: float
    
    validation_status: str
    denoise_applied: bool
    denoise_method: str
    clahe_applied: bool
    normalization_applied: bool
    roi_detected: bool
    roi_bounds: Optional[List[int]] = None  # [x, y, w, h]
    skull_stripping_applied: bool
    
    total_processing_time_ms: float
    per_step_timing: Dict[str, float]
    skipped_steps: List[str]
    failed_steps: List[str]
    warnings: List[str]
