import time
import base64
import logging
from typing import Tuple, Dict, Any, Union, Optional
from pathlib import Path
import cv2
import numpy as np

from ml.datasets.dicom_nifti import read_image_as_rgb
from backend.preprocessing.schemas import DIPConfig, PreprocessingMetadata, StepResult
from backend.preprocessing.quality import assess_image_quality
from backend.preprocessing.denoise import apply_denoise
from backend.preprocessing.clahe import apply_clahe
from backend.preprocessing.normalize import normalize_intensity
from backend.preprocessing.roi import detect_and_crop_roi
from backend.preprocessing.skull_strip import apply_skull_stripping

logger = logging.getLogger(__name__)


class DIPPipeline:
    """
    Central Orchestrator for the Digital Image Processing (DIP) MRI Preprocessing Pipeline.
    
    Executes modular preprocessing steps prior to CNN inference:
    1. Validation
    2. Image Quality Assessment
    3. Noise Reduction (Gaussian / Median)
    4. Contrast Enhancement (CLAHE)
    5. Skull Stripping (Optional)
    6. ROI Brain Region Detection & Cropping
    7. Intensity Normalization & Resizing for NeuroDxNet
    """

    def __init__(self, config: Optional[DIPConfig] = None):
        self.config = config or DIPConfig()

    def process(
        self,
        image_input: Union[str, Path, bytes, np.ndarray]
    ) -> Tuple[np.ndarray, str, PreprocessingMetadata]:
        """
        Executes end-to-end DIP pipeline on input MRI.
        
        Returns:
            Tuple containing:
            1. processed_rgb: float32 NumPy array shape (224, 224, 3) with values in [0.0, 1.0] for CNN model input
            2. processed_b64: Base64 data URL string for UI comparison preview
            3. metadata: PreprocessingMetadata containing quality metrics, step flags, and timings
        """
        total_start = time.time()
        per_step_timing: Dict[str, float] = {}
        skipped_steps: list = []
        failed_steps: list = []
        warnings: list = []

        # Step 0: Validation & Image Loading
        t0 = time.time()
        try:
            if isinstance(image_input, np.ndarray):
                raw_rgb = image_input.copy()
            else:
                raw_rgb = read_image_as_rgb(image_input, target_size=None)
        except Exception as e:
            logger.error(f"DIP Pipeline validation error: {e}")
            raise ValueError(f"Invalid MRI image file or readable image format error: {str(e)}")

        if raw_rgb is None or raw_rgb.size == 0:
            raise ValueError("MRI image file is empty or corrupted.")

        h, w = raw_rgb.shape[:2]
        if h < self.config.min_resolution[0] or w < self.config.min_resolution[1]:
            raise ValueError(f"MRI image resolution ({w}x{h}) below required minimum ({self.config.min_resolution[1]}x{self.config.min_resolution[0]}).")

        per_step_timing["validation"] = round((time.time() - t0) * 1000.0, 2)

        # Convert working image to uint8 grayscale for DIP operations
        if raw_rgb.ndim == 3 and raw_rgb.shape[-1] >= 3:
            working_gray = cv2.cvtColor(raw_rgb, cv2.COLOR_RGB2GRAY)
        elif raw_rgb.ndim == 3 and raw_rgb.shape[-1] == 1:
            working_gray = raw_rgb[:, :, 0]
        else:
            working_gray = raw_rgb.copy()

        if working_gray.dtype != np.uint8:
            if working_gray.max() <= 1.0:
                working_gray = (working_gray * 255.0).astype(np.uint8)
            else:
                working_gray = np.clip(working_gray, 0, 255).astype(np.uint8)

        # Step 1: Quality Assessment
        t0 = time.time()
        try:
            quality_metrics = assess_image_quality(working_gray)
            per_step_timing["quality_assessment"] = round((time.time() - t0) * 1000.0, 2)
        except Exception as e:
            logger.warning(f"Quality assessment failed: {e}")
            failed_steps.append("quality_assessment")
            warnings.append(f"Quality assessment warning: {str(e)}")
            quality_metrics = None
            per_step_timing["quality_assessment"] = 0.0

        # Step 2: Denoise
        t0 = time.time()
        denoise_applied = False
        if self.config.enable_denoise:
            try:
                working_gray = apply_denoise(working_gray, self.config)
                denoise_applied = True
            except Exception as e:
                logger.warning(f"Denoising failed: {e}")
                failed_steps.append("denoise")
                warnings.append(f"Denoising warning: {str(e)}")
            per_step_timing["denoise"] = round((time.time() - t0) * 1000.0, 2)
        else:
            skipped_steps.append("denoise")
            per_step_timing["denoise"] = 0.0

        # Step 3: Contrast Enhancement (CLAHE)
        t0 = time.time()
        clahe_applied = False
        if self.config.enable_clahe:
            try:
                working_gray = apply_clahe(working_gray, self.config)
                clahe_applied = True
            except Exception as e:
                logger.warning(f"CLAHE failed: {e}")
                failed_steps.append("clahe")
                warnings.append(f"CLAHE warning: {str(e)}")
            per_step_timing["clahe"] = round((time.time() - t0) * 1000.0, 2)
        else:
            skipped_steps.append("clahe")
            per_step_timing["clahe"] = 0.0

        # Step 4: Skull Stripping (Optional)
        t0 = time.time()
        skull_stripped = False
        if self.config.enable_skull_strip:
            try:
                working_gray, skull_stripped = apply_skull_stripping(working_gray, self.config)
            except Exception as e:
                logger.warning(f"Skull stripping failed: {e}")
                failed_steps.append("skull_stripping")
                warnings.append(f"Skull stripping warning: {str(e)}")
            per_step_timing["skull_stripping"] = round((time.time() - t0) * 1000.0, 2)
        else:
            skipped_steps.append("skull_stripping")
            per_step_timing["skull_stripping"] = 0.0

        # Step 5: ROI Detection & Cropping
        t0 = time.time()
        roi_detected = False
        roi_bounds = None
        if self.config.enable_roi_detection:
            try:
                working_gray, roi_detected, roi_bounds = detect_and_crop_roi(working_gray, self.config)
            except Exception as e:
                logger.warning(f"ROI detection failed: {e}")
                failed_steps.append("roi_detection")
                warnings.append(f"ROI detection warning: {str(e)}")
            per_step_timing["roi_detection"] = round((time.time() - t0) * 1000.0, 2)
        else:
            skipped_steps.append("roi_detection")
            per_step_timing["roi_detection"] = 0.0

        # Step 6: Intensity Normalization & Resize for NeuroDxNet (224, 224, 3)
        t0 = time.time()
        norm_applied = False
        try:
            processed_rgb = normalize_intensity(
                working_gray,
                self.config,
                target_size=self.config.target_resolution
            )
            norm_applied = True
        except Exception as e:
            logger.error(f"Normalization failed: {e}")
            raise ValueError(f"Failed to normalize and format tensor for CNN inference: {str(e)}")
        per_step_timing["normalization"] = round((time.time() - t0) * 1000.0, 2)

        # Generate Processed Preview Base64 String for UI Rendering
        _, buffer = cv2.imencode(".png", cv2.cvtColor((processed_rgb * 255.0).astype(np.uint8), cv2.COLOR_RGB2BGR))
        processed_b64 = f"data:image/png;base64,{base64.b64encode(buffer).decode('utf-8')}"

        total_duration = round((time.time() - total_start) * 1000.0, 2)

        # Construct Structured Metadata Object
        metadata = PreprocessingMetadata(
            quality_score=quality_metrics.quality_score if quality_metrics else 75.0,
            rating=quality_metrics.rating if quality_metrics else "Good",
            brightness=quality_metrics.brightness if quality_metrics else 120.0,
            contrast=quality_metrics.contrast if quality_metrics else 45.0,
            sharpness=quality_metrics.sharpness if quality_metrics else 250.0,
            estimated_noise=quality_metrics.estimated_noise if quality_metrics else 10.0,
            validation_status="passed",
            denoise_applied=denoise_applied,
            denoise_method=self.config.denoise_method if denoise_applied else "none",
            clahe_applied=clahe_applied,
            normalization_applied=norm_applied,
            roi_detected=roi_detected,
            roi_bounds=roi_bounds,
            skull_stripping_applied=skull_stripped,
            total_processing_time_ms=total_duration,
            per_step_timing=per_step_timing,
            skipped_steps=skipped_steps,
            failed_steps=failed_steps,
            warnings=warnings,
        )

        return processed_rgb, processed_b64, metadata


# Global singleton instance
dip_pipeline = DIPPipeline()
