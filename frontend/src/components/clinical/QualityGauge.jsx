import React from 'react';
import { motion } from 'framer-motion';

export const QualityGauge = ({ score = 92, rating = 'Excellent', size = 160 }) => {
  const numericScore = Math.min(100, Math.max(0, Number(score) || 0));

  // Determine dynamic color based on score thresholds
  const getColorScheme = (val) => {
    if (val >= 90) {
      return {
        stroke: '#22C55E',
        gradientFrom: '#22C55E',
        gradientTo: '#4ADE80',
        text: 'text-[#15803D]',
        bgBadge: 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]',
        glow: 'rgba(34, 197, 94, 0.35)',
      };
    }
    if (val >= 75) {
      return {
        stroke: '#3B82F6',
        gradientFrom: '#3B82F6',
        gradientTo: '#60A5FA',
        text: 'text-[#1D4ED8]',
        bgBadge: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]',
        glow: 'rgba(59, 130, 246, 0.35)',
      };
    }
    if (val >= 50) {
      return {
        stroke: '#F59E0B',
        gradientFrom: '#F59E0B',
        gradientTo: '#FBBF24',
        text: 'text-[#B45309]',
        bgBadge: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
        glow: 'rgba(245, 158, 11, 0.35)',
      };
    }
    return {
      stroke: '#EF4444',
      gradientFrom: '#EF4444',
      gradientTo: '#F87171',
      text: 'text-[#B91C1C]',
      bgBadge: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]',
      glow: 'rgba(239, 68, 68, 0.35)',
    };
  };

  const scheme = getColorScheme(numericScore);

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numericScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* SVG Circular Progress Bar */}
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={`gaugeGradient-${numericScore}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={scheme.gradientFrom} />
              <stop offset="100%" stopColor={scheme.gradientTo} />
            </linearGradient>
            <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={scheme.glow} />
            </filter>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-70"
          />

          {/* Animated Gauge Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gaugeGradient-${numericScore})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            filter="url(#gaugeShadow)"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-none">
            {Math.round(numericScore)}
          </span>
          <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mt-1">
            Quality Index
          </span>
        </div>
      </div>

      {/* Qualitative Rating Pill */}
      <div className={`mt-3 px-4 py-1.5 rounded-full border text-xs font-extrabold shadow-2xs ${scheme.bgBadge}`}>
        {rating || 'Acceptable'}
      </div>
    </div>
  );
};
