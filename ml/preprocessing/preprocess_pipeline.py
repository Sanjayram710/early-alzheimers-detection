import os
import sys
import json
import yaml
import argparse
import logging
from pathlib import Path
from typing import Dict, Any, List, Tuple, Optional
import cv2
import numpy as np
import tensorflow as tf

from ml.preprocessing.image_loader import MRIImageLoader
from ml.preprocessing.resize import resize_letterbox
from ml.preprocessing.grayscale import format_channels
from ml.preprocessing.denoise import denoise_image
from ml.preprocessing.normalize import normalize_intensity, denormalize_to_uint8
from ml.preprocessing.contrast import apply_clahe
from ml.preprocessing.brain_crop import crop_brain_region
from ml.preprocessing.augmentation import augment_medical_image
from ml.preprocessing.split_dataset import StratifiedDatasetSplitter, DEFAULT_LABEL_MAPPING

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)


def load_yaml_config(config_path: Path) -> Dict[str, Any]:
    """Loads YAML configuration file."""
    config_path = Path(config_path).resolve()
    if not config_path.exists():
        logger.warning(f"Config file not found at {config_path}. Using default settings.")
        return {}
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


class MRIPreprocessingPipeline:
    """
    Production-grade MRI Preprocessing Pipeline Orchestrator.
    Handles image loading, quality validation, stratified partitioning,
    image transformations, artifact disk export, statistics generation, and tf.data building.
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.image_size = self.config.get("image_size", 224)
        self.channels = self.config.get("channels", 1)
        self.do_normalize = self.config.get("normalize", True)
        self.do_gaussian = self.config.get("gaussian_blur", True)
        self.gaussian_kernel = tuple(self.config.get("blur_kernel", [3, 3]))
        self.gaussian_sigma = self.config.get("blur_sigma", 0.0)
        self.do_median = self.config.get("median_filter", False)
        self.median_kernel = self.config.get("median_kernel", 3)
        self.do_clahe = self.config.get("clahe", True)
        self.clahe_clip = self.config.get("clahe_clip_limit", 2.0)
        self.clahe_grid = tuple(self.config.get("clahe_tile_grid_size", [8, 8]))
        self.do_brain_crop = self.config.get("brain_crop", False)
        self.seed = self.config.get("seed", 42)
        self.batch_size = self.config.get("batch_size", 32)
        self.label_mapping = self.config.get("label_mapping", DEFAULT_LABEL_MAPPING)
        self.aug_config = self.config.get("augmentation", {})

    def preprocess_image(self, image: np.ndarray, is_training: bool = False) -> np.ndarray:
        """
        Executes ordered transformation sequence:
        1. Resize (Letterbox 224x224)
        2. Channel Handling (Grayscale / 3-channel)
        3. Denoising (Gaussian / Median)
        4. Contrast Enhancement (CLAHE)
        5. Brain Region Extraction (Optional)
        6. Intensity Normalization [0.0, 1.0]
        7. Data Augmentation (Train split ONLY)
        """
        target_dim = (self.image_size, self.image_size)

        # 1. Brain Crop or Letterbox Resize
        if self.do_brain_crop:
            img_processed = crop_brain_region(image, target_size=target_dim)
        else:
            img_processed = resize_letterbox(image, target_size=target_dim)

        # 2. Channel Handling
        img_processed = format_channels(img_processed, target_channels=self.channels)

        # 3. Denoising
        img_processed = denoise_image(
            img_processed,
            use_gaussian=self.do_gaussian,
            gaussian_kernel=self.gaussian_kernel,
            gaussian_sigma=self.gaussian_sigma,
            use_median=self.do_median,
            median_kernel=self.median_kernel
        )

        # 4. CLAHE Contrast Enhancement
        if self.do_clahe:
            img_processed = apply_clahe(img_processed, clip_limit=self.clahe_clip, tile_grid_size=self.clahe_grid)

        # 5. Normalization [0.0, 1.0]
        if self.do_normalize:
            img_processed = normalize_intensity(img_processed)

        # 6. Medical Augmentation (STRICTLY Training split only)
        if is_training and self.aug_config:
            img_processed = augment_medical_image(img_processed, config=self.aug_config)

        return img_processed

    def run(self, dataset_dir: Path, output_dir: Path) -> Dict[str, Any]:
        """
        Executes end-to-end dataset preprocessing, disk export, and statistics logging.
        """
        dataset_dir = Path(dataset_dir).resolve()
        output_dir = Path(output_dir).resolve()
        output_dir.mkdir(parents=True, exist_ok=True)

        logger.info(f"Starting Preprocessing Pipeline. Input: {dataset_dir}, Output: {output_dir}")

        # 1. Load & Scan Dataset
        loader = MRIImageLoader()
        records, load_stats = loader.scan_dataset(dataset_dir)
        if not records:
            raise ValueError(f"No valid images found in dataset directory: {dataset_dir}")

        # 2. Stratified Dataset Split (70/15/15)
        splitter = StratifiedDatasetSplitter(
            train_ratio=self.config.get("train_ratio", 0.70),
            val_ratio=self.config.get("val_ratio", 0.15),
            test_ratio=self.config.get("test_ratio", 0.15),
            seed=self.seed,
            label_mapping=self.label_mapping
        )
        train_recs, val_recs, test_recs = splitter.split(records)

        # Save label_encoder.json
        splitter.save_label_encoder(output_dir.parent / "label_encoder.json")

        splits_map = {
            "train": (train_recs, True),
            "validation": (val_recs, False),
            "test": (test_recs, False)
        }

        all_pixel_sums = []
        all_pixel_sq_sums = []
        total_pixel_count = 0

        # 3. Process & Save Outputs
        for split_name, (recs, is_train) in splits_map.items():
            split_dir = output_dir / split_name
            split_dir.mkdir(parents=True, exist_ok=True)

            logger.info(f"Processing split '{split_name}' ({len(recs)} samples)...")
            for rec in recs:
                class_label = rec["label"]
                class_dir = split_dir / class_label
                class_dir.mkdir(parents=True, exist_ok=True)

                raw_img, _ = loader.load_single_image(Path(rec["filepath"]))
                proc_img = self.preprocess_image(raw_img, is_training=is_train)

                # Accumulate statistics on float32 image
                all_pixel_sums.append(float(np.sum(proc_img)))
                all_pixel_sq_sums.append(float(np.sum(proc_img ** 2)))
                total_pixel_count += proc_img.size

                # Save PNG image to disk
                save_path = class_dir / rec["filename"]
                uint8_to_save = denormalize_to_uint8(proc_img) if self.do_normalize else proc_img
                cv2.imwrite(str(save_path), uint8_to_save)

        # 4. Generate & Save dataset_statistics.json
        global_mean = float(sum(all_pixel_sums) / max(1, total_pixel_count))
        global_var = float((sum(all_pixel_sq_sums) / max(1, total_pixel_count)) - (global_mean ** 2))
        global_std = float(np.sqrt(max(0.0, global_var)))

        class_counts = {}
        for r in records:
            lbl = r["label"]
            class_counts[lbl] = class_counts.get(lbl, 0) + 1

        stats_summary = {
            "total_images_scanned": load_stats["total_scanned"],
            "valid_images": load_stats["valid_loaded"],
            "corrupted_images": load_stats["corrupted_skipped"],
            "target_image_size": f"{self.image_size}x{self.image_size}",
            "target_channels": self.channels,
            "mean_pixel_value": round(global_mean, 4),
            "std_pixel_value": round(global_std, 4),
            "splits": {
                "train_count": len(train_recs),
                "validation_count": len(val_recs),
                "test_count": len(test_recs)
            },
            "class_distribution": class_counts
        }

        stats_file = output_dir.parent / "dataset_statistics.json"
        with open(stats_file, "w", encoding="utf-8") as f:
            json.dump(stats_summary, f, indent=2)
        logger.info(f"Dataset statistics exported successfully to {stats_file}")

        return stats_summary


def build_tf_data_pipeline(
    processed_dir: Path,
    split: str = "train",
    is_training: bool = True,
    batch_size: int = 32,
    image_size: int = 224,
    channels: int = 1,
    num_classes: int = 4
) -> tf.data.Dataset:
    """
    Constructs an optimized TensorFlow tf.data.Dataset pipeline:
    Load -> Resize -> Normalize -> One-Hot Encode -> Cache -> Shuffle -> Batch -> Prefetch.
    """
    split_dir = Path(processed_dir) / split
    if not split_dir.exists():
        raise FileNotFoundError(f"Split directory {split_dir} does not exist.")

    image_paths = []
    labels = []

    # Map subfolders to integers using standard mapping
    for class_folder in sorted(split_dir.iterdir()):
        if class_folder.is_dir():
            label_idx = DEFAULT_LABEL_MAPPING.get(class_folder.name, 0)
            for file_path in class_folder.rglob("*.png"):
                image_paths.append(str(file_path.resolve()))
                labels.append(label_idx)

    def _parse_function(path_tensor, label_tensor):
        img_bytes = tf.io.read_file(path_tensor)
        img = tf.io.decode_png(img_bytes, channels=channels)
        img = tf.image.resize(img, [image_size, image_size], method="area")
        img = tf.cast(img, tf.float32) / 255.0
        one_hot = tf.one_hot(label_tensor, depth=num_classes, dtype=tf.float32)
        return img, one_hot

    ds = tf.data.Dataset.from_tensor_slices((image_paths, labels))
    ds = ds.map(_parse_function, num_parallel_calls=tf.data.AUTOTUNE)

    if is_training:
        ds = ds.cache().shuffle(buffer_size=1000).repeat()
    else:
        ds = ds.cache()

    return ds.batch(batch_size).prefetch(tf.data.AUTOTUNE)


def main():
    parser = argparse.ArgumentParser(description="MRI Image Preprocessing Pipeline Orchestrator")
    parser.add_argument("--config", default="config/preprocessing.yaml", help="Path to preprocessing.yaml")
    parser.add_argument("--dataset_dir", default="./data/raw/AugmentedAlzheimerDataset", help="Raw input dataset directory")
    parser.add_argument("--output_dir", default="./processed_dataset", help="Output processed dataset directory")
    args = parser.parse_args()

    config = load_yaml_config(Path(args.config))
    pipeline = MRIPreprocessingPipeline(config=config)
    pipeline.run(dataset_dir=Path(args.dataset_dir), output_dir=Path(args.output_dir))


if __name__ == "__main__":
    main()
