import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  radius = 'rounded-[24px]',
  padding = 'p-6',
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
        bg-white/45 backdrop-blur-[30px] -webkit-backdrop-blur-[30px]
        ${radius}
        ${padding}
        border border-white/65
        shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.8),0_20px_40px_rgba(0,0,0,0.06)]
        hover:shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.9),0_25px_50px_rgba(94,162,255,0.20)]
        hover:bg-white/55 hover:border-white/80
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {/* Inner Reflection Layer */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 100%)'
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
