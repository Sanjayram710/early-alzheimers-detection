import React from 'react';
import { GlassStatCard } from './glass/GlassStatCard';

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend, trendPositive = true, color = 'purple' }) => {
  return (
    <GlassStatCard
      title={title}
      value={value}
      subtitle={subtitle}
      icon={Icon}
      trend={trend}
      trendPositive={trendPositive}
      color={color}
    />
  );
};
