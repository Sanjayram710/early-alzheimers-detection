import pytest
import numpy as np
import pandas as pd
from ml.datasets.loader import MRIDatasetLoader
from ml.preprocessing.normalization import preprocess_image_array
from ml.preprocessing.splitter import PatientDataSplitter


def test_label_normalization():
    assert MRIDatasetLoader.normalize_label("Non_Demented") == "Non Demented"
    assert MRIDatasetLoader.normalize_label("cn") == "Non Demented"
    assert MRIDatasetLoader.normalize_label("very_mild_demented") == "Very Mild Demented"
    assert MRIDatasetLoader.normalize_label("mci") == "Mild Demented"
    assert MRIDatasetLoader.normalize_label("ad") == "Moderate Demented"


def test_preprocess_image_array():
    arr = np.random.randint(0, 256, (100, 100), dtype=np.uint8)
    processed = preprocess_image_array(arr, target_size=(224, 224), normalize_pixels=True)

    assert processed.shape == (224, 224, 3)
    assert processed.dtype == np.float32
    assert processed.max() <= 1.0
    assert processed.min() >= 0.0


def test_patient_data_splitter():
    data = []
    for i in range(20):
        data.append({
            "file_path": f"/path/{i}.png",
            "canonical_label": "Non Demented" if i % 2 == 0 else "Mild Demented",
            "patient_id": f"OAS1_{i:04d}"
        })
    df = pd.DataFrame(data)

    splitter = PatientDataSplitter(train_ratio=0.70, val_ratio=0.15, test_ratio=0.15)
    train_df, val_df, test_df = splitter.split(df)

    assert len(train_df) + len(val_df) + len(test_df) == len(df)
    # Ensure patient IDs do not leak across splits
    train_patients = set(train_df["patient_id"])
    val_patients = set(val_df["patient_id"])
    test_patients = set(test_df["patient_id"])
    assert len(train_patients.intersection(val_patients)) == 0
    assert len(train_patients.intersection(test_patients)) == 0
