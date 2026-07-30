import React from 'react';
import { CheckCircle2, Loader2, Circle, ArrowRight, ShieldCheck, Sliders, Layers, Sparkles, Brain, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const PipelineStatusWorkflow = ({ currentStepIndex = 5, isProcessing = false }) => {
  const steps = [
    { title: 'Image Validation', desc: 'DICOM/NIfTI Format Check', icon: ShieldCheck },
    { title: 'Quality Assessment', desc: 'Contrast & Sharpness Score', icon: Sparkles },
    { title: 'Gaussian Denoising', desc: 'Spatial Noise Reduction', icon: Sliders },
    { title: 'CLAHE Enhancement', desc: 'Adaptive Equalization', icon: Layers },
    { title: 'Brain ROI Extraction', desc: 'Contour Bounding Crop', icon: Sliders },
    { title: 'Ready for NeuroDxNet', desc: 'Model Preprocessed', icon: Brain },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-display font-extrabold text-sm text-[#0F172A] flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#3B82F6]" />
          <span>MRI Preprocessing Pipeline Execution</span>
        </h3>
        <span className="text-[11px] font-extrabold text-[#2563EB] bg-[#DBEAFE] px-3 py-1 rounded-full border border-[#BFDBFE]">
          {isProcessing ? 'Preprocessing Active...' : 'Pipeline Completed'}
        </span>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx <= currentStepIndex && !isProcessing;
          const isCurrent = idx === currentStepIndex && isProcessing;

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`p-3.5 rounded-[22px] border transition-all flex items-start space-x-3 ${
                isCompleted
                  ? 'bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] border-[#86EFAC] text-[#15803D] shadow-2xs'
                  : isCurrent
                  ? 'bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] border-[#3B82F6] text-[#1D4ED8] shadow-md ring-2 ring-[#3B82F6]/30'
                  : 'bg-[#F8FAFC] border-slate-200 text-[#64748B]'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-[#22C55E] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-6 h-6 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-xs animate-spin">
                    <Loader2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                    <Circle className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="space-y-0.5 min-w-0">
                <span className={`block text-xs font-extrabold truncate ${isCompleted ? 'text-[#15803D]' : isCurrent ? 'text-[#1D4ED8]' : 'text-[#0F172A]'}`}>
                  {step.title}
                </span>
                <span className="block text-[10px] font-bold text-[#64748B] truncate">
                  {step.desc}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
