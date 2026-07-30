import React from 'react';

export const GlassTable = ({
  headers = [],
  children,
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-xs font-bold text-[#475569] uppercase tracking-[0.05em]">
            {headers.map((header, idx) => (
              <th key={idx} className="px-5 py-3.5 text-[#475569] font-bold tracking-[0.05em] uppercase">
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
        bg-white/90 backdrop-blur-[20px] -webkit-backdrop-blur-[20px]
        border border-white
        shadow-[0_8px_20px_rgba(59,130,246,0.08),inset_0_1.5px_2px_0_rgba(255,255,255,1),inset_0_-2px_4px_0_rgba(219,234,254,0.6)]
        hover:bg-white hover:border-white
        hover:shadow-[0_16px_32px_rgba(59,130,246,0.14),inset_0_2px_3px_0_rgba(255,255,255,1),inset_0_-3px_6px_0_rgba(219,234,254,0.8)]
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
