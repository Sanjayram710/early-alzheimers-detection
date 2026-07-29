import React from 'react';
import { motion } from 'framer-motion';

export const ClayChartCard = ({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
      className={`
        bg-gradient-to-br from-white via-[#F8FAFC] to-[#EEF2FF]
        rounded-[32px] p-7
        border border-white/80
        shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)]
        space-y-6
        ${className}
      `}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-0.5 shadow-[4px_4px_10px_rgba(163,177,198,0.3),-4px_-4px_8px_rgba(255,255,255,0.95)] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8E82FF] flex items-center justify-center text-white">
                <Icon className="w-4 h-4" />
              </div>
            </div>
          )}
          <div>
            <h3 className="font-display font-bold text-lg text-[#1F2937] tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#6B7280] font-medium">{subtitle}</p>
            )}
          </div>
        </div>

        {action && <div>{action}</div>}
      </div>

      <div className="relative w-full">
        {children}
      </div>
    </motion.div>
  );
};
