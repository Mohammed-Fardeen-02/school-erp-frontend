import * as React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Receipt,
  Users,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  Activity,
  Building2,
} from 'lucide-react';

export interface SidebarSubItem {
  label: string;
  href: string;
  icon?: React.ElementType;
  badge?: string;
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  platformOnly?: boolean;
  children?: SidebarSubItem[];
}

export const sidebarConfig: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Students',
    href: '/students',
    icon: GraduationCap,
    children: [
      { label: 'Student Directory', href: '/students' },
      { label: 'Admissions & Enrollment', href: '/students/admissions' },
      { label: 'Guardians & Contacts', href: '/students/guardians' },
    ],
  },
  {
    label: 'Academics',
    href: '/academics',
    icon: BookOpen,
    children: [
      { label: 'Classes & Sections', href: '/academics/classes' },
      { label: 'Subjects & Curriculum', href: '/academics/subjects' },
      { label: 'Class Timetable', href: '/academics/timetable' },
    ],
  },
  {
    label: 'Attendance',
    href: '/attendance',
    icon: CalendarCheck,
    children: [
      { label: 'Daily Attendance', href: '/attendance' },
      { label: 'Attendance Reports', href: '/attendance/reports' },
    ],
  },
  {
    label: 'Fees & Finance',
    href: '/fees',
    icon: Receipt,
    children: [
      { label: 'Fee Invoices', href: '/fees' },
      { label: 'Fee Structures', href: '/fees/structures' },
      { label: 'Payment Receipts', href: '/fees/payments' },
    ],
  },
  {
    label: 'Staff & Teachers',
    href: '/staff',
    icon: Users,
    children: [
      { label: 'Staff Directory', href: '/staff' },
      { label: 'Teacher Allocations', href: '/staff/allocations' },
      { label: 'Leave Requests', href: '/staff/leaves' },
    ],
  },
  {
    label: 'Examinations',
    href: '/exams',
    icon: FileSpreadsheet,
    children: [
      { label: 'Exam Schedules', href: '/exams' },
      { label: 'Gradebook & Marks', href: '/exams/gradebook' },
    ],
  },
  {
    label: 'School Settings',
    href: '/settings',
    icon: Settings,
    children: [
      { label: 'School Profile', href: '/settings' },
      { label: 'Academic Years', href: '/settings/academic-years' },
      { label: 'Roles & Security', href: '/settings/roles' },
    ],
  },
  {
    label: 'Multi-Tenant Admin',
    href: '/admin',
    icon: ShieldCheck,
    platformOnly: true,
    children: [
      { label: 'Schools Overview', href: '/admin/overview', icon: Activity },
      { label: 'Tenant Provisioning', href: '/admin/tenants', icon: Building2 },
    ],
  },
];
