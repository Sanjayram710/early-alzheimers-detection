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
        <label className="block text-xs font-bold text-[#111827] ml-1 tracking-wide">
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-[#6D5EF5] pointer-events-none z-10">
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
            bg-white/12 backdrop-blur-[18px] -webkit-backdrop-blur-[18px]
            text-sm text-[#111827] placeholder-[#6B7280]/70 font-semibold
            shadow-inner
            border border-white/28
            focus:outline-none focus:border-[#6D5EF5] focus:bg-white/25 focus:ring-4 focus:ring-[#6D5EF5]/25
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
