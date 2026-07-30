import React from 'react';

export const GlassTable = ({
  headers = [],
  children,
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-separate border-spacing-y-2.5">
        <thead>
          <tr className="text-xs font-extrabold text-[#6B7280] uppercase tracking-wider">
            {headers.map((header, idx) => (
              <th key={idx} className="px-5 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-0">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const GlassTableRow = ({ children, className = '', onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white/20 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
        border border-white/35
        shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.5),0_4px_16px_rgba(31,38,135,0.06)]
        hover:bg-white/35 hover:border-white/50
        hover:shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.7),0_8px_24px_rgba(109,94,245,0.15)]
        hover:-translate-y-0.5
        transition-all duration-200
        rounded-[20px]
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </tr>
  );
};
