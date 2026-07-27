from typing import Dict, Type, List, Tuple
from ml.models.base import BaseAlzheimerModel
from ml.models.custom_cnn import CustomCNNModel
from ml.models.transfer import TransferLearningModel
from ml.models.vit import VisionTransformerModel


class ModelRegistry:
    """
    Modular Model Registry & Factory for instantiating baseline, transfer learning,
    and Vision Transformer architectures.
    """

    _registry: Dict[str, Type[BaseAlzheimerModel]] = {
        "custom_cnn": CustomCNNModel,
        "vit": VisionTransformerModel
    }

    @classmethod
    def get_supported_models(cls) -> List[str]:
        """Returns list of registered model names."""
        transfer_names = [f"transfer_{k}" for k in TransferLearningModel.BACKBONE_MAP.keys()]
        return list(cls._registry.keys()) + transfer_names

    @classmethod
    def create_model(
        cls,
        model_name: str,
        input_shape: Tuple[int, int, int] = (224, 224, 3),
        num_classes: int = 4,
        learning_rate: float = 1e-4,
        **kwargs
    ) -> BaseAlzheimerModel:
        """
        Factory method to instantiate a model by name.
        
        Supported model_name values:
        - 'custom_cnn'
        - 'transfer_resnet50'
        - 'transfer_efficientnetb0'
        - 'transfer_densenet121'
        - 'transfer_mobilenetv2'
        - 'vit'
        """
        key = model_name.lower().strip()

        if key.startswith("transfer_"):
            backbone_name = key.replace("transfer_", "")
            model_instance = TransferLearningModel(
                backbone_name=backbone_name,
                input_shape=input_shape,
                num_classes=num_classes,
                learning_rate=learning_rate,
                **kwargs
            )
            model_instance.build()
            model_instance.compile()
            return model_instance

        if key in cls._registry:
            model_cls = cls._registry[key]
            model_instance = model_cls(
                input_shape=input_shape,
                num_classes=num_classes,
                learning_rate=learning_rate,
                **kwargs
            )
            model_instance.build()
            model_instance.compile()
            return model_instance

        raise ValueError(
            f"Unknown model name '{model_name}'. Available models: {cls.get_supported_models()}"
        )
