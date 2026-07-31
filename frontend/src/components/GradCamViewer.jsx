import React, { useState } from 'react';
import { Layers, Sliders, ImageOff } from 'lucide-react';
import { GlassCard } from './glass/GlassCard';

const formatImageUrl = (img) => {
  if (!img) return null;
  if (typeof img !== 'string') return null;
  const trimmed = img.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  if (trimmed.startsWith('uploads/')) {
    return `/${trimmed}`;
  }
  // Base64 raw string fallback
  return `data:image/png;base64,${trimmed}`;
};

export const GradCamViewer = ({ originalUrl, heatmapUrl, overlayUrl }) => {
  const [opacity, setOpacity] = useState(65);
  const [mode, setMode] = useState('overlay'); // 'overlay' | 'side-by-side'
  const [imgError, setImgError] = useState({ original: false, heatmap: false, overlay: false });

  const formattedOriginal = formatImageUrl(originalUrl);
  const formattedHeatmap = formatImageUrl(heatmapUrl);
  const formattedOverlay = formatImageUrl(overlayUrl) || formattedHeatmap;

  return (
    <GlassCard hierarchy="primary" accent="cyan" padding="p-6 sm:p-7" hoverEffect={true} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-[0_6px_16px_rgba(59,130,246,0.18),inset_0_2px_3px_rgba(255,255,255,1)] border border-white flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-white shadow-inner">
              <Layers className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#0F172A]">
              Grad-CAM Visual Explainability
            </h3>
            <p className="text-xs text-[#475569] font-semibold">Class Activation Map highlighting neurological regions driving AI prediction</p>
          </div>
        </div>

        {/* Floating Mode Toolbar */}
        <div className="flex items-center space-x-1.5 bg-[#F1F5F9] p-1.5 rounded-full border border-white shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.04)] text-xs">
          <button
            type="button"
            onClick={() => setMode('overlay')}
            className={`px-4 py-1.5 rounded-full font-extrabold transition-all cursor-pointer ${
              mode === 'overlay' ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white shadow-md' : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Interactive Overlay
          </button>
          <button
            type="button"
            onClick={() => setMode('side-by-side')}
            className={`px-4 py-1.5 rounded-full font-extrabold transition-all cursor-pointer ${
              mode === 'side-by-side' ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white shadow-md' : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Interactive Opacity Controls with Highly Visible Slider Track Line */}
      {mode === 'overlay' && (
        <div className="flex items-center space-x-4 bg-[#F1F5F9]/90 backdrop-blur-[15px] p-4 rounded-[20px] border border-slate-200 shadow-[inset_0_1.5px_2px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.04)]">
          <Sliders className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
          <span className="text-xs font-extrabold text-[#0F172A] w-32">Heatmap Opacity:</span>
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-300 rounded-full appearance-none cursor-pointer accent-[#3B82F6] border border-slate-400/40 shadow-inner"
            />
          </div>
          <span className="text-xs font-mono font-extrabold text-[#3B82F6] w-12 text-right">{opacity}%</span>
        </div>
      )}

      {/* Display Frame Area */}
      {mode === 'overlay' ? (
        <div className="relative aspect-square max-w-md mx-auto rounded-[28px] overflow-hidden border border-white shadow-[0_12px_30px_rgba(0,0,0,0.15)] bg-slate-950 group flex items-center justify-center">
          {/* Base Original MRI */}
          {formattedOriginal && !imgError.original ? (
            <img
              src={formattedOriginal}
              alt="Original MRI"
              onError={() => setImgError((prev) => ({ ...prev, original: true }))}
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-6 text-slate-400 space-y-2">
              <ImageOff className="w-10 h-10 mx-auto text-slate-500" />
              <p className="text-xs font-semibold">Original MRI image preview unavailable</p>
            </div>
          )}

          {/* Heatmap Layer with Dynamic Opacity */}
          {formattedHeatmap && !imgError.heatmap && (
            <img
              src={formattedHeatmap}
              alt="Grad-CAM Heatmap"
              onError={() => setImgError((prev) => ({ ...prev, heatmap: true }))}
              className="absolute inset-0 w-full h-full object-contain mix-blend-screen transition-opacity duration-150"
              style={{ opacity: opacity / 100 }}
            />
          )}

          {/* Floating Glass Metadata Badge Overlay */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-[15px] border border-white/20 rounded-[18px] p-2.5 flex items-center justify-between text-white text-[11px] font-mono z-10">
            <span className="font-bold text-[#60A5FA]">Grad-CAM Heatmap Overlay</span>
            <span>Opacity: {opacity}%</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Left: Original MRI */}
          <div className="space-y-2">
            <span className="block text-xs font-extrabold text-[#475569] text-center uppercase tracking-wider">Original Brain MRI</span>
            <div className="aspect-square rounded-[24px] overflow-hidden border border-white bg-slate-950 flex items-center justify-center shadow-md relative">
              {formattedOriginal && !imgError.original ? (
                <img
                  src={formattedOriginal}
                  alt="Original MRI"
                  onError={() => setImgError((prev) => ({ ...prev, original: true }))}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-4 text-slate-400 space-y-2">
                  <ImageOff className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="text-[11px] font-semibold">Image unavailable</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Grad-CAM Overlay */}
          <div className="space-y-2">
            <span className="block text-xs font-extrabold text-[#3B82F6] text-center uppercase tracking-wider">Grad-CAM Activation Map</span>
            <div className="aspect-square rounded-[24px] overflow-hidden border border-[#3B82F6]/40 bg-slate-950 flex items-center justify-center shadow-md relative">
              {formattedOverlay && !imgError.overlay ? (
                <img
                  src={formattedOverlay}
                  alt="Grad-CAM Activation Map"
                  onError={() => setImgError((prev) => ({ ...prev, overlay: true }))}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-4 text-slate-400 space-y-2">
                  <ImageOff className="w-8 h-8 mx-auto text-[#3B82F6]/60" />
                  <p className="text-[11px] font-semibold text-slate-300">Grad-CAM Activation Map</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
