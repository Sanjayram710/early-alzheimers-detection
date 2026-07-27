import pytest
import numpy as np
from ml.models.registry import ModelRegistry
from ml.models.custom_cnn import CustomCNNModel


def test_custom_cnn_build_and_forward():
    model_wrapper = CustomCNNModel(input_shape=(224, 224, 3), num_classes=4)
    keras_model = model_wrapper.build()
    model_wrapper.compile()

    assert keras_model is not None
    assert model_wrapper.get_gradcam_target_layer_name() == "target_conv_layer"

    dummy_input = np.random.rand(2, 224, 224, 3).astype(np.float32)
    preds = keras_model.predict(dummy_input, verbose=0)

    assert preds.shape == (2, 4)
    assert np.allclose(np.sum(preds, axis=1), 1.0, atol=1e-5)


def test_model_registry():
    supported = ModelRegistry.get_supported_models()
    assert "custom_cnn" in supported
    assert "transfer_resnet50" in supported
    assert "vit" in supported

    model_inst = ModelRegistry.create_model("custom_cnn")
    assert model_inst is not None
