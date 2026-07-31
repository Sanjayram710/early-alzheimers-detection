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
    sm: 'px-4 py-2 text-xs rounded-full gap-1.5 font-extrabold',
    md: 'px-6 py-2.5 text-sm rounded-full gap-2 font-extrabold',
    lg: 'px-8 py-3.5 text-base rounded-full gap-2.5 font-black',
  };

  const variantClasses = {
    normal: `
      bg-white/90 backdrop-blur-md text-[#0F172A] border-[1.5px] border-[#3B82F6]/65
      shadow-[0_4px_14px_rgba(59,130,246,0.12),inset_0_0_0_1px_rgba(255,255,255,0.4),inset_0_2px_3px_rgba(255,255,255,1)]
      hover:bg-white hover:border-[#3B82F6] hover:shadow-[0_0_16px_rgba(59,130,246,0.35),0_6px_20px_rgba(59,130,246,0.20)]
    `,
    primary: `
      bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]
      text-white font-black border-2 border-white/80
      shadow-[0_6px_20px_rgba(59,130,246,0.30),inset_0_2px_4px_rgba(255,255,255,0.7)]
      hover:shadow-[0_0_20px_rgba(59,130,246,0.45),0_10px_28px_rgba(59,130,246,0.40)]
    `,
    secondary: `
      bg-[#EFF6FF]/90 backdrop-blur-md text-[#2563EB] font-black border-[1.5px] border-[#3B82F6]/65
      shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),0_4px_12px_rgba(59,130,246,0.14)]
      hover:bg-[#DBEAFE] hover:border-[#3B82F6] hover:shadow-[0_0_16px_rgba(59,130,246,0.35),0_8px_20px_rgba(59,130,246,0.22)]
    `,
    accent: `
      bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]
      text-white font-black border-2 border-white/80
      shadow-[0_6px_20px_rgba(139,92,246,0.30),inset_0_2px_4px_rgba(255,255,255,0.7)]
      hover:shadow-[0_0_20px_rgba(139,92,246,0.45),0_10px_28px_rgba(139,92,246,0.40)]
    `,
    danger: `
      bg-gradient-to-r from-[#EF4444] to-[#F87171]
      text-white font-black border-2 border-white/80
      shadow-[0_6px_20px_rgba(239,68,68,0.30),inset_0_2px_4px_rgba(255,255,255,0.7)]
      hover:shadow-[0_0_20px_rgba(239,68,68,0.45),0_10px_28px_rgba(239,68,68,0.40)]
    `,
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98, y: 1 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        relative overflow-hidden inline-flex items-center justify-center
        transition-all duration-200 ease-in-out cursor-pointer select-none
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
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 100%)'
        }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
        <span>{children}</span>
      </span>
    </motion.button>
  );
};

