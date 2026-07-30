import React from 'react';

export const GlassInput = ({
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-semibold text-[#475569] ml-1 tracking-wide">
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-[#3B82F6] pointer-events-none z-10">
            <Icon className="w-4 h-4 text-[#3B82F6]" />
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full py-3.5 rounded-[20px]
            ${Icon ? 'pl-11 pr-4' : 'px-5'}
            bg-[#F1F5F9]/80 backdrop-blur-[15px] -webkit-backdrop-blur-[15px]
            text-sm text-[#0F172A] placeholder-[#64748B] font-semibold
            shadow-[inset_0_3px_6px_rgba(0,0,0,0.06),inset_0_-1px_2px_rgba(255,255,255,0.9),0_2px_8px_rgba(59,130,246,0.05)]
            border border-white/90
            focus:outline-none focus:border-[#3B82F6] focus:bg-white focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_0_16px_rgba(59,130,246,0.30)]
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-[#EF4444] font-bold ml-2">{error}</p>
      )}
    </div>
  );
};
