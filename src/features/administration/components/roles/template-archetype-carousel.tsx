import React from 'react';
import {
  GraduationCap,
  BookOpen,
  CreditCard,
  FileSpreadsheet,
  ShieldCheck,
  Sparkles,
  Check,
} from 'lucide-react';

export interface RoleArchetype {
  id: string;
  name: string;
  codePrefix: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  colorScheme: {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
  };
  recommendedPermissions: string[];
}

export const ROLE_ARCHETYPES: RoleArchetype[] = [
  {
    id: 'TEACHER',
    name: 'Classroom Teacher',
    codePrefix: 'TEACHER',
    description: 'Rosters access, daily morning/afternoon attendance marking, and grade entries.',
    icon: GraduationCap,
    badge: 'Faculty',
    colorScheme: {
      bg: 'hover:bg-emerald-500/5',
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
    },
    recommendedPermissions: [
      'academics.classes.view',
      'attendance.registers.view',
      'attendance.mark.edit',
      'exams.schedules.view',
      'exams.marks.entry',
    ],
  },
  {
    id: 'HOD',
    name: 'Department Head (HOD)',
    codePrefix: 'HOD',
    description: 'Curriculum oversight, faculty course planning, and student academic review.',
    icon: BookOpen,
    badge: 'Academic Lead',
    colorScheme: {
      bg: 'hover:bg-purple-500/5',
      border: 'border-purple-500/30',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-primary',
    },
    recommendedPermissions: [
      'academics.classes.view',
      'academics.curriculum.manage',
      'students.directory.view',
      'staff.directory.view',
      'staff.allocations.manage',
      'exams.schedules.view',
      'exams.marks.entry',
    ],
  },
  {
    id: 'BURSAR',
    name: 'Bursar & Finance Lead',
    codePrefix: 'BURSAR',
    description: 'Fee collection, receipt generation, invoice tracking, and concession discounts.',
    icon: CreditCard,
    badge: 'Finance',
    colorScheme: {
      bg: 'hover:bg-blue-500/5',
      border: 'border-blue-500/30',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
    },
    recommendedPermissions: [
      'fees.invoices.view',
      'fees.payments.collect',
      'fees.discounts.apply',
      'fees.structures.manage',
      'students.directory.view',
    ],
  },
  {
    id: 'EXAM_CONTROLLER',
    name: 'Examination Controller',
    codePrefix: 'EXAM_CONTROLLER',
    description: 'Midterm/final schedules, seating charts, grade moderation, and report cards.',
    icon: FileSpreadsheet,
    badge: 'Examinations',
    colorScheme: {
      bg: 'hover:bg-amber-500/5',
      border: 'border-amber-500/30',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
    },
    recommendedPermissions: [
      'exams.schedules.view',
      'exams.marks.entry',
      'exams.reports.publish',
      'academics.classes.view',
      'students.directory.view',
    ],
  },
  {
    id: 'PRINCIPAL',
    name: 'Campus Principal',
    codePrefix: 'PRINCIPAL',
    description: 'Comprehensive campus management across academics, staff, students, and events.',
    icon: ShieldCheck,
    badge: 'Executive',
    colorScheme: {
      bg: 'hover:bg-indigo-500/5',
      border: 'border-indigo-500/30',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-600',
    },
    recommendedPermissions: [
      'academics.classes.view',
      'academics.classes.create',
      'academics.classes.edit',
      'students.directory.view',
      'students.admissions.create',
      'attendance.registers.view',
      'staff.directory.view',
      'staff.leaves.approve',
      'fees.invoices.view',
      'exams.reports.publish',
    ],
  },
  {
    id: 'BLANK',
    name: 'Custom Blank Role',
    codePrefix: 'CUSTOM',
    description: 'Start with an empty permission matrix and build a unique role from scratch.',
    icon: Sparkles,
    badge: 'Empty Baseline',
    colorScheme: {
      bg: 'hover:bg-surface-muted/50',
      border: 'border-border',
      iconBg: 'bg-surface-muted',
      iconColor: 'text-muted-foreground',
    },
    recommendedPermissions: [],
  },
];

export interface TemplateArchetypeCarouselProps {
  selectedArchetypeId: string | null;
  onSelectArchetype: (archetype: RoleArchetype) => void;
}

export const TemplateArchetypeCarousel: React.FC<TemplateArchetypeCarouselProps> = ({
  selectedArchetypeId,
  onSelectArchetype,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Quick-Starter Role Archetypes</h3>
          <p className="text-xs text-muted-foreground">
            Select a verified template to pre-fill recommended capability bundles, or start blank.
          </p>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          {ROLE_ARCHETYPES.length} Presets Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ROLE_ARCHETYPES.map((archetype) => {
          const Icon = archetype.icon;
          const isSelected = selectedArchetypeId === archetype.id;

          return (
            <div
              key={archetype.id}
              onClick={() => onSelectArchetype(archetype)}
              className={`group cursor-pointer rounded-xl border p-3.5 transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                  : `border-border bg-surface ${archetype.colorScheme.bg} hover:border-primary/40 hover:shadow-xs`
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-primary text-white'
                        : `${archetype.colorScheme.iconBg} ${archetype.colorScheme.iconColor}`
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground bg-surface-muted px-2 py-0.5 rounded-full">
                      {archetype.badge}
                    </span>
                    {isSelected && (
                      <span className="h-4 w-4 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                  {archetype.name}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {archetype.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>Prefix: {archetype.codePrefix}</span>
                <span className="font-semibold text-primary">
                  {archetype.recommendedPermissions.length > 0
                    ? `${archetype.recommendedPermissions.length} Permissions`
                    : 'Blank'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
