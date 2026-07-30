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
        bg-white/94 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
        rounded-[32px] p-7
        border-2 border-[#3B82F6]
        shadow-[0_20px_40px_rgba(59,130,246,0.18),0_8px_16px_rgba(0,0,0,0.03),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)]
        hover:shadow-[0_28px_50px_rgba(59,130,246,0.25),0_12px_24px_rgba(0,0,0,0.05),inset_0_2px_5px_0_rgba(255,255,255,1),inset_0_-5px_10px_0_rgba(219,234,254,0.8)]
        space-y-6
        transition-all duration-300
        ${className}
      `}
    >
      {/* Specular Top Reflection Layer */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-0 opacity-60"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 100%)'
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-[0_6px_16px_rgba(59,130,246,0.18),inset_0_2px_3px_rgba(255,255,255,1)] border border-white flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-white shadow-inner">
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
          <div>
            <h3 className="font-display font-bold text-lg text-[#0F172A] tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#475569] font-semibold">{subtitle}</p>
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
