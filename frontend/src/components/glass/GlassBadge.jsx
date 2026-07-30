import React from 'react';

export const GlassBadge = ({
  children,
  variant = 'info', // 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  icon: Icon,
  className = '',
}) => {
  const variantStyles = {
    info: 'bg-[#EEF4FF]/50 text-[#6D5EF5] border-white/50 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(109,94,245,0.12)]',
    success: 'bg-[#DCFCE7]/50 text-[#15803D] border-white/50 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(34,197,94,0.12)]',
    warning: 'bg-[#FEF3C7]/50 text-[#B45309] border-white/50 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(245,158,11,0.12)]',
    danger: 'bg-[#FEE2E2]/50 text-[#B91C1C] border-white/50 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(239,68,68,0.12)]',
    neutral: 'bg-white/25 text-[#111827] border-white/40 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.5),0_4px_12px_rgba(31,38,135,0.06)]',
  };

  return (
    <span
      className={`
        inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold
        backdrop-blur-[15px] -webkit-backdrop-blur-[15px] border
        ${variantStyles[variant] || variantStyles.info}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
};
