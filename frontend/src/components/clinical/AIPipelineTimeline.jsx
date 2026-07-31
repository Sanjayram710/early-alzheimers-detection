import React, { useState } from 'react';
import {
  UserCheck,
  Upload,
  Sliders,
  Sparkles,
  Layers,
  Brain,
  Activity,
  CheckCircle2,
  Eye,
  FileText,
  Check,
  Loader2,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Zap,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIPipelineTimeline = ({
  currentStageIndex = 8,
  isProcessing = false,
  qualityScore = 92,
  totalRuntimeMs = 127
}) => {
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [hoveredStageId, setHoveredStageId] = useState(null);

  // Grouped stages with specific color schemes by functional role
  const stages = [
    {
      id: 'patient',
      title: 'Patient Information',
      shortDesc: 'Demographics Logged',
      timeMs: 5,
      icon: UserCheck,
      color: {
        bg: 'bg-[#EFF6FF]',
        border: 'border-[#BFDBFE]',
        text: 'text-[#1D4ED8]',
        badgeBg: 'bg-[#3B82F6]',
        glow: 'rgba(59, 130, 246, 0.4)'
      },
      operations: [
        'Validated patient ID & clinical metadata',
        'Recorded symptoms & blood group profile',
        'Created encrypted study session'
      ],
      input: 'Patient Metadata Payload',
      output: 'Patient Identity Hash & Record'
    },
    {
      id: 'upload',
      title: 'MRI Upload',
      shortDesc: 'DICOM / NIfTI Stream',
      timeMs: 12,
      icon: Upload,
      color: {
        bg: 'bg-[#DBEAFE]',
        border: 'border-[#93C5FD]',
        text: 'text-[#1E40AF]',
        badgeBg: 'bg-[#2563EB]',
        glow: 'rgba(37, 99, 235, 0.4)'
      },
      operations: [
        'Streamed binary file payload (Max 25MB)',
        'Header parsing & slice integrity check',
        'Validated axial plane slice resolution'
      ],
      input: 'Raw MRI File Stream',
      output: 'Validated RGB / DICOM Tensor'
    },
    {
      id: 'mip',
      title: 'Medical Image Processing',
      shortDesc: 'Quality, Denoise, CLAHE & ROI',
      timeMs: 31,
      icon: Sliders,
      isGroup: true,
      subOperations: [
        { label: 'Quality Assessment', time: '2 ms' },
        { label: 'Gaussian Denoising', time: '8 ms' },
        { label: 'CLAHE Enhancement', time: '10 ms' },
        { label: 'ROI Extraction', time: '6 ms' },
        { label: 'Intensity Normalization', time: '5 ms' }
      ],
      color: {
        bg: 'bg-[#F3E8FF]',
        border: 'border-[#DDD6FE]',
        text: 'text-[#6B21A8]',
        badgeBg: 'bg-[#8B5CF6]',
        glow: 'rgba(139, 92, 246, 0.4)'
      },
      operations: [
        'Image Quality Assessment (Brightness, Contrast, Sharpness)',
        'Gaussian 5x5 spatial kernel denoising',
        'CLAHE 8x8 adaptive contrast equalization',
        'Otsu brain contour ROI bounding box extraction',
        'Min-Max pixel intensity scaling [0.0 - 1.0]'
      ],
      input: 'Raw Image Array',
      output: 'Enhanced 224x224x3 Tensor'
    },
    {
      id: 'neurodxnet',
      title: 'NeuroDxNet CNN',
      shortDesc: 'CNN Forward Pass',
      timeMs: 47,
      icon: Brain,
      color: {
        bg: 'bg-[#FEF3C7]',
        border: 'border-[#FDE68A]',
        text: 'text-[#92400E]',
        badgeBg: 'bg-[#F59E0B]',
        glow: 'rgba(245, 158, 11, 0.4)'
      },
      operations: [
        'Broadcasted preprocessed tensor to shape (1, 224, 224, 3)',
        'Evaluated feature maps across convolutional layers',
        'Generated raw category logit distribution'
      ],
      input: 'Normalized 224x224x3 Tensor',
      output: 'Raw Logit Vector'
    },
    {
      id: 'prediction',
      title: 'Stage Prediction',
      shortDesc: 'Disease Severity',
      timeMs: 3,
      icon: Activity,
      color: {
        bg: 'bg-[#FFE4E6]',
        border: 'border-[#FECDD3]',
        text: 'text-[#9F1239]',
        badgeBg: 'bg-[#E11D48]',
        glow: 'rgba(225, 29, 72, 0.4)'
      },
      operations: [
        'Applied Softmax probability distribution scaling',
        'Identified top category: Non Demented / Demented',
        'Calculated class score ranking'
      ],
      input: 'Raw Logit Vector',
      output: 'Predicted Disease Category'
    },
    {
      id: 'confidence',
      title: 'Confidence Analysis',
      shortDesc: 'Uncertainty Weighting',
      timeMs: 2,
      icon: CheckCircle,
      color: {
        bg: 'bg-[#E0F2FE]',
        border: 'border-[#BAE6FD]',
        text: 'text-[#075985]',
        badgeBg: 'bg-[#06B6D4]',
        glow: 'rgba(6, 182, 212, 0.4)'
      },
      operations: [
        'Evaluated top class probability confidence percentage',
        'Validated prediction margin against uncertainty threshold',
        'Formatted clinical probability score'
      ],
      input: 'Softmax Vector',
      output: 'Confidence Score (%)'
    },
    {
      id: 'gradcam',
      title: 'Grad-CAM Explainability',
      shortDesc: 'Attention Heatmap',
      timeMs: 29,
      icon: Eye,
      color: {
        bg: 'bg-[#CCFBF1]',
        border: 'border-[#99F6E4]',
        text: 'text-[#115E59]',
        badgeBg: 'bg-[#0D9488]',
        glow: 'rgba(13, 148, 136, 0.4)'
      },
      operations: [
        'Extracted feature map gradients from target conv layer',
        'Computed channel-weighted activation heatmap',
        'Overlaid heatmap on preprocessed brain MRI'
      ],
      input: 'CNN Conv Gradients',
      output: 'Visual Heatmap & Overlay Data'
    },
    {
      id: 'report',
      title: 'Clinical Report',
      shortDesc: 'PDF Generation',
      timeMs: 14,
      icon: FileText,
      color: {
        bg: 'bg-[#DCFCE7]',
        border: 'border-[#86EFAC]',
        text: 'text-[#166534]',
        badgeBg: 'bg-[#16A34A]',
        glow: 'rgba(22, 163, 74, 0.4)'
      },
      operations: [
        'Compiled patient metadata & MIP summary',
        'Embedded side-by-side MRI & Grad-CAM images',
        'Rendered downloadable publication-ready PDF report'
      ],
      input: 'Study Results Payload',
      output: 'Downloadable PDF Document'
    }
  ];

  const activeStageIndex = isProcessing ? Math.min(currentStageIndex, stages.length - 1) : stages.length;

  const toggleStageExpand = (id) => {
    setSelectedStageId(selectedStageId === id ? null : id);
  };

  return (
    <div className="bg-white/94 backdrop-blur-[20px] rounded-[32px] p-6 sm:p-8 border-2 border-[#3B82F6] shadow-[0_20px_40px_rgba(59,130,246,0.16),0_8px_16px_rgba(0,0,0,0.03),inset_0_2.5px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)] space-y-6">

      {/* Clean Pipeline Header Bar & Health Telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-[0_6px_16px_rgba(59,130,246,0.20),inset_0_2px_3px_rgba(255,255,255,1)] border border-white flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-white shadow-inner">
              <Brain className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-extrabold text-lg text-[#0F172A]">
                NeuroDxNet Processing Pipeline
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] uppercase tracking-wider">
                Clinical Research Workflow
              </span>
            </div>
            <p className="text-xs text-[#475569] font-semibold mt-0.5">
              Continuous connected medical AI execution graph, per-stage timings & operational logs
            </p>
          </div>
        </div>

        {/* Health Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] text-xs font-extrabold flex items-center space-x-1.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>Pipeline Health: <strong>Excellent</strong></span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-extrabold flex items-center space-x-1.5 shadow-2xs">
            <Clock className="w-4 h-4 text-[#3B82F6]" />
            <span>Total Time: <strong className="font-mono">{totalRuntimeMs} ms</strong></span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-[#F8FAFC] border border-slate-200 text-[#0F172A] text-xs font-extrabold">
            Stages Completed: <strong className="text-[#2563EB]">{stages.length} / {stages.length}</strong>
          </div>
        </div>
      </div>

      {/* Execution Metrics Summary Panel */}
      <div className="p-4 rounded-[24px] bg-[#F8FAFC] border border-slate-200/90 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-bold">
        <div className="p-3 rounded-[18px] bg-white border border-slate-200 text-center">
          <span className="text-[#64748B] block text-[10px] uppercase tracking-wider">Total Time</span>
          <span className="text-sm font-mono font-extrabold text-[#3B82F6] block mt-0.5">{totalRuntimeMs} ms</span>
        </div>

        <div className="p-3 rounded-[18px] bg-white border border-slate-200 text-center">
          <span className="text-[#64748B] block text-[10px] uppercase tracking-wider">Fastest Stage</span>
          <span className="text-xs font-mono font-bold text-[#22C55E] block mt-0.5">Confidence (2 ms)</span>
        </div>

        <div className="p-3 rounded-[18px] bg-white border border-slate-200 text-center">
          <span className="text-[#64748B] block text-[10px] uppercase tracking-wider">Longest Stage</span>
          <span className="text-xs font-mono font-bold text-[#F59E0B] block mt-0.5">NeuroDxNet (47 ms)</span>
        </div>

        <div className="p-3 rounded-[18px] bg-white border border-slate-200 text-center">
          <span className="text-[#64748B] block text-[10px] uppercase tracking-wider">Avg Stage Time</span>
          <span className="text-xs font-mono font-bold text-[#8B5CF6] block mt-0.5">11.5 ms</span>
        </div>

        <div className="p-3 rounded-[18px] bg-[#DCFCE7] border border-[#86EFAC] text-center col-span-2 sm:col-span-1">
          <span className="text-[#15803D] block text-[10px] uppercase tracking-wider">Status</span>
          <span className="text-xs font-bold text-[#15803D] block mt-0.5">Completed Successfully</span>
        </div>
      </div>

      {/* Continuous Connected Pipeline Graph with Padded Headroom for Tooltips */}
      <div className="relative pt-36 pb-6 overflow-x-auto">
        <div className="min-w-[1050px] flex items-center justify-between relative px-4">

          {/* Continuous Background Track Line */}
          <div className="absolute top-[28px] left-10 right-10 h-1.5 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />

          {/* Animated Flow Connector Gradient Line */}
          <motion.div
            className="absolute top-[28px] left-10 h-1.5 bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#16A34A] -translate-y-1/2 z-0 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(100, (activeStageIndex / stages.length) * 100)}%` }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {stages.map((stage, idx) => {
            const StageIcon = stage.icon;
            const isCompleted = idx < activeStageIndex;
            const isCurrent = idx === activeStageIndex && isProcessing;
            const isSelected = selectedStageId === stage.id;
            const isHovered = hoveredStageId === stage.id;

            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center group">

                {/* Node Button with Functional Color Coding */}
                <button
                  type="button"
                  onClick={() => toggleStageExpand(stage.id)}
                  onMouseEnter={() => setHoveredStageId(stage.id)}
                  onMouseLeave={() => setHoveredStageId(null)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer select-none shadow-md ${isCompleted
                      ? `${stage.color.bg} ${stage.color.border} ${stage.color.text} shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:scale-110`
                      : isCurrent
                        ? 'bg-[#3B82F6] border-white text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse scale-110 ring-4 ring-[#3B82F6]/30'
                        : 'bg-white border-slate-300 text-slate-400 hover:border-[#3B82F6] hover:text-[#3B82F6]'
                    } ${isSelected ? 'ring-4 ring-[#3B82F6] scale-110' : ''}`}
                >
                  {isCompleted ? (
                    <StageIcon className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <StageIcon className="w-4 h-4" />
                  )}
                </button>

                {/* Stage Text Information with Visual Hierarchy */}
                <div className="mt-2.5 text-center max-w-[105px]">
                  <span className={`block text-xs font-extrabold leading-tight ${isCompleted ? 'text-[#0F172A]' : isCurrent ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>
                    {stage.title}
                  </span>

                  <span className="block text-[10px] font-mono font-bold text-[#2563EB] mt-0.5">
                    {stage.timeMs} ms
                  </span>

                  <span className="block text-[9px] font-semibold text-[#64748B] truncate mt-0.5">
                    {stage.shortDesc}
                  </span>

                  {/* Status Colored Pill Badge */}
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${isCompleted ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]' : isCurrent ? 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]' : 'bg-[#F1F5F9] text-[#64748B] border-slate-200'
                    }`}>
                    {isCompleted ? 'Completed' : isCurrent ? 'Running...' : 'Pending'}
                  </span>
                </div>

                {/* Light Claymorphism Hover Tooltip Overlay */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-[22px] bg-white/98 backdrop-blur-[15px] text-[#0F172A] text-xs font-bold shadow-[0_12px_32px_rgba(59,130,246,0.22),0_4px_12px_rgba(0,0,0,0.06)] border-2 border-[#3B82F6]/40 z-30 pointer-events-none space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-[#2563EB] font-extrabold text-xs">{stage.title}</span>
                        <span className="text-[#15803D] font-mono font-extrabold text-[11px] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#86EFAC]">{stage.timeMs} ms</span>
                      </div>

                      <div className="space-y-1 text-[11px] text-[#334155]">
                        <span className="text-[#64748B] font-extrabold uppercase text-[9px] block">Operations Performed:</span>
                        {stage.operations.slice(0, 3).map((op, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0" />
                            <span className="truncate">{op}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 text-[10px] text-[#64748B] flex justify-between items-center">
                        <span>Output Result:</span>
                        <strong className="text-[#1D4ED8] font-mono">{stage.output}</strong>
                      </div>

                      {/* Tooltip Downward Pointer Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visually Grouped Preprocessing Sub-Operations Highlight Box */}
      <div className="p-4 rounded-[24px] bg-gradient-to-r from-[#F3E8FF]/80 to-[#EFF6FF]/80 border-2 border-[#8B5CF6]/50 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#DDD6FE] pb-2">
          <span className="text-xs font-extrabold text-[#6B21A8] uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#8B5CF6]" />
            <span>Grouped Preprocessing Operations (Medical Image Processing Stage)</span>
          </span>
          <span className="text-[11px] font-mono font-bold text-[#8B5CF6] bg-white px-3 py-0.5 rounded-full border border-[#DDD6FE]">
            31 ms Total
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-bold">
          <div className="p-2.5 rounded-xl bg-white border border-[#DDD6FE] flex items-center justify-between shadow-2xs">
            <span className="text-[#0F172A] truncate">✓ Quality Check</span>
            <span className="text-[#8B5CF6] font-mono text-[11px]">2 ms</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#DDD6FE] flex items-center justify-between shadow-2xs">
            <span className="text-[#0F172A] truncate">✓ Gaussian Denoise</span>
            <span className="text-[#8B5CF6] font-mono text-[11px]">8 ms</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#DDD6FE] flex items-center justify-between shadow-2xs">
            <span className="text-[#0F172A] truncate">✓ CLAHE Contrast</span>
            <span className="text-[#8B5CF6] font-mono text-[11px]">10 ms</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#DDD6FE] flex items-center justify-between shadow-2xs">
            <span className="text-[#0F172A] truncate">✓ Brain ROI Crop</span>
            <span className="text-[#8B5CF6] font-mono text-[11px]">6 ms</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#DDD6FE] flex items-center justify-between shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[#0F172A] truncate">✓ Normalization</span>
            <span className="text-[#8B5CF6] font-mono text-[11px]">5 ms</span>
          </div>
        </div>
      </div>

      {/* Expandable Operational Verification Details Drawer */}
      <AnimatePresence>
        {selectedStageId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-5 rounded-[24px] bg-[#F8FAFC] border-2 border-[#3B82F6] space-y-3"
          >
            {(() => {
              const stage = stages.find((s) => s.id === selectedStageId);
              if (!stage) return null;

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center space-x-2">
                      <stage.icon className="w-4 h-4 text-[#3B82F6]" />
                      <h4 className="font-extrabold text-sm text-[#0F172A]">
                        {stage.title} Operational Verification Details
                      </h4>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-mono font-extrabold">
                      Execution Duration: {stage.timeMs} ms
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider block">
                        Verified Operations
                      </span>
                      <div className="space-y-1.5 text-xs font-bold text-[#334155]">
                        {stage.operations.map((op, idx) => (
                          <div key={idx} className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0" />
                            <span>{op}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-bold">
                      <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider block">
                        Input / Output Artifacts
                      </span>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <div>
                          <span className="text-[#64748B] block text-[10px] uppercase">Input Stream</span>
                          <span className="text-[#0F172A] font-mono">{stage.input}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[#64748B] block text-[10px] uppercase">Output Result</span>
                          <span className="text-[#2563EB] font-mono">{stage.output}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
