import React from 'react';
import { motion } from 'framer-motion';

export const GlassStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'purple',
}) => {
  const iconGradients = {
    purple: 'from-[#3B82F6] to-[#60A5FA]',
    blue: 'from-[#3B82F6] to-[#93C5FD]',
    green: 'from-[#22C55E] to-[#4ADE80]',
    amber: 'from-[#F59E0B] to-[#FBBF24]',
    red: 'from-[#EF4444] to-[#F87171]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      className="
        relative overflow-hidden
        bg-white/92 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
        rounded-[32px] p-6 sm:p-7
        border border-white
        shadow-[0_20px_40px_rgba(59,130,246,0.10),0_8px_16px_rgba(0,0,0,0.03),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)]
        hover:shadow-[0_28px_50px_rgba(59,130,246,0.16),0_12px_24px_rgba(0,0,0,0.05),inset_0_2px_5px_0_rgba(255,255,255,1),inset_0_-5px_10px_0_rgba(219,234,254,0.8)]
        transition-all duration-300 min-w-0
      "
    >
      {/* Glare Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-0 opacity-60"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 100%)'
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-3 min-w-0">
        <div className="space-y-1.5 min-w-0 flex-1 pr-1">
          <span className="block text-xs font-extrabold text-[#64748B] uppercase tracking-[0.05em] truncate" title={title}>
            {title}
          </span>
          <div 
            className="font-display text-2xl sm:text-3xl lg:text-4xl leading-tight font-extrabold text-[#0F172A] tracking-tight truncate"
            title={value}
          >
            {value}
          </div>
        </div>

        {/* 3D Inflated Clay Sphere Icon Badge */}
        {Icon && (
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white p-0.5 shadow-[0_8px_20px_rgba(59,130,246,0.20),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.05)] flex items-center justify-center flex-shrink-0">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr ${iconGradients[color] || iconGradients.purple} flex items-center justify-center text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-3px_6px_rgba(0,0,0,0.15)]`}>
              <Icon className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold min-w-0">
        <span className="text-[#64748B] font-semibold truncate min-w-0 flex-1" title={subtitle}>{subtitle}</span>
        
        {trend && (
          <span
            className={`
              inline-flex items-center px-3 py-1 rounded-full font-extrabold text-[11px] whitespace-nowrap flex-shrink-0
              shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9)]
              ${trendPositive ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]' : 'bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]'}
            `}
          >
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
};
