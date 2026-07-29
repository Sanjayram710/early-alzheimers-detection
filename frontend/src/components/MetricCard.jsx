import React from 'react';
import { ClayStatCard } from './clay/ClayStatCard';

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'purple' }) => {
  return (
    <ClayStatCard
      title={title}
      value={value}
      subtitle={subtitle}
      icon={Icon}
      trend={trend}
      color={color}
    />
  );
};
