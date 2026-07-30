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
        <label className="block text-xs font-bold text-[#1D1D1F] ml-1 tracking-wide">
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-[#5EA2FF] pointer-events-none z-10">
            <Icon className="w-4 h-4" />
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
            bg-white/55 backdrop-blur-[15px] -webkit-backdrop-blur-[15px]
            text-sm text-[#1D1D1F] placeholder-[#6B7280]/70 font-semibold
            shadow-[inset_0_2px_4px_rgba(0,0,0,0.03),inset_0_1px_1px_0_rgba(255,255,255,0.8)]
            border border-white/70
            focus:outline-none focus:border-[#5EA2FF] focus:bg-white/75 focus:shadow-[0_0_12px_rgba(94,162,255,0.50)]
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
