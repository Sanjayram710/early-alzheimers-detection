import React from 'react';
import { motion } from 'framer-motion';

export const ClayButton = ({
  children,
  variant = 'normal', // 'normal' | 'primary' | 'secondary' | 'accent' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs rounded-full gap-1.5',
    md: 'px-6 py-3 text-sm rounded-full gap-2 font-semibold',
    lg: 'px-8 py-3.5 text-base rounded-full gap-2.5 font-bold',
  };

  const variantClasses = {
    normal: `
      bg-gradient-to-br from-white to-[#E8ECF7]
      text-[#1F2937]
      border border-white/80
      shadow-[6px_6px_16px_rgba(163,177,198,0.35),-6px_-6px_14px_rgba(255,255,255,0.95)]
      hover:shadow-[8px_8px_20px_rgba(163,177,198,0.45),-8px_-8px_18px_rgba(255,255,255,1)]
    `,
    primary: `
      bg-gradient-to-br from-[#7C6EFA] to-[#5B4CE5]
      text-white
      border border-white/30
      shadow-[6px_6px_18px_rgba(109,94,245,0.4),-4px_-4px_12px_rgba(255,255,255,0.6)]
      hover:shadow-[8px_8px_22px_rgba(109,94,245,0.5),-5px_-5px_14px_rgba(255,255,255,0.8)]
    `,
    secondary: `
      bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF]
      text-[#6D5EF5]
      border border-white/70
      shadow-[6px_6px_16px_rgba(163,177,198,0.3),-6px_-6px_14px_rgba(255,255,255,0.95)]
      hover:shadow-[8px_8px_20px_rgba(109,94,245,0.25),-8px_-8px_18px_rgba(255,255,255,1)]
    `,
    accent: `
      bg-gradient-to-br from-[#8E82FF] to-[#6D5EF5]
      text-white
      border border-white/30
      shadow-[6px_6px_18px_rgba(142,130,255,0.4),-4px_-4px_12px_rgba(255,255,255,0.6)]
    `,
    danger: `
      bg-gradient-to-br from-[#FCA5A5] to-[#EF4444]
      text-white
      border border-white/30
      shadow-[6px_6px_18px_rgba(239,68,68,0.35),-4px_-4px_12px_rgba(255,255,255,0.6)]
    `,
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98, y: 1 } : {}}
      className={`
        inline-flex items-center justify-center
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.normal}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span>{children}</span>
    </motion.button>
  );
};
