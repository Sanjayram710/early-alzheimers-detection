import json
import logging
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger(__name__)


class ExperimentTracker:
    """
    Persists model training hyperparameter configurations, learning curves,
    and evaluation metrics into JSON metadata files.
    """

    def __init__(self, output_dir: Path):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def log_run(
        self,
        run_name: str,
        hyperparameters: Dict[str, Any],
        history: Dict[str, list],
        test_metrics: Dict[str, float]
    ) -> Path:
        """Saves run metadata as a formatted JSON document."""
        run_data = {
            "run_name": run_name,
            "hyperparameters": hyperparameters,
            "training_history": history,
            "final_metrics": test_metrics
        }

        file_path = self.output_dir / f"{run_name}_experiment.json"
        with open(file_path, "w") as f:
            json.dump(run_data, f, indent=2)

        logger.info(f"Experiment log saved to {file_path}")
        return file_path
