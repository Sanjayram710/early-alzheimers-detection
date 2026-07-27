import os
import json
import pytest
import numpy as np
from pathlib import Path

from ml.preprocessing.image_loader import MRIImageLoader
from ml.preprocessing.resize import resize_letterbox
from ml.preprocessing.grayscale import ensure_grayscale, format_channels
from ml.preprocessing.denoise import denoise_image, apply_gaussian_blur, apply_median_filter
from ml.preprocessing.normalize import normalize_intensity, denormalize_to_uint8
from ml.preprocessing.contrast import apply_clahe
from ml.preprocessing.brain_crop import crop_brain_region
from ml.preprocessing.augmentation import augment_medical_image
from ml.preprocessing.split_dataset import StratifiedDatasetSplitter, DEFAULT_LABEL_MAPPING
from ml.preprocessing.preprocess_pipeline import MRIPreprocessingPipeline, load_yaml_config


@pytest.fixture
def sample_image():
    """Generates a synthetic uint8 grayscale image array."""
    return np.random.randint(0, 256, (180, 240), dtype=np.uint8)


@pytest.fixture
def sample_bgr_image():
    """Generates a synthetic uint8 3-channel BGR image array."""
    return np.random.randint(0, 256, (180, 240, 3), dtype=np.uint8)


def test_resize_letterbox(sample_image):
    resized = resize_letterbox(sample_image, target_size=(224, 224))
    assert resized.shape == (224, 224)
    assert resized.dtype == np.uint8

    resized_bgr = resize_letterbox(np.zeros((100, 300, 3), dtype=np.uint8), target_size=(224, 224))
    assert resized_bgr.shape == (224, 224, 3)


def test_grayscale_conversion(sample_bgr_image, sample_image):
    gray = ensure_grayscale(sample_bgr_image)
    assert len(gray.shape) == 2
    assert gray.shape == (180, 240)

    ch1 = format_channels(sample_image, target_channels=1)
    assert ch1.shape == (180, 240, 1)

    ch3 = format_channels(sample_image, target_channels=3)
    assert ch3.shape == (180, 240, 3)


def test_denoise_filters(sample_image):
    blurred = apply_gaussian_blur(sample_image, kernel_size=(3, 3), sigma=0.0)
    assert blurred.shape == sample_image.shape

    median = apply_median_filter(sample_image, kernel_size=3)
    assert median.shape == sample_image.shape

    denoised = denoise_image(sample_image, use_gaussian=True, use_median=True)
    assert denoised.shape == sample_image.shape


def test_normalize_intensity(sample_image):
    norm = normalize_intensity(sample_image)
    assert norm.dtype == np.float32
    assert norm.max() <= 1.0
    assert norm.min() >= 0.0

    denorm = denormalize_to_uint8(norm)
    assert denorm.dtype == np.uint8
    assert denorm.max() <= 255


def test_apply_clahe(sample_image):
    clahe_out = apply_clahe(sample_image, clip_limit=2.0, tile_grid_size=(8, 8))
    assert clahe_out.shape == sample_image.shape
    assert clahe_out.dtype == np.uint8

    float_img = sample_image.astype(np.float32) / 255.0
    clahe_float = apply_clahe(float_img, clip_limit=2.0)
    assert clahe_float.dtype == np.float32
    assert clahe_float.max() <= 1.0


def test_brain_crop_fallback(sample_image):
    cropped = crop_brain_region(sample_image, target_size=(224, 224))
    assert cropped.shape == (224, 224)


def test_augmentation_safety(sample_image):
    aug = augment_medical_image(sample_image, config={"rotation": 15, "zoom": 0.1})
    assert aug.shape == sample_image.shape
    assert aug.dtype == sample_image.dtype


def test_stratified_splitter():
    records = []
    classes = ["NonDemented", "VeryMildDemented", "MildDemented", "ModerateDemented"]
    for i in range(40):
        records.append({
            "filepath": f"/fake/{i}.png",
            "label": classes[i % 4],
            "filename": f"{i}.png"
        })

    splitter = StratifiedDatasetSplitter(train_ratio=0.70, val_ratio=0.15, test_ratio=0.15, seed=42)
    train, val, test = splitter.split(records)

    assert len(train) == 28
    assert len(val) == 6
    assert len(test) == 6
    assert all("encoded_label" in r for r in train + val + test)


def test_image_loader_corrupted(tmp_path):
    loader = MRIImageLoader()
    corrupted_file = tmp_path / "corrupted.png"
    with open(corrupted_file, "w") as f:
        f.write("not an image")

    assert not loader.is_valid_image(corrupted_file)


def test_pipeline_orchestration(tmp_path):
    # Create fake raw dataset folder structure
    raw_dir = tmp_path / "raw"
    classes = ["NonDemented", "VeryMildDemented", "MildDemented", "ModerateDemented"]
    for c in classes:
        c_dir = raw_dir / c
        c_dir.mkdir(parents=True, exist_ok=True)
        # Write small valid PNG image
        fake_img = np.random.randint(0, 256, (50, 50), dtype=np.uint8)
        import cv2
        cv2.imwrite(str(c_dir / "sample1.png"), fake_img)
        cv2.imwrite(str(c_dir / "sample2.png"), fake_img)

    output_dir = tmp_path / "processed"
    config = {
        "image_size": 224,
        "channels": 1,
        "normalize": True,
        "gaussian_blur": True,
        "clahe": True,
        "brain_crop": False,
        "train_ratio": 0.50,
        "val_ratio": 0.25,
        "test_ratio": 0.25,
        "seed": 42
    }

    pipeline = MRIPreprocessingPipeline(config=config)
    stats = pipeline.run(dataset_dir=raw_dir, output_dir=output_dir)

    assert stats["valid_images"] == 8
    assert (tmp_path / "label_encoder.json").exists()
    assert (tmp_path / "dataset_statistics.json").exists()
