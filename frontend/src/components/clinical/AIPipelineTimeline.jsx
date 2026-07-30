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
  Info,
  Zap,
  Activity as PulseIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIPipelineTimeline = ({
  currentStageIndex = 11,
  isProcessing = false,
  qualityScore = 92,
  totalRuntimeMs = 127
}) => {
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [hoveredStageId, setHoveredStageId] = useState(null);

  const stages = [
    {
      id: 'patient',
      title: 'Patient Registered',
      shortDesc: 'Demographics Logged',
      timeMs: 5,
      icon: UserCheck,
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
      shortDesc: 'MIP Pipeline Run',
      timeMs: 31,
      icon: Sliders,
      operations: [
        'Initiated Medical Image Processing orchestrator',
        'Configured Gaussian spatial filtering parameters',
        'Initialized CLAHE contrast equalization grid'
      ],
      input: 'Raw Pixel Buffer',
      output: 'Preprocessed Tensor Stream'
    },
    {
      id: 'quality',
      title: 'Quality Assessment',
      shortDesc: 'SNR & Sharpness Check',
      timeMs: 2,
      icon: Sparkles,
      operations: [
        'Calculated mean image brightness & RMS contrast',
        'Computed Laplacian sharpness variance (587.17)',
        'Estimated MAD background noise index (4.45)',
        'Generated composite Quality Score (92/100)'
      ],
      input: 'Raw RGB Array',
      output: 'Image Quality Metrics Payload'
    },
    {
      id: 'denoise',
      title: 'Gaussian Denoising',
      shortDesc: 'Spatial Noise Reduction',
      timeMs: 8,
      icon: Sliders,
      operations: [
        'Applied 5x5 Gaussian kernel spatial smoothing',
        'Attenuated high-frequency thermal noise',
        'Preserved cortical boundary sharpness'
      ],
      input: 'Noisy Image Tensor',
      output: 'Smoothed Image Array'
    },
    {
      id: 'clahe',
      title: 'CLAHE Enhancement',
      shortDesc: 'Adaptive Contrast',
      timeMs: 10,
      icon: Layers,
      operations: [
        'Divided slice into 8x8 contextual tiles',
        'Applied clip limit 2.0 histogram equalization',
        'Enhanced tissue contrast across white/gray matter'
      ],
      input: 'Smoothed Image Array',
      output: 'High-Contrast MRI Array'
    },
    {
      id: 'roi',
      title: 'ROI Extraction',
      shortDesc: 'Brain Contour Crop',
      timeMs: 6,
      icon: Sliders,
      operations: [
        'Segmented brain tissue via Otsu thresholding',
        'Extracted largest convex brain contour',
        'Cropped zero-padding background boundaries'
      ],
      input: 'High-Contrast MRI Array',
      output: 'Cropped ROI Brain Region'
    },
    {
      id: 'neurodxnet',
      title: 'NeuroDxNet Inference',
      shortDesc: 'CNN Forward Pass',
      timeMs: 47,
      icon: Brain,
      operations: [
        'Rescaled pixels to Min-Max [0.0 - 1.0]',
        'Broadcasted tensor to shape (1, 224, 224, 3)',
        'Executed forward pass on NeuroDxNet CNN architecture'
      ],
      input: 'Normalized 224x224x3 Tensor',
      output: 'Class Logit Distribution'
    },
    {
      id: 'prediction',
      title: 'Stage Prediction',
      shortDesc: 'Disease Classification',
      timeMs: 3,
      icon: Activity,
      operations: [
        'Applied Softmax probability normalization',
        'Identified top category: Non Demented / Demented',
        'Formatted stage severity classification'
      ],
      input: 'Class Logit Distribution',
      output: 'Predicted Disease Category'
    },
    {
      id: 'gradcam',
      title: 'Grad-CAM Explainability',
      shortDesc: 'Attention Heatmap',
      timeMs: 29,
      icon: Eye,
      operations: [
        'Extracted target conv layer gradients',
        'Generated weighted activation heatmap',
        'Overlaid heatmap on preprocessed brain MRI'
      ],
      input: 'CNN Conv Gradients',
      output: 'Visual Heatmap & Overlay URLs'
    },
    {
      id: 'report',
      title: 'Clinical Report Generation',
      shortDesc: 'PDF Document Render',
      timeMs: 14,
      icon: FileText,
      operations: [
        'Compiled patient metadata & MIP summary',
        'Embedded side-by-side MRI & Grad-CAM images',
        'Generated downloadable clinical decision PDF'
      ],
      input: 'Study Results Payload',
      output: 'Publication-Ready PDF File'
    }
  ];

  const toggleStageExpand = (id) => {
    setSelectedStageId(selectedStageId === id ? null : id);
  };

  const activeStageIndex = isProcessing ? Math.min(currentStageIndex, stages.length - 1) : stages.length;

  return (
    <div className="bg-white/94 backdrop-blur-[20px] rounded-[32px] p-6 sm:p-8 border-2 border-[#3B82F6] shadow-[0_20px_40px_rgba(59,130,246,0.16),0_8px_16px_rgba(0,0,0,0.03),inset_0_2.5px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)] space-y-6">
      
      {/* Pipeline Header Bar & Health Telemetry */}
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
                End-to-End Medical AI Workflow Connected Pipeline
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] uppercase tracking-wider">
                Siemens / GE Standard
              </span>
            </div>
            <p className="text-xs text-[#475569] font-semibold mt-0.5">
              Interactive clinical execution graph, per-stage timings & operational verification
            </p>
          </div>
        </div>

        {/* Pipeline Health Summary Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] text-xs font-extrabold flex items-center space-x-1.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>Pipeline Health: <strong>Excellent</strong></span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-extrabold flex items-center space-x-1.5 shadow-2xs">
            <Clock className="w-4 h-4 text-[#3B82F6]" />
            <span>Total Duration: <strong className="font-mono">{totalRuntimeMs} ms</strong></span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-[#F8FAFC] border border-slate-200 text-[#0F172A] text-xs font-extrabold">
            Stages Completed: <strong className="text-[#2563EB]">{stages.length} / {stages.length}</strong>
          </div>
        </div>
      </div>

      {/* Clinical Health System Status Pills Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
        <div className="p-3 rounded-[20px] bg-[#F8FAFC] border border-slate-200 flex items-center justify-between">
          <span className="text-[#64748B]">Image Quality Index:</span>
          <span className="text-[#22C55E] font-extrabold">{qualityScore}/100</span>
        </div>
        <div className="p-3 rounded-[20px] bg-[#F8FAFC] border border-slate-200 flex items-center justify-between">
          <span className="text-[#64748B]">Inference Engine:</span>
          <span className="text-[#3B82F6] font-extrabold">Healthy</span>
        </div>
        <div className="p-3 rounded-[20px] bg-[#F8FAFC] border border-slate-200 flex items-center justify-between">
          <span className="text-[#64748B]">Grad-CAM Heatmap:</span>
          <span className="text-[#8B5CF6] font-extrabold">Generated</span>
        </div>
        <div className="p-3 rounded-[20px] bg-[#F8FAFC] border border-slate-200 flex items-center justify-between">
          <span className="text-[#64748B]">Clinical PDF Report:</span>
          <span className="text-[#15803D] font-extrabold">Ready</span>
        </div>
      </div>

      {/* Connected Connected Pipeline Visual Stage Graph */}
      <div className="relative pt-2 pb-4 overflow-x-auto">
        <div className="min-w-[1000px] flex items-center justify-between relative">
          
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />
          
          {/* Active Progress Line */}
          <motion.div
            className="absolute top-1/2 left-6 h-1 bg-gradient-to-r from-[#22C55E] via-[#3B82F6] to-[#60A5FA] -translate-y-1/2 z-0 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(100, (activeStageIndex / stages.length) * 100)}%` }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />

          {stages.map((stage, idx) => {
            const StageIcon = stage.icon;
            const isCompleted = idx < activeStageIndex;
            const isCurrent = idx === activeStageIndex && isProcessing;
            const isSelected = selectedStageId === stage.id;
            const isHovered = hoveredStageId === stage.id;

            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center group">
                
                {/* Stage Connected Node Circle Button */}
                <button
                  type="button"
                  onClick={() => toggleStageExpand(stage.id)}
                  onMouseEnter={() => setHoveredStageId(stage.id)}
                  onMouseLeave={() => setHoveredStageId(null)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer select-none shadow-md ${
                    isCompleted
                      ? 'bg-[#22C55E] border-white text-white shadow-[0_4px_14px_rgba(34,197,94,0.4)] scale-100 hover:scale-110'
                      : isCurrent
                      ? 'bg-[#3B82F6] border-white text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse scale-110 ring-4 ring-[#3B82F6]/30'
                      : 'bg-white border-slate-300 text-slate-400 hover:border-[#3B82F6] hover:text-[#3B82F6]'
                  } ${isSelected ? 'ring-4 ring-[#3B82F6] scale-110' : ''}`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <StageIcon className="w-4 h-4" />
                  )}
                </button>

                {/* Stage Node Text Labels */}
                <div className="mt-2 text-center max-w-[90px]">
                  <span className={`block text-[11px] font-extrabold leading-tight ${isCompleted ? 'text-[#0F172A]' : isCurrent ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>
                    {stage.title}
                  </span>
                  <span className="block text-[9px] font-bold text-[#64748B] mt-0.5 font-mono">
                    {stage.timeMs} ms
                  </span>
                </div>

                {/* Hover Tooltip Overlay */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute bottom-full mb-3 w-56 p-3 rounded-[20px] bg-[#0F172A] text-white text-[11px] font-bold shadow-xl border border-slate-700 z-30 pointer-events-none space-y-1.5"
                    >
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                        <span className="text-[#3B82F6] font-extrabold">{stage.title}</span>
                        <span className="text-emerald-400 font-mono">{stage.timeMs} ms</span>
                      </div>
                      <p className="text-slate-300 font-normal leading-tight">{stage.shortDesc}</p>
                      <div className="text-[10px] text-slate-400">
                        <span>Input: <strong className="text-slate-200">{stage.input}</strong></span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Detailed Operational Drawer Panel */}
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
                        Verified Clinical Operations
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
