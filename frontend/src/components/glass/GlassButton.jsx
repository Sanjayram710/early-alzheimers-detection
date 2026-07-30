import React from 'react';
import { motion } from 'framer-motion';

export const GlassButton = ({
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
    sm: 'px-4 py-2 text-xs rounded-full gap-1.5 font-bold',
    md: 'px-6 py-3 text-sm rounded-full gap-2 font-bold',
    lg: 'px-8 py-3.5 text-base rounded-full gap-2.5 font-extrabold',
  };

  const variantClasses = {
    normal: `
      bg-white/40 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
      text-[#1D1D1F]
      border border-white
      shadow-[0_4px_16px_rgba(31,38,135,0.06)]
      hover:bg-white/55 hover:shadow-[0_8px_24px_rgba(94,162,255,0.20)]
    `,
    primary: `
      bg-gradient-to-r from-[#5EA2FF] to-[#7C6CFF]
      text-white font-extrabold
      border border-white/50
      shadow-[0_6px_22px_rgba(94,162,255,0.38)]
      hover:shadow-[0_10px_28px_rgba(94,162,255,0.45)]
      hover:from-[#4B93FF] hover:to-[#6C5BFF]
    `,
    secondary: `
      bg-white/40 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
      text-[#5EA2FF] font-extrabold
      border border-white
      shadow-[0_4px_16px_rgba(94,162,255,0.12)]
      hover:bg-white/60 hover:shadow-[0_8px_24px_rgba(94,162,255,0.22)]
    `,
    accent: `
      bg-gradient-to-r from-[#7C6CFF] to-[#5EA2FF]
      text-white font-extrabold
      border border-white/50
      shadow-[0_6px_22px_rgba(124,108,255,0.38)]
      hover:shadow-[0_10px_28px_rgba(124,108,255,0.45)]
    `,
    danger: `
      bg-gradient-to-r from-[#EF4444] to-[#F87171]
      text-white font-extrabold
      border border-white/50
      shadow-[0_6px_22px_rgba(239,68,68,0.35)]
    `,
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98, y: 1 } : {}}
      className={`
        relative overflow-hidden inline-flex items-center justify-center
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.normal}
        ${className}
      `}
      {...props}
    >
      {/* Specular Frosted Glass Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-0 opacity-50"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 100%)'
        }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
        <span>{children}</span>
      </span>
    </motion.button>
  );
};
