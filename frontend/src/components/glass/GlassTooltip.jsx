import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const GlassTooltip = ({ text, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && text && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 whitespace-nowrap pointer-events-none
              bg-white/85 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
              text-[#111827] text-xs font-bold px-3 py-1.5 rounded-full
              border border-white/60 shadow-[0_8px_24px_rgba(17,24,39,0.12)]
              ${positionClasses[position] || positionClasses.top}
            `}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
