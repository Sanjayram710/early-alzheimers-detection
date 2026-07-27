import React from 'react';

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) => {
  const colorMap = {
    blue: 'from-blue-500/20 to-indigo-500/5 text-blue-400 border-blue-500/20',
    green: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/20',
    purple: 'from-purple-500/20 to-pink-500/5 text-purple-400 border-purple-500/20',
  };

  return (
    <div className={`glass-card glass-card-hover rounded-2xl p-5 border bg-gradient-to-br ${colorMap[color] || colorMap.blue}`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <span className="block font-display text-2xl sm:text-3xl font-bold text-white mt-1">{value}</span>
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 flex items-center justify-center border border-slate-800 shadow-inner">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {subtitle && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>{subtitle}</span>
          {trend && <span className="font-semibold text-emerald-400">{trend}</span>}
        </div>
      )}
    </div>
  );
};
