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
    purple: 'from-[#6D5EF5] to-[#8B5CF6]',
    blue: 'from-[#3B82F6] to-[#60A5FA]',
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
        bg-white/18 backdrop-blur-[30px] -webkit-backdrop-blur-[30px]
        rounded-[28px] p-5 sm:p-6
        border border-white/35
        shadow-[0_8px_32px_rgba(31,38,135,0.10),0_20px_60px_rgba(0,0,0,0.05)]
        hover:shadow-[0_20px_50px_rgba(109,94,245,0.18),0_25px_70px_rgba(0,0,0,0.08)]
        hover:bg-white/28 hover:border-white/50
        transition-all duration-300 min-w-0
      "
    >
      {/* Specular Top Reflection Layer */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 100%)'
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-3 min-w-0">
        <div className="space-y-1 min-w-0 flex-1 pr-1">
          <span className="block text-xs font-extrabold text-[#6B7280] uppercase tracking-wider truncate" title={title}>
            {title}
          </span>
          <div 
            className="font-display text-xl sm:text-2xl lg:text-3xl xl:text-4xl leading-tight font-extrabold text-[#111827] tracking-tight truncate"
            title={value}
          >
            {value}
          </div>
        </div>

        {/* Circular Glass Icon Badge */}
        {Icon && (
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 backdrop-blur-[15px] border border-white/40 p-0.5 shadow-sm flex items-center justify-center flex-shrink-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr ${iconGradients[color] || iconGradients.purple} flex items-center justify-center text-white shadow-inner`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold min-w-0">
        <span className="text-[#6B7280] truncate min-w-0 flex-1" title={subtitle}>{subtitle}</span>
        
        {trend && (
          <span
            className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full font-extrabold text-[11px] whitespace-nowrap flex-shrink-0
              shadow-sm backdrop-blur-[15px]
              ${trendPositive ? 'bg-[#DCFCE7]/40 text-[#15803D] border border-[#22C55E]/40' : 'bg-[#FEE2E2]/40 text-[#B91C1C] border border-[#EF4444]/40'}
            `}
          >
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
};
