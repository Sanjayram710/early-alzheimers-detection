import io
import base64
import logging
from typing import Tuple, Optional, Dict
import numpy as np
import cv2
from PIL import Image
import tensorflow as tf

logger = logging.getLogger(__name__)


class GradCAMGenerator:
    """
    Computes Gradient-weighted Class Activation Mapping (Grad-CAM) visual explanations
    for MRI predictions. Highlights specific brain regions influencing the model's output.
    """

    def __init__(self, model: tf.keras.Model, target_layer_name: Optional[str] = None):
        self.model = model
        existing_layers = {l.name for l in self.model.layers}
        if target_layer_name and target_layer_name in existing_layers:
            self.target_layer_name = target_layer_name
        else:
            self.target_layer_name = self._find_target_layer_name()

    def _find_target_layer_name(self) -> str:
        """Finds the last 4D Conv2D or activation layer in the Keras model graph."""
        for layer in reversed(self.model.layers):
            if isinstance(layer, (tf.keras.layers.Conv2D, tf.keras.layers.DepthwiseConv2D)):
                return layer.name
            out_shape = getattr(layer, 'output_shape', None)
            if out_shape and len(out_shape) == 4 and "conv" in layer.name.lower():
                return layer.name

        # Fallback to the layer with 4D output shape
        for layer in reversed(self.model.layers):
            out_shape = getattr(layer, 'output_shape', None)
            if out_shape and len(out_shape) == 4:
                return layer.name

        raise ValueError("Could not automatically locate 4D target convolutional layer for Grad-CAM.")

    def generate_heatmap(
        self,
        img_array: np.ndarray,
        pred_index: Optional[int] = None
    ) -> np.ndarray:
        """
        Computes Grad-CAM heatmap array (2D normalized float32 [0.0, 1.0]).
        
        Args:
            img_array: Batch dimension input array of shape (1, 224, 224, 3).
            pred_index: Class index to explain. Defaults to top predicted class.
        """
        if img_array.ndim == 3:
            img_array = np.expand_dims(img_array, axis=0)

        grad_model = tf.keras.models.Model(
            inputs=[self.model.inputs],
            outputs=[self.model.get_layer(self.target_layer_name).output, self.model.output]
        )

        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(img_array)
            if pred_index is None:
                pred_index = tf.argmax(predictions[0])
            loss = predictions[:, pred_index]

        # Extract gradients w.r.t target layer activations
        grads = tape.gradient(loss, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)

        # Relu on heatmap and normalize
        heatmap = tf.maximum(heatmap, 0) / (tf.reduce_max(heatmap) + 1e-10)
        return heatmap.numpy()

    def generate_overlay(
        self,
        original_img: np.ndarray,
        heatmap: np.ndarray,
        alpha: float = 0.4,
        colormap: int = cv2.COLORMAP_JET
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Blends 2D heatmap with original RGB MRI image.
        
        Args:
            original_img: RGB array (224, 224, 3) with range [0, 255] or [0.0, 1.0].
            heatmap: 2D float array [0.0, 1.0].
            alpha: Transparency weight for heatmap overlay.

        Returns:
            Tuple of (colored_heatmap_rgb, blended_overlay_rgb).
        """
        if original_img.max() <= 1.0:
            original_img = (original_img * 255.0).astype(np.uint8)
        else:
            original_img = original_img.astype(np.uint8)

        # Resize heatmap to match image dimensions
        heatmap_resized = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
        heatmap_uint8 = np.uint8(255 * heatmap_resized)

        # Apply OpenCV colormap
        heatmap_color_bgr = cv2.applyColorMap(heatmap_uint8, colormap)
        heatmap_color_rgb = cv2.cvtColor(heatmap_color_bgr, cv2.COLOR_BGR2RGB)

        # Blend
        overlay_rgb = cv2.addWeighted(original_img, 1.0 - alpha, heatmap_color_rgb, alpha, 0)
        return heatmap_color_rgb, overlay_rgb

    def generate_gradcam_response(
        self,
        original_img: np.ndarray,
        pred_index: Optional[int] = None,
        alpha: float = 0.4
    ) -> Dict[str, str]:
        """
        Runs full Grad-CAM pipeline and returns base64-encoded data URLs for heatmap and overlay.
        """
        input_batch = np.expand_dims(original_img, axis=0) if original_img.ndim == 3 else original_img
        if input_batch.max() > 1.0:
            input_batch_norm = input_batch.astype(np.float32) / 255.0
        else:
            input_batch_norm = input_batch.astype(np.float32)

        heatmap = self.generate_heatmap(input_batch_norm, pred_index=pred_index)
        heatmap_rgb, overlay_rgb = self.generate_overlay(original_img, heatmap, alpha=alpha)

        return {
            "heatmap_base64": self._array_to_base64(heatmap_rgb),
            "overlay_base64": self._array_to_base64(overlay_rgb)
        }

    @staticmethod
    def _array_to_base64(arr: np.ndarray) -> str:
        """Converts RGB numpy array to base64 data URL string."""
        img = Image.fromarray(arr.astype(np.uint8))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        b64_str = base64.b64encode(buf.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{b64_str}"
