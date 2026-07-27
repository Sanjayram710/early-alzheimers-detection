# End-to-End Machine Learning Pipeline

## 1. Datasets & Ingestion
Supports scanning public MRI datasets including:
- **ADNI** (Alzheimer's Disease Neuroimaging Initiative)
- **OASIS** (Open Access Series of Imaging Studies)
- **AIBL** (Australian Imaging, Biomarkers and Lifestyle Study of Ageing)
- **Kaggle MRI Datasets**

### Supported Formats
- DICOM (`.dcm`)
- NIfTI (`.nii`, `.nii.gz`)
- Standard formats (`.png`, `.jpg`, `.jpeg`)

## 2. Target Classes
- `Non Demented`
- `Very Mild Demented`
- `Mild Demented`
- `Moderate Demented`

## 3. Data Cleaning & Preprocessing
- **Validation**: MD5 hash check to eliminate duplicate slice files.
- **Corruption Removal**: Auto-filters unreadable or truncated image files.
- **Normalization**: Pixel values scaled to $[0.0, 1.0]$. Resized to $224 \times 224 \times 3$.
- **Patient-Aware Split**: 70% Train, 15% Validation, 15% Test. Grouped by patient ID to prevent data leakage.

## 4. Model Architectures & Registry
1. **Custom Baseline CNN**: 3 Conv-Pool blocks, Batch Normalization, Dropout (0.3/0.5), Softmax classifier.
2. **Transfer Learning Backbones**: ResNet50, EfficientNetB0, DenseNet121, MobileNetV2.
3. **Vision Transformer (ViT)**: Patch extraction (16x16), linear projection, learnable positional encoding, transformer encoder blocks.

## 5. Explainable AI (Grad-CAM)
Calculates gradients of the top predicted class score w.r.t activations of the target convolutional layer. Blends jet-colormap heatmap with original MRI scan at adjustable opacity.
