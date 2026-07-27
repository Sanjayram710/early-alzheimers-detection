import React, { useState } from 'react';
import { Eye, Layers, Sliders } from 'lucide-react';

export const GradCamViewer = ({ originalUrl, heatmapUrl, overlayUrl }) => {
  const [opacity, setOpacity] = useState(50);
  const [mode, setMode] = useState('overlay'); // 'overlay' | 'side-by-side'

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-display font-semibold text-lg text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Grad-CAM Visual Explainability</span>
          </h3>
          <p className="text-xs text-slate-400">Class Activation Map highlighting neurological regions driving AI prediction</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setMode('overlay')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              mode === 'overlay' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Interactive Overlay
          </button>
          <button
            onClick={() => setMode('side-by-side')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              mode === 'side-by-side' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Interactive Controls */}
      {mode === 'overlay' && (
        <div className="flex items-center space-x-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
          <Sliders className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-slate-300 w-28">Heatmap Opacity:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-xs font-mono font-bold text-blue-400 w-10 text-right">{opacity}%</span>
        </div>
      )}

      {/* Display Area */}
      {mode === 'overlay' ? (
        <div className="relative aspect-square max-w-md mx-auto rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-400 text-center uppercase tracking-wider">Original Brain MRI</span>
            <div className="aspect-square rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
              <img src={originalUrl} alt="Original MRI" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-blue-400 text-center uppercase tracking-wider">Grad-CAM Overlay</span>
            <div className="aspect-square rounded-xl overflow-hidden border border-blue-500/30 bg-black flex items-center justify-center">
              <img src={overlayUrl || heatmapUrl} alt="Grad-CAM Overlay" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
