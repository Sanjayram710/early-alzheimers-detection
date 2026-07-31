import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  hierarchy = 'primary', // 'primary' (2px border) | 'secondary' (1px border)
  accent = 'blue', // 'blue' | 'green' | 'purple' | 'cyan' | 'emerald' | 'amber' | 'red'
  radius = 'rounded-[24px]',
  padding = 'p-6 sm:p-8',
  ...props
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
      transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
      whileHover={hoverEffect ? { y: -4 } : {}}
      className={`
        relative overflow-hidden
        bg-white/94 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
        ${radius}
        ${padding}
        ${borderWidth}
        ${accentBorders[accent] || accentBorders.blue}
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_8px_24px_rgba(59,130,246,0.08),0_2px_8px_rgba(59,130,246,0.05),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)]
        hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.50),0_12px_32px_rgba(59,130,246,0.16),0_4px_12px_rgba(59,130,246,0.10),inset_0_2px_5px_0_rgba(255,255,255,1),inset_0_-5px_10px_0_rgba(219,234,254,0.8)]
        transition-all duration-250 ease-in-out
        ${className}
      `}
      {...props}
    >
      {/* Inflated Clay Glare Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-0 opacity-60"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.80) 0%, rgba(255, 255, 255, 0) 100%)'
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

