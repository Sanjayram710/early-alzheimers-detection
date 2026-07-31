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
  hierarchy = 'secondary', // 'primary' | 'secondary'
  accent = 'blue',
}) => {
  const iconGradients = {
    purple: 'from-[#3B82F6] to-[#60A5FA]',
    blue: 'from-[#3B82F6] to-[#93C5FD]',
    green: 'from-[#22C55E] to-[#4ADE80]',
    amber: 'from-[#F59E0B] to-[#FBBF24]',
    red: 'from-[#EF4444] to-[#F87171]',
  };

  const accentBorders = {
    blue: 'border-[#3B82F6]/65 hover:border-[#3B82F6]',
    green: 'border-[#22C55E]/65 hover:border-[#22C55E]',
    purple: 'border-[#8B5CF6]/65 hover:border-[#8B5CF6]',
    amber: 'border-[#F59E0B]/65 hover:border-[#F59E0B]',
    red: 'border-[#EF4444]/65 hover:border-[#EF4444]',
  };

  const borderWidth = hierarchy === 'primary' ? 'border-2' : 'border-[1.5px]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
      className={`
        relative overflow-hidden
        bg-white/94 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
        rounded-[24px] p-6 sm:p-7
        ${borderWidth} ${accentBorders[accent] || accentBorders.blue}
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_8px_24px_rgba(59,130,246,0.08),0_2px_8px_rgba(59,130,246,0.05),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)]
        hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.50),0_12px_32px_rgba(59,130,246,0.16),0_4px_12px_rgba(59,130,246,0.10),inset_0_2px_5px_0_rgba(255,255,255,1),inset_0_-5px_10px_0_rgba(219,234,254,0.8)]
        transition-all duration-250 ease-in-out min-w-0
      `}
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
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white p-0.5 shadow-[0_8px_20px_rgba(59,130,246,0.20),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.05)] border border-[#3B82F6]/40 flex items-center justify-center flex-shrink-0">
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
              shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.04)]
              ${trendPositive ? 'bg-[#DCFCE7]/80 text-[#15803D] border border-[#86EFAC]' : 'bg-[#DBEAFE]/80 text-[#1D4ED8] border border-[#3B82F6]/60'}
            `}
          >
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
};

