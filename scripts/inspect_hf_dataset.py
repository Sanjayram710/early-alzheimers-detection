from datasets import load_dataset

dataset = load_dataset(
    "parquet",
    data_files={
        "train": "datasets/Alzheimer_MRI/data/train-00000-of-00001-c08a401c53fe5312.parquet",
        "test": "datasets/Alzheimer_MRI/data/test-00000-of-00001-44110b9df98c5585.parquet"
    }
)

print(dataset)
print("\nFirst training sample:")
print(dataset["train"][0])  