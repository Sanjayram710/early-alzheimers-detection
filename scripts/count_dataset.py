import os

dataset = "processed_dataset"

for split in ["train", "validation", "test"]:
    print(f"\n{split.upper()}")
    total = 0

    split_path = os.path.join(dataset, split)

    for cls in sorted(os.listdir(split_path)):
        cls_path = os.path.join(split_path, cls)
        if os.path.isdir(cls_path):
            count = len(os.listdir(cls_path))
            print(f"{cls}: {count}")
            total += count

    print(f"Total {split}: {total}")