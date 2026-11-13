import React from 'react';
import { StatsCard } from '@/components/data-display/stats-card';

export interface AdminStatItem {
  title: string;
  value: string | number;
  icon: React.ElementType | React.ReactNode;
  subtitle: string;
  color?: 'purple' | 'green' | 'blue' | 'slate' | 'indigo' | 'red' | 'orange' | 'rose';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface AdminStatsRowProps {
  stats: AdminStatItem[];
}

const DEFAULT_COLORS: ('green' | 'orange' | 'purple' | 'red')[] = [
  'green',
  'orange',
  'purple',
  'red',
];

export const AdminStatsRow: React.FC<AdminStatsRowProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <StatsCard
          key={idx}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          subtitle={stat.subtitle}
          color={stat.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
        />
      ))}
    </div>
  );
};
