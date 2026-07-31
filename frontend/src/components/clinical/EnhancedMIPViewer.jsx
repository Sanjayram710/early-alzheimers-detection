import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Sliders, Eye, Move, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const EnhancedMIPViewer = ({
  originalUrl,
  processedUrl,
  metadata = {}
}) => {
  const [activeTab, setActiveTab] = useState('enhanced'); // 'original' or 'enhanced'
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const resolutionStr = metadata?.resolution
    ? `${metadata.resolution[0]} × ${metadata.resolution[1]}`
    : '256 × 256';

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale > 1 || isPanning) {
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setIsPanning(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const currentImgUrl = activeTab === 'enhanced' ? (processedUrl || originalUrl) : originalUrl;

  return (
    <div
      ref={containerRef}
      className={`relative bg-[#0F172A] rounded-[24px] overflow-hidden border-2 border-[#3B82F6]/65 hover:border-[#3B82F6] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_8px_24px_rgba(59,130,246,0.08),0_2px_8px_rgba(59,130,246,0.05)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.50),0_12px_32px_rgba(59,130,246,0.16),0_4px_12px_rgba(59,130,246,0.10)] transition-all duration-250 ease-in-out flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'w-full min-h-[440px]'
      }`}
    >
      {/* Top Clinical Control Bar */}
      <div className="p-4 bg-[#1E293B]/90 backdrop-blur-[15px] border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-white z-20">
        
        {/* Left View Toggle */}
        <div className="flex items-center space-x-1.5 bg-[#0F172A] p-1 rounded-full border border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('enhanced')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'enhanced'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Enhanced MRI</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('original')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'original'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Original MRI</span>
          </button>
        </div>

        {/* Center Interactive Pan/Zoom Controls */}
        <div className="flex items-center space-x-1.5 bg-[#0F172A] px-3 py-1.5 rounded-full border border-slate-700 text-xs font-extrabold">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-slate-400 font-mono px-2 text-[11px]">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            onClick={handleReset}
            title="Reset View"
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right Fullscreen Toggle */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
            className="p-2 rounded-full bg-[#0F172A] border border-slate-700 text-slate-300 hover:text-white hover:border-[#3B82F6] transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Canvas Viewer Area */}
      <div
        className="relative flex-1 bg-[#020617] overflow-hidden flex items-center justify-center p-6 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <motion.div
          animate={{ scale, x: pan.x, y: pan.y }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative max-w-full max-h-[380px] flex items-center justify-center"
        >
          {currentImgUrl ? (
            <img
              src={currentImgUrl}
              alt={activeTab === 'enhanced' ? 'Enhanced MRI' : 'Original MRI'}
              className="max-h-[360px] object-contain rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.25)] border border-slate-700/60"
            />
          ) : (
            <div className="text-slate-500 text-xs font-bold py-20">No Image Available</div>
          )}
        </motion.div>
      </div>

      {/* Bottom Metadata Info Bar */}
      <div className="p-3.5 bg-[#1E293B]/90 backdrop-blur-[15px] border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold text-slate-300 z-20">
        <div className="flex items-center space-x-2">
          <Info className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Resolution: <strong className="text-white font-mono">{resolutionStr}</strong></span>
        </div>

        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>Format: <strong className="text-white">8-bit RGB / Axial</strong></span>
        </div>

        <div className="flex items-center space-x-2 col-span-2">
          <Sliders className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Applied: <strong className="text-white truncate">Gaussian Denoise + CLAHE + Brain ROI Crop</strong></span>
        </div>
      </div>
    </div>
  );
};
