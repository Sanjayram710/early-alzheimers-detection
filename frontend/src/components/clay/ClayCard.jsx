import React from 'react';
import { motion } from 'framer-motion';

export const ClayCard = ({
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
      whileHover={hoverEffect ? { y: -6, scale: 1.01 } : {}}
      className={`
        bg-gradient-to-br from-white to-[#EEF2FF]
        ${radius}
        ${padding}
        border border-white/60
        shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)]
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};
