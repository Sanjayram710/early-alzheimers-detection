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
      bg-white/20 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
      text-[#111827]
      border border-white/40
      shadow-[0_4px_16px_rgba(31,38,135,0.08)]
      hover:bg-white/35 hover:shadow-[0_8px_24px_rgba(79,142,247,0.20)]
      hover:border-white/60
    `,
    primary: `
      bg-gradient-to-r from-[#4F8EF7] to-[#6D5EF5]
      text-white font-extrabold
      border border-white/40
      shadow-[0_6px_22px_rgba(79,142,247,0.38)]
      hover:shadow-[0_12px_30px_rgba(79,142,247,0.50)]
      hover:from-[#3B7DE8] hover:to-[#5B4CE5]
    `,
    secondary: `
      bg-white/22 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
      text-[#4F8EF7] font-extrabold
      border border-white/50
      shadow-[0_4px_16px_rgba(79,142,247,0.15)]
      hover:bg-white/40 hover:shadow-[0_8px_24px_rgba(79,142,247,0.25)]
    `,
    accent: `
      bg-gradient-to-r from-[#6D5EF5] to-[#7C6CFF]
      text-white font-extrabold
      border border-white/40
      shadow-[0_6px_22px_rgba(109,94,245,0.38)]
      hover:shadow-[0_12px_30px_rgba(109,94,245,0.50)]
    `,
    danger: `
      bg-gradient-to-r from-[#EF4444] to-[#F87171]
      text-white font-extrabold
      border border-white/40
      shadow-[0_6px_22px_rgba(239,68,68,0.35)]
    `,
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.97, y: 1 } : {}}
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
      {/* Specular Glass Light Reflection */}
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
