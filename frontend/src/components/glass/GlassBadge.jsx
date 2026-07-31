import React from 'react';

export const GlassBadge = ({
  children,
  variant = 'info', // 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing' | 'completed' | 'failed'
  icon: Icon,
  className = '',
}) => {
  const variantStyles = {
    info: 'bg-[#EFF6FF]/60 text-[#2563EB] border-[#93C5FD]/80 shadow-[0_2px_8px_rgba(59,130,246,0.18),inset_0_1px_1px_rgba(255,255,255,0.7)]',
    processing: 'bg-[#DBEAFE]/60 text-[#1E40AF] border-[#60A5FA]/80 shadow-[0_2px_8px_rgba(59,130,246,0.22),inset_0_1px_1px_rgba(255,255,255,0.7)] animate-pulse',
    success: 'bg-[#DCFCE7]/60 text-[#15803D] border-[#86EFAC]/80 shadow-[0_2px_8px_rgba(34,197,94,0.20),inset_0_1px_1px_rgba(255,255,255,0.7)]',
    completed: 'bg-[#DCFCE7]/60 text-[#15803D] border-[#86EFAC]/80 shadow-[0_2px_8px_rgba(34,197,94,0.20),inset_0_1px_1px_rgba(255,255,255,0.7)]',
    warning: 'bg-[#FEF3C7]/60 text-[#92400E] border-[#FDE68A]/80 shadow-[0_2px_8px_rgba(245,158,11,0.20),inset_0_1px_1px_rgba(255,255,255,0.7)]',
    danger: 'bg-[#FEE2E2]/60 text-[#991B1B] border-[#FCA5A5]/80 shadow-[0_2px_8px_rgba(239,68,68,0.20),inset_0_1px_1px_rgba(255,255,255,0.7)]',
    failed: 'bg-[#FEE2E2]/60 text-[#991B1B] border-[#FCA5A5]/80 shadow-[0_2px_8px_rgba(239,68,68,0.20),inset_0_1px_1px_rgba(255,255,255,0.7)]',
    neutral: 'bg-white/40 text-[#1E293B] border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.6)]',
  };

  return (
    <span
      className={`
        inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold
        backdrop-blur-md -webkit-backdrop-blur-md border
        transition-all duration-250 ease-in-out
        ${variantStyles[variant] || variantStyles.info}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

