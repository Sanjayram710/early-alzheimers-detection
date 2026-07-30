import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const GlassModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#111827]/35 backdrop-blur-lg"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
          className={`
            relative z-10 w-full ${maxWidth} overflow-hidden
            bg-white/30 backdrop-blur-[35px] -webkit-backdrop-blur-[35px]
            rounded-[32px] p-6 sm:p-8
            border border-white/45
            shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.7),0_25px_60px_rgba(31,38,135,0.22)]
            space-y-6
          `}
        >
          {/* Specular Top Reflection Layer */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-[inherit] z-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0) 100%)'
            }}
          />

          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/20">
            <h3 className="font-display font-bold text-xl text-[#111827]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/25 text-[#6B7280] hover:text-[#111827] hover:bg-white/40 shadow-sm transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative z-10">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
