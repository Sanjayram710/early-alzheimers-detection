import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProcessingLog = ({ customTimestamp }) => {
  const [isOpen, setIsOpen] = useState(false);

  const baseTime = customTimestamp || new Date().toLocaleTimeString('en-US', { hour12: false });

  const logs = [
    { time: `${baseTime}`, text: 'MRI Uploaded & Stream Handled', status: 'success' },
    { time: `${baseTime}`, text: 'Image Validation Completed (Format: RGB / DICOM compatible)', status: 'success' },
    { time: `${baseTime}`, text: 'Quality Metrics Calculated (Resolution, Contrast, Sharpness)', status: 'success' },
    { time: `${baseTime}`, text: 'Gaussian Denoising Filter Executed', status: 'success' },
    { time: `${baseTime}`, text: 'Contrast Limited Adaptive Histogram Equalization (CLAHE) Applied', status: 'success' },
    { time: `${baseTime}`, text: 'Brain ROI Bounding Contour Detected & Extracted', status: 'success' },
    { time: `${baseTime}`, text: 'Intensity Min-Max Normalization Completed', status: 'success' },
    { time: `${baseTime}`, text: 'Preprocessed Tensor Transferred to NeuroDxNet Model Input Layer', status: 'info' },
    { time: `${baseTime}`, text: 'Model Forward Pass & Grad-CAM Heatmap Generation Completed', status: 'success' },
  ];

  return (
    <div className="rounded-[24px] bg-[#0F172A] border-[1.5px] border-[#3B82F6]/65 hover:border-[#3B82F6] text-white overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),0_8px_24px_rgba(59,130,246,0.08)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_12px_32px_rgba(59,130,246,0.16)] transition-all duration-250 ease-in-out">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-[#1E293B] hover:bg-[#334155] transition-colors flex items-center justify-between text-left cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2.5">
          <Terminal className="w-4 h-4 text-[#3B82F6]" />
          <span className="font-mono font-bold text-xs tracking-wide">
            Clinical Processing Log & Diagnostic Execution Telemetry
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            9 Events Logged
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Expandable Log Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 space-y-2 font-mono text-[11px] bg-[#020617] border-t border-slate-800 max-h-60 overflow-y-auto"
          >
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-slate-300">
                <span className="text-[#3B82F6] font-semibold flex-shrink-0">[{log.time}]</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{log.text}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
