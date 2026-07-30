import React from 'react';
import { motion } from 'framer-motion';

export const GlassChartCard = ({
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
        relative overflow-hidden
        bg-white/22 backdrop-blur-[30px] -webkit-backdrop-blur-[30px]
        rounded-[32px] p-7
        border border-white/35
        shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.6),0_12px_36px_rgba(31,38,135,0.10),0_20px_60px_rgba(0,0,0,0.05)]
        hover:shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.8),0_20px_50px_rgba(109,94,245,0.18),0_25px_70px_rgba(0,0,0,0.08)]
        hover:bg-white/32 hover:border-white/50
        space-y-6
        transition-all duration-300
        ${className}
      `}
    >
      {/* Specular Top Reflection Layer */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.08) 60%, rgba(255, 255, 255, 0) 100%)'
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/20">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-[15px] border border-white/40 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8B5CF6] flex items-center justify-center text-white">
                <Icon className="w-4 h-4" />
              </div>
            </div>
          )}
          <div>
            <h3 className="font-display font-bold text-lg text-[#111827] tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#6B7280] font-semibold">{subtitle}</p>
            )}
          </div>
        </div>

        {action && <div>{action}</div>}
      </div>

      <div className="relative z-10 w-full">
        {children}
      </div>
    </motion.div>
  );
};
