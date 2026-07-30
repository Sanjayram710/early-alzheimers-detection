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
      bg-white text-[#0F172A] border border-white
      shadow-[0_8px_20px_rgba(59,130,246,0.10),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(219,234,254,0.6)]
      hover:bg-[#F8FAFC] hover:shadow-[0_12px_28px_rgba(59,130,246,0.16)]
    `,
    primary: `
      bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]
      text-white font-extrabold border border-white/60
      shadow-[0_8px_24px_rgba(59,130,246,0.30),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-3px_6px_rgba(0,0,0,0.15)]
      hover:shadow-[0_12px_32px_rgba(59,130,246,0.40)]
    `,
    secondary: `
      bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE]
      text-[#2563EB] font-extrabold border border-white
      shadow-[inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(191,219,254,0.8),0_4px_12px_rgba(59,130,246,0.12)]
      hover:shadow-[0_8px_20px_rgba(59,130,246,0.20)]
    `,
    accent: `
      bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]
      text-white font-extrabold border border-white/60
      shadow-[0_8px_24px_rgba(139,92,246,0.30),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-3px_6px_rgba(0,0,0,0.15)]
      hover:shadow-[0_12px_32px_rgba(139,92,246,0.40)]
    `,
    danger: `
      bg-gradient-to-r from-[#EF4444] to-[#F87171]
      text-white font-extrabold border border-white/60
      shadow-[0_8px_24px_rgba(239,68,68,0.30),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-3px_6px_rgba(0,0,0,0.15)]
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
      {/* Glare Reflection */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-0 opacity-50"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.70) 0%, rgba(255, 255, 255, 0) 100%)'
        }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
        <span>{children}</span>
      </span>
    </motion.button>
  );
};
