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
          <tr className="text-xs font-bold text-[#475569] uppercase tracking-[0.05em]">
            {headers.map((header, idx) => (
              <th key={idx} className="px-5 py-3 text-[#475569] font-bold tracking-[0.05em] uppercase">
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
        group relative transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        const isFirst = idx === 0;
        const isLast = idx === React.Children.count(children) - 1;
        
        return React.cloneElement(child, {
          className: `
            py-4 px-5 text-sm font-semibold transition-all duration-200
            bg-white/90 backdrop-blur-[15px]
            border-t border-b border-slate-200/70
            group-hover:bg-white group-hover:border-[#3B82F6]/50
            ${isFirst ? 'rounded-l-[20px] border-l border-slate-200/70 shadow-[inset_1.5px_1.5px_2px_rgba(255,255,255,1)]' : ''}
            ${isLast ? 'rounded-r-[20px] border-r border-slate-200/70 shadow-[inset_-1.5px_1.5px_2px_rgba(255,255,255,1)]' : ''}
            ${child.props.className || ''}
          `
        });
      })}
    </tr>
  );
};
