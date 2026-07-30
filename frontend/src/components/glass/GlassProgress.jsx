import React from 'react';
import { motion } from 'framer-motion';

export const GlassProgress = ({
  value = 0,
  max = 100,
  color = 'purple',
  showLabel = true,
  height = 'h-3',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const gradients = {
    purple: 'from-[#6C63FF] to-[#8B5CF6]',
    green: 'from-[#22C55E] to-[#4ADE80]',
    amber: 'from-[#F59E0B] to-[#FBBF24]',
    red: 'from-[#EF4444] to-[#F87171]',
  };

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-bold text-[#1F2937]">
          <span>Confidence Level</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      )}

      <div className={`w-full ${height} bg-white/60 backdrop-blur-[10px] rounded-full p-0.5 border border-white/60 shadow-inner overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${gradients[color] || gradients.purple} shadow-sm`}
        />
      </div>
    </div>
  );
};
