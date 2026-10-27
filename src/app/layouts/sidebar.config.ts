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
  moduleId?: string;
  badge?: string;
  platformOnly?: boolean;
  children?: SidebarSubItem[];
}

export const sidebarConfig: SidebarItem[] = [
  {
    label: 'Workspace Overview',
    href: '/workspace',
    icon: LayoutDashboard,
  },
  {
    label: 'Academics',
    href: '/app/academics',
    icon: BookOpen,
    moduleId: 'academics',
    children: [
      { label: 'Classes & Sections', href: '/app/academics/classes' },
      { label: 'Curriculum & Subjects', href: '/app/academics/subjects' },
      { label: 'Class Timetable', href: '/app/academics/timetable' },
    ],
  },
  {
    label: 'Students',
    href: '/app/students',
    icon: GraduationCap,
    moduleId: 'students',
    children: [
      { label: 'Student Directory', href: '/app/students' },
      { label: 'Admissions & Intake', href: '/app/students/admissions' },
      { label: 'Guardians & Contacts', href: '/app/students/guardians' },
    ],
  },
  {
    label: 'Attendance',
    href: '/app/attendance',
    icon: CalendarCheck,
    moduleId: 'attendance',
    children: [
      { label: 'Daily Registers', href: '/app/attendance' },
      { label: 'Attendance Reports', href: '/app/attendance/reports' },
    ],
  },
  {
    label: 'Fees & Finance',
    href: '/app/fees',
    icon: Receipt,
    moduleId: 'fees',
    children: [
      { label: 'Fee Invoices', href: '/app/fees' },
      { label: 'Fee Structures', href: '/app/fees/structures' },
      { label: 'Payment Receipts', href: '/app/fees/payments' },
    ],
  },
  {
    label: 'Staff & Faculty',
    href: '/app/staff',
    icon: Users,
    moduleId: 'staff',
    children: [
      { label: 'Staff Directory', href: '/app/staff' },
      { label: 'Subject Allocations', href: '/app/staff/allocations' },
      { label: 'Staff Leaves', href: '/app/staff/leaves' },
    ],
  },
  {
    label: 'Examinations',
    href: '/app/exams',
    icon: FileSpreadsheet,
    moduleId: 'exams',
    children: [
      { label: 'Exam Schedules', href: '/app/exams' },
      { label: 'Marks & Gradebook', href: '/app/exams/grades' },
    ],
  },
  {
    label: 'School Settings',
    href: '/app/settings',
    icon: Settings,
    moduleId: 'settings',
    children: [
      { label: 'School Profile', href: '/app/settings' },
      { label: 'Academic Years', href: '/app/settings/academic-years' },
      { label: 'Roles & Security', href: '/app/settings/roles' },
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
