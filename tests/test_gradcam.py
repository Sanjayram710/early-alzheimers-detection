import pytest
import numpy as np
from ml.models.custom_cnn import CustomCNNModel
from ml.explainability.gradcam import GradCAMGenerator


def test_gradcam_generation():
    model_wrapper = CustomCNNModel(input_shape=(224, 224, 3), num_classes=4)
    keras_model = model_wrapper.compile()

    gradcam = GradCAMGenerator(keras_model, target_layer_name="target_conv_layer")
    dummy_img = np.random.rand(224, 224, 3).astype(np.float32)

    heatmap = gradcam.generate_heatmap(dummy_img, pred_index=0)
    assert heatmap.shape[0] > 0 and heatmap.shape[1] > 0
    assert heatmap.max() <= 1.0
    assert heatmap.min() >= 0.0

    cam_res = gradcam.generate_gradcam_response(dummy_img, pred_index=0)
    assert "heatmap_base64" in cam_res
    assert "overlay_base64" in cam_res
    assert cam_res["heatmap_base64"].startswith("data:image/png;base64,")
