import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  radius = 'rounded-[32px]',
  padding = 'p-6 sm:p-8',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
      whileHover={hoverEffect ? { y: -4, scale: 1.005 } : {}}
      className={`
        relative overflow-hidden
        bg-white/92 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
        ${radius}
        ${padding}
        border border-white
        shadow-[0_20px_40px_rgba(59,130,246,0.10),0_8px_16px_rgba(0,0,0,0.03),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)]
        hover:shadow-[0_28px_50px_rgba(59,130,246,0.16),0_12px_24px_rgba(0,0,0,0.05),inset_0_2px_5px_0_rgba(255,255,255,1),inset_0_-5px_10px_0_rgba(219,234,254,0.8)]
        transition-all duration-300
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
