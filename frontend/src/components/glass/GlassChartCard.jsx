import React from 'react';
import { motion } from 'framer-motion';

export const GlassChartCard = ({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = '',
  hierarchy = 'primary', // 'primary' (2px) | 'secondary' (1px)
  accent = 'blue',
}) => {
  const accentBorders = {
    blue: 'border-[#3B82F6]/65 hover:border-[#3B82F6]',
    green: 'border-[#22C55E]/65 hover:border-[#22C55E]',
    purple: 'border-[#8B5CF6]/65 hover:border-[#8B5CF6]',
    cyan: 'border-[#06B6D4]/65 hover:border-[#06B6D4]',
    emerald: 'border-[#10B981]/65 hover:border-[#10B981]',
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
        space-y-6
        transition-all duration-250 ease-in-out
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
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-[0_6px_16px_rgba(59,130,246,0.18),inset_0_2px_3px_rgba(255,255,255,1)] border border-[#3B82F6]/40 flex items-center justify-center">
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

