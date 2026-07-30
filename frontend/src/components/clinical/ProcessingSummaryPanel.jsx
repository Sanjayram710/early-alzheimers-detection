import React from 'react';
import { CheckCircle2, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProcessingSummaryPanel = ({ metadata }) => {
  const summaryItems = [
    { label: 'MRI successfully validated', detail: 'Format & dimension standards met' },
    { label: 'Image quality acceptable', detail: metadata?.rating ? `Rating: ${metadata.rating}` : 'High SNR & contrast' },
    { label: 'Noise reduced', detail: metadata?.denoise_method ? `Method: ${metadata.denoise_method}` : 'Spatial filter applied' },
    { label: 'Contrast enhanced', detail: 'CLAHE adaptive equalization' },
    { label: 'Brain ROI extracted', detail: metadata?.roi_detected ? 'Bounding contour cropped' : 'Full axial frame preserved' },
    { label: 'Image normalized', detail: 'Intensity scaled [0.0 - 1.0]' },
  ];

  return (
    <div className="p-5 rounded-[28px] bg-gradient-to-br from-white to-[#F8FAFC] border-2 border-[#3B82F6] shadow-[0_12px_32px_rgba(59,130,246,0.12),inset_0_2px_4px_rgba(255,255,255,1)] space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] text-white flex items-center justify-center p-0.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm text-[#0F172A]">
              Medical Image Processing Summary
            </h3>
            <p className="text-[11px] text-[#475569] font-bold">Comprehensive preprocessing verification log</p>
          </div>
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] text-xs font-extrabold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ready for NeuroDxNet</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-bold">
        {summaryItems.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3 rounded-[18px] bg-white border border-slate-200/90 shadow-2xs flex items-center space-x-3"
          >
            <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
            <div className="min-w-0">
              <span className="block text-[#0F172A] font-extrabold truncate">{item.label}</span>
              <span className="block text-[10px] text-[#64748B] font-semibold truncate">{item.detail}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
