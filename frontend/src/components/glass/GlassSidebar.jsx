import React from 'react';
import { motion } from 'framer-motion';

export const GlassSidebar = ({
  children,
  className = '',
}) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
      className={`
        bg-white/55 backdrop-blur-[28px] -webkit-backdrop-blur-[28px]
        rounded-[28px] p-6
        border border-white/40
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        h-full space-y-6
        ${className}
      `}
    >
      {children}
    </motion.aside>
  );
};
