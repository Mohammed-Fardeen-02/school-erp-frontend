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
  Building2,
  Lock,
  CreditCard,
  Sliders,
  History,
  KeyRound,
} from 'lucide-react';

export interface SidebarSubItem {
  label: string;
  href: string;
  icon?: React.ElementType;
  badge?: string;
  permission?: string;
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  moduleId?: string;
  permission?: string;
  badge?: string;
  children?: SidebarSubItem[];
}

export const sidebarConfig: SidebarItem[] = [
  {
    label: 'Workspace Overview',
    href: '/workspace',
    icon: LayoutDashboard,
  },
  {
    label: 'Administration & Access',
    href: '/admin',
    icon: ShieldCheck,
    permission: 'settings.roles_permissions.rbac.view',
    children: [
      { label: 'Admin Hub Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Organization Management', href: '/admin/organizations', permission: 'organizations.manage', icon: Building2 },
      { label: 'User Management', href: '/admin/users', permission: 'settings.user_assignments.allocations.view', icon: Users },
      { label: 'Roles & Permissions', href: '/admin/roles', permission: 'settings.roles_permissions.rbac.view', icon: KeyRound },
      { label: 'Authentication & Security', href: '/admin/security', permission: 'settings.roles_permissions.rbac.view', icon: Lock },
      { label: 'Subscriptions & Billing', href: '/admin/billing', permission: 'organizations.manage', icon: CreditCard },
      { label: 'Plans & Entitlements', href: '/admin/plans', permission: 'organizations.manage', icon: Sliders },
      { label: 'Audit & Activity Logs', href: '/admin/audit-logs', permission: 'settings.roles_permissions.rbac.view', icon: History },
    ],
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
      { label: 'Roles & Security', href: '/roles' },
    ],
  },
];
