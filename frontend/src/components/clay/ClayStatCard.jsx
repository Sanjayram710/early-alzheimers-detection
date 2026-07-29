import React from 'react';
import { motion } from 'framer-motion';

export const ClayStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'purple',
}) => {
  const iconGradients = {
    purple: 'from-[#6D5EF5] to-[#8E82FF]',
    blue: 'from-[#3B82F6] to-[#60A5FA]',
    green: 'from-[#22C55E] to-[#4ADE80]',
    amber: 'from-[#F59E0B] to-[#FBBF24]',
    red: 'from-[#EF4444] to-[#F87171]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      className="
        relative overflow-hidden
        bg-gradient-to-br from-white via-[#F8FAFC] to-[#EEF2FF]
        rounded-[28px] p-6
        border border-white/80
        shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)]
        hover:shadow-[16px_16px_36px_rgba(163,177,198,0.45),-12px_-12px_28px_rgba(255,255,255,1)]
        transition-all duration-300
      "
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider">
            {title}
          </span>
          <div className="font-display text-[40px] leading-tight font-extrabold text-[#1F2937] tracking-tight">
            {value}
          </div>
        </div>

        {/* Large icon inside circular clay badge */}
        {Icon && (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-1 shadow-[6px_6px_14px_rgba(163,177,198,0.3),-4px_-4px_10px_rgba(255,255,255,0.95)] flex items-center justify-center flex-shrink-0">
            <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${iconGradients[color] || iconGradients.purple} flex items-center justify-center text-white shadow-inner`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
        <span className="font-medium text-[#6B7280]">{subtitle}</span>
        
        {trend && (
          <span
            className={`
              inline-flex items-center px-2.5 py-1 rounded-full font-bold text-[11px]
              shadow-[inset_2px_2px_4px_rgba(163,177,198,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
              ${trendPositive ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEE2E2] text-[#B91C1C]'}
            `}
          >
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
};
