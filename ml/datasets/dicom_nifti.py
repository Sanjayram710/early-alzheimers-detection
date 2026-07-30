import io
import logging
from pathlib import Path
from typing import Union, Tuple, Optional
import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)


def read_image_as_rgb(
    image_input: Union[str, Path, bytes],
    target_size: Optional[Tuple[int, int]] = (224, 224)
) -> np.ndarray:
    """
    Reads an MRI image file path or raw bytes (DICOM, NIfTI, PNG, JPG) and converts it to a 
    3-channel 8-bit RGB NumPy array.
    
    If target_size is provided, resizes the image to target_size. If target_size is None,
    preserves original image resolution.
    """
    if isinstance(image_input, bytes):
        return _read_bytes_image(image_input, target_size)

    file_path = Path(image_input)
    suffix = file_path.suffix.lower()

    if suffix in [".dcm", ".dicom"]:
        return _read_dicom(file_path, target_size)
    elif suffix in [".nii", ".gz"] or file_path.name.endswith(".nii.gz"):
        return _read_nifti(file_path, target_size)
    else:
        return _read_standard_image(file_path, target_size)


def _read_bytes_image(image_bytes: bytes, target_size: Optional[Tuple[int, int]]) -> np.ndarray:
    """Reads raw image bytes (PNG, JPG, or DICOM bytes)."""
    try:
        # Try DICOM first if bytes contain DICOM header
        if len(image_bytes) > 132 and image_bytes[128:132] == b"DICM":
            import pydicom
            dicom_data = pydicom.dcmread(io.BytesIO(image_bytes))
            pixel_array = dicom_data.pixel_array.astype(np.float32)
            normalized = _normalize_pixel_array(pixel_array)
            img = Image.fromarray(normalized).convert("RGB")
            if target_size is not None:
                img = img.resize(target_size, Image.Resampling.BILINEAR)
            return np.array(img)
    except Exception as e:
        logger.debug(f"Pydicom bytes read skipped: {e}")

    # Fall back to standard PIL reading
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    if target_size is not None:
        img = img.resize(target_size, Image.Resampling.BILINEAR)
    return np.array(img)


def _read_dicom(file_path: Path, target_size: Optional[Tuple[int, int]]) -> np.ndarray:
    """Reads a DICOM (.dcm) file using pydicom."""
    try:
        import pydicom
        ds = pydicom.dcmread(str(file_path))
        pixel_array = ds.pixel_array.astype(np.float32)
        normalized = _normalize_pixel_array(pixel_array)
        img = Image.fromarray(normalized).convert("RGB")
        if target_size is not None:
            img = img.resize(target_size, Image.Resampling.BILINEAR)
        return np.array(img)
    except Exception as e:
        logger.warning(f"Error reading DICOM file {file_path}: {e}. Falling back to standard image reader.")
        return _read_standard_image(file_path, target_size)


def _read_nifti(file_path: Path, target_size: Optional[Tuple[int, int]]) -> np.ndarray:
    """Reads a 3D NIfTI (.nii / .nii.gz) volume and extracts the middle axial slice."""
    try:
        import nibabel as nib
        nii = nib.load(str(file_path))
        data = nii.get_fdata(dtype=np.float32)
        # Extract middle slice along 3rd axis
        if data.ndim >= 3:
            mid_slice_idx = data.shape[2] // 2
            slice_2d = data[:, :, mid_slice_idx]
        else:
            slice_2d = data

        normalized = _normalize_pixel_array(slice_2d)
        img = Image.fromarray(normalized).convert("RGB")
        if target_size is not None:
            img = img.resize(target_size, Image.Resampling.BILINEAR)
        return np.array(img)
    except Exception as e:
        logger.error(f"Failed to read NIfTI file {file_path}: {e}")
        raise ValueError(f"Could not parse NIfTI image: {e}")


def _read_standard_image(file_path: Path, target_size: Optional[Tuple[int, int]]) -> np.ndarray:
    """Reads standard PNG, JPG, JPEG, BMP images via PIL."""
    with Image.open(file_path) as img:
        img = img.convert("RGB")
        if target_size is not None:
            img = img.resize(target_size, Image.Resampling.BILINEAR)
        return np.array(img)


def _normalize_pixel_array(arr: np.ndarray) -> np.ndarray:
    """Scales pixel values to 0-255 uint8."""
    min_val, max_val = np.min(arr), np.max(arr)
    if max_val - min_val == 0:
        return np.zeros(arr.shape, dtype=np.uint8)
    scaled = (arr - min_val) / (max_val - min_val) * 255.0
    return scaled.astype(np.uint8)
