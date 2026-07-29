import React from 'react';

export const ClayInput = ({
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
        <label className="block text-xs font-semibold text-[#1F2937] ml-1 tracking-wide">
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-[#6B7280] pointer-events-none">
            <Icon className="w-4 h-4 text-[#6D5EF5]" />
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full py-3.5 rounded-[22px]
            ${Icon ? 'pl-11 pr-4' : 'px-5'}
            bg-[#F4F6FB]
            text-sm text-[#1F2937] placeholder-[#9CA3AF] font-medium
            shadow-[inset_4px_4px_8px_rgba(163,177,198,0.35),inset_-4px_-4px_8px_rgba(255,255,255,0.95)]
            border border-white/60
            focus:outline-none focus:border-[#6D5EF5] focus:ring-2 focus:ring-[#6D5EF5]/20
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-[#EF4444] font-medium ml-2">{error}</p>
      )}
    </div>
  );
};
