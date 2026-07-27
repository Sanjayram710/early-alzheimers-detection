import logging
from typing import Tuple
import pandas as pd
from sklearn.model_selection import GroupShuffleSplit, StratifiedShuffleSplit

logger = logging.getLogger(__name__)


class PatientDataSplitter:
    """
    Performs train, validation, and test dataset splitting.
    Uses patient-level GroupShuffleSplit when patient metadata exists to prevent data leakage across splits.
    Falls back to StratifiedShuffleSplit if patient IDs are generic/unavailable.
    """

    def __init__(
        self,
        train_ratio: float = 0.70,
        val_ratio: float = 0.15,
        test_ratio: float = 0.15,
        random_state: int = 42
    ):
        assert abs((train_ratio + val_ratio + test_ratio) - 1.0) < 1e-5, "Split ratios must sum to 1.0"
        self.train_ratio = train_ratio
        self.val_ratio = val_ratio
        self.test_ratio = test_ratio
        self.random_state = random_state

    def split(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """
        Splits DataFrame into train, val, test splits.
        Returns (train_df, val_df, test_df).
        """
        if df.empty:
            raise ValueError("Input DataFrame is empty.")

        # Check if patient_id metadata is sufficiently populated
        unique_patients = df["patient_id"].nunique()
        use_patient_split = (unique_patients > 10) and (unique_patients < len(df) * 0.95)

        if use_patient_split:
            logger.info(f"Performing patient-level split based on {unique_patients} unique patient IDs.")
            train_df, val_df, test_df = self._group_split(df)
        else:
            logger.info("Performing label-stratified split across image samples.")
            train_df, val_df, test_df = self._stratified_split(df)

        logger.info(f"Split completed: Train={len(train_df)}, Val={len(val_df)}, Test={len(test_df)}")
        return train_df, val_df, test_df

    def _group_split(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """Group split by patient_id."""
        val_test_ratio = self.val_ratio + self.test_ratio
        gss1 = GroupShuffleSplit(n_splits=1, test_size=val_test_ratio, random_state=self.random_state)

        train_idx, temp_idx = next(gss1.split(df, groups=df["patient_id"]))
        train_df = df.iloc[train_idx].reset_index(drop=True)
        temp_df = df.iloc[temp_idx].reset_index(drop=True)

        # Split temp into val and test
        val_relative_ratio = self.val_ratio / val_test_ratio
        gss2 = GroupShuffleSplit(n_splits=1, test_size=(1.0 - val_relative_ratio), random_state=self.random_state)

        val_idx, test_idx = next(gss2.split(temp_df, groups=temp_df["patient_id"]))
        val_df = temp_df.iloc[val_idx].reset_index(drop=True)
        test_df = temp_df.iloc[test_idx].reset_index(drop=True)

        return train_df, val_df, test_df

    def _stratified_split(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """Stratified split by canonical label."""
        val_test_ratio = self.val_ratio + self.test_ratio
        sss1 = StratifiedShuffleSplit(n_splits=1, test_size=val_test_ratio, random_state=self.random_state)

        train_idx, temp_idx = next(sss1.split(df, df["canonical_label"]))
        train_df = df.iloc[train_idx].reset_index(drop=True)
        temp_df = df.iloc[temp_idx].reset_index(drop=True)

        val_relative_ratio = self.val_ratio / val_test_ratio
        sss2 = StratifiedShuffleSplit(n_splits=1, test_size=(1.0 - val_relative_ratio), random_state=self.random_state)

        val_idx, test_idx = next(sss2.split(temp_df, temp_df["canonical_label"]))
        val_df = temp_df.iloc[val_idx].reset_index(drop=True)
        test_df = temp_df.iloc[test_idx].reset_index(drop=True)

        return train_df, val_df, test_df
