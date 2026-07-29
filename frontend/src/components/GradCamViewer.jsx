import React, { useState } from 'react';
import { Eye, Layers, Sliders } from 'lucide-react';
import { ClayButton } from './clay/ClayButton';

export const GradCamViewer = ({ originalUrl, heatmapUrl, overlayUrl }) => {
  const [opacity, setOpacity] = useState(50);
  const [mode, setMode] = useState('overlay'); // 'overlay' | 'side-by-side'

  return (
    <div className="bg-gradient-to-br from-white via-[#F8FAFC] to-[#EEF2FF] rounded-[28px] p-6 border border-white/80 shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)] space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-0.5 shadow-[4px_4px_10px_rgba(163,177,198,0.3),-4px_-4px_8px_rgba(255,255,255,0.95)] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8E82FF] flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#1F2937]">
              Grad-CAM Visual Explainability
            </h3>
            <p className="text-xs text-[#6B7280] font-medium">Class Activation Map highlighting neurological regions driving AI prediction</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-[#F4F6FB] p-1.5 rounded-full border border-white/80 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.2),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] text-xs">
          <button
            onClick={() => setMode('overlay')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
              mode === 'overlay' ? 'bg-[#6D5EF5] text-white shadow-md' : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            Interactive Overlay
          </button>
          <button
            onClick={() => setMode('side-by-side')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
              mode === 'side-by-side' ? 'bg-[#6D5EF5] text-white shadow-md' : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Interactive Controls */}
      {mode === 'overlay' && (
        <div className="flex items-center space-x-4 bg-[#F4F6FB] p-3.5 rounded-[20px] border border-white/80 shadow-[inset_3px_3px_6px_rgba(163,177,198,0.25),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]">
          <Sliders className="w-4 h-4 text-[#6D5EF5] flex-shrink-0" />
          <span className="text-xs font-bold text-[#1F2937] w-32">Heatmap Opacity:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#6D5EF5]"
          />
          <span className="text-xs font-mono font-bold text-[#6D5EF5] w-12 text-right">{opacity}%</span>
        </div>
      )}

      {/* Display Area */}
      {mode === 'overlay' ? (
        <div className="relative aspect-square max-w-md mx-auto rounded-[24px] overflow-hidden border border-white/80 shadow-[10px_10px_24px_rgba(163,177,198,0.35),-8px_-8px_20px_rgba(255,255,255,0.95)] bg-slate-950">
          {/* Base Original MRI */}
          {originalUrl && (
            <img
              src={originalUrl}
              alt="Original MRI"
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}

          {/* Heatmap Layer with Dynamic Opacity */}
          {heatmapUrl && (
            <img
              src={heatmapUrl}
              alt="Grad-CAM Heatmap"
              className="absolute inset-0 w-full h-full object-contain mix-blend-screen transition-opacity duration-150"
              style={{ opacity: opacity / 100 }}
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <span className="block text-xs font-bold text-[#6B7280] text-center uppercase tracking-wider">Original Brain MRI</span>
            <div className="aspect-square rounded-[22px] overflow-hidden border border-white/80 bg-slate-950 flex items-center justify-center shadow-[6px_6px_16px_rgba(163,177,198,0.3)]">
              <img src={originalUrl} alt="Original MRI" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="space-y-2">
            <span className="block text-xs font-bold text-[#6D5EF5] text-center uppercase tracking-wider">Grad-CAM Overlay</span>
            <div className="aspect-square rounded-[22px] overflow-hidden border border-[#6D5EF5]/40 bg-slate-950 flex items-center justify-center shadow-[6px_6px_16px_rgba(109,94,245,0.3)]">
              <img src={overlayUrl || heatmapUrl} alt="Grad-CAM Overlay" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
