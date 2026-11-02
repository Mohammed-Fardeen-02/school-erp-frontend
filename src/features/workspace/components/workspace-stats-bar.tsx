import * as React from 'react';
import { GraduationCap, Users, CalendarCheck, Receipt } from 'lucide-react';
import { StatsCard } from '@/components/data-display/stats-card';

export const WorkspaceStatsBar: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Enrolled Students"
        value="2,480"
        subtitle="+12% vs last term"
        color="purple"
        icon={GraduationCap}
      />
      <StatsCard
        title="Active Sections"
        value="48 Classes"
        subtitle="Grades 1 through 12"
        color="blue"
        icon={Users}
      />
      <StatsCard
        title="Today's Attendance"
        value="96.8%"
        subtitle="2,401 students present"
        color="green"
        icon={CalendarCheck}
      />
      <StatsCard
        title="Fee Collection Rate"
        value="89.4%"
        subtitle="Term target on track"
        color="orange"
        icon={Receipt}
      />
    </div>
  );
};
