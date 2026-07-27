from typing import Tuple
import numpy as np
from PIL import Image

from ml.datasets.dicom_nifti import read_image_as_rgb


def preprocess_image_array(
    image_input: np.ndarray,
    target_size: Tuple[int, int] = (224, 224),
    normalize_pixels: bool = True
) -> np.ndarray:
    """
    Standardizes image numpy array to shape (224, 224, 3) and scales pixels to [0.0, 1.0].
    
    Args:
        image_input: NumPy array representing grayscale or RGB image.
        target_size: Desired (height, width) tuple. Default (224, 224).
        normalize_pixels: If True, divides pixel values by 255.0.

    Returns:
        float32 NumPy array with shape (target_size[0], target_size[1], 3).
    """
    # Ensure 3-channel RGB
    if image_input.ndim == 2:
        image_input = np.stack([image_input] * 3, axis=-1)
    elif image_input.ndim == 3 and image_input.shape[-1] == 1:
        image_input = np.concatenate([image_input] * 3, axis=-1)
    elif image_input.ndim == 3 and image_input.shape[-1] > 3:
        image_input = image_input[:, :, :3]

    # Resize if not already matching target size
    if (image_input.shape[0], image_input.shape[1]) != target_size:
        img_pil = Image.fromarray(image_input.astype(np.uint8))
        img_pil = img_pil.resize(target_size, Image.Resampling.BILINEAR)
        image_input = np.array(img_pil)

    img_float = image_input.astype(np.float32)
    if normalize_pixels and img_float.max() > 1.0:
        img_float /= 255.0

    return img_float


def load_and_preprocess_single(
    image_path: str,
    target_size: Tuple[int, int] = (224, 224),
    normalize_pixels: bool = True
) -> np.ndarray:
    """Convenience helper to read image path directly and preprocess it."""
    rgb_arr = read_image_as_rgb(image_path, target_size=target_size)
    return preprocess_image_array(rgb_arr, target_size=target_size, normalize_pixels=normalize_pixels)
