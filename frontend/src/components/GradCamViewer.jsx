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
    <GlassCard padding="p-6 sm:p-7" hoverEffect={false} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-[15px] border border-white/40 p-0.5 shadow-sm flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8B5CF6] flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#111827]">
              Grad-CAM Visual Explainability
            </h3>
            <p className="text-xs text-[#6B7280] font-semibold">Class Activation Map highlighting neurological regions driving AI prediction</p>
          </div>
        </div>

        {/* Floating Mode Toolbar */}
        <div className="flex items-center space-x-1.5 bg-white/20 backdrop-blur-[20px] p-1.5 rounded-full border border-white/35 shadow-inner text-xs">
          <button
            type="button"
            onClick={() => setMode('overlay')}
            className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              mode === 'overlay' ? 'bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] text-white shadow-md' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Interactive Overlay
          </button>
          <button
            type="button"
            onClick={() => setMode('side-by-side')}
            className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              mode === 'side-by-side' ? 'bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] text-white shadow-md' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Interactive Opacity Controls */}
      {mode === 'overlay' && (
        <div className="flex items-center space-x-4 bg-white/18 backdrop-blur-[15px] p-4 rounded-[20px] border border-white/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
          <Sliders className="w-4 h-4 text-[#6D5EF5] flex-shrink-0" />
          <span className="text-xs font-extrabold text-[#111827] w-32">Heatmap Opacity:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full h-2 bg-[#EEF4FF] rounded-lg appearance-none cursor-pointer accent-[#6D5EF5]"
          />
          <span className="text-xs font-mono font-extrabold text-[#6D5EF5] w-12 text-right">{opacity}%</span>
        </div>
      )}

      {/* Display Frame Area */}
      {mode === 'overlay' ? (
        <div className="relative aspect-square max-w-md mx-auto rounded-[28px] overflow-hidden border border-white/40 shadow-[0_12px_30px_rgba(31,38,135,0.12)] bg-slate-950 group flex items-center justify-center">
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
            <span className="font-bold text-[#A78BFA]">Grad-CAM Heatmap Overlay</span>
            <span>Opacity: {opacity}%</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Left: Original MRI */}
          <div className="space-y-2">
            <span className="block text-xs font-extrabold text-[#6B7280] text-center uppercase tracking-wider">Original Brain MRI</span>
            <div className="aspect-square rounded-[24px] overflow-hidden border border-white/40 bg-slate-950 flex items-center justify-center shadow-md relative">
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
            <span className="block text-xs font-extrabold text-[#6D5EF5] text-center uppercase tracking-wider">Grad-CAM Activation Map</span>
            <div className="aspect-square rounded-[24px] overflow-hidden border border-[#6D5EF5]/40 bg-slate-950 flex items-center justify-center shadow-md relative">
              {formattedOverlay && !imgError.overlay ? (
                <img
                  src={formattedOverlay}
                  alt="Grad-CAM Activation Map"
                  onError={() => setImgError((prev) => ({ ...prev, overlay: true }))}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-4 text-slate-400 space-y-2">
                  <ImageOff className="w-8 h-8 mx-auto text-[#6D5EF5]/60" />
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
