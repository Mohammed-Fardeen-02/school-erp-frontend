import React from 'react';
import { StatsCard } from '@/components/data-display/stats-card';

export interface AdminStatItem {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface AdminStatsRowProps {
  stats: AdminStatItem[];
}

export const AdminStatsRow: React.FC<AdminStatsRowProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <StatsCard
          key={idx}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  );
};
