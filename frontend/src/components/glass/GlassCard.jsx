import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  radius = 'rounded-[28px]',
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
        bg-white/18 backdrop-blur-[30px] -webkit-backdrop-blur-[30px]
        ${radius}
        ${padding}
        border border-white/35
        shadow-[0_8px_32px_rgba(31,38,135,0.10),0_20px_60px_rgba(0,0,0,0.05)]
        hover:shadow-[0_20px_50px_rgba(109,94,245,0.18),0_25px_70px_rgba(0,0,0,0.08)]
        hover:bg-white/28 hover:border-white/50
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {/* Apple Glass Reflection Sheen */}
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
