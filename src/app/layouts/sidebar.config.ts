import * as React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Receipt,
  Users,
  FileSpreadsheet,
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

export interface WorkspaceModuleSidebarConfig {
  moduleKey: string;
  moduleName: string;
  moduleIcon: React.ElementType;
  moduleDescription: string;
  badge?: string;
  items: SidebarItem[];
}

// ==========================================
// 1. Administration & Access Workspace
// 7 core features as the primary items
// ==========================================
export const adminSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'admin',
  moduleName: 'Administration',
  moduleIcon: ShieldCheck,
  moduleDescription: 'Central Administration Panel',
  items: [
    {
      label: 'Admin Hub Overview',
      href: '/admin',
      icon: LayoutDashboard,
      permission: 'settings.roles_permissions.rbac.view',
    },
    {
      label: 'Organization Management',
      href: '/admin/organizations',
      icon: Building2,
      permission: 'organizations.manage',
    },
    {
      label: 'User Management',
      href: '/admin/users',
      icon: Users,
      permission: 'settings.user_assignments.allocations.view',
    },
    {
      label: 'Roles & Permissions',
      href: '/admin/roles',
      icon: KeyRound,
      permission: 'settings.roles_permissions.rbac.view',
    },
    {
      label: 'Authentication & Security',
      href: '/admin/security',
      icon: Lock,
      permission: 'settings.roles_permissions.rbac.view',
    },
    {
      label: 'Subscriptions & Billing',
      href: '/admin/billing',
      icon: CreditCard,
      permission: 'organizations.manage',
    },
    {
      label: 'Plans & Entitlements',
      href: '/admin/plans',
      icon: Sliders,
      permission: 'organizations.manage',
    },
    {
      label: 'Audit & Activity Logs',
      href: '/admin/audit-logs',
      icon: History,
      permission: 'settings.roles_permissions.rbac.view',
    },
  ],
};

// ==========================================
// 2. Academics Workspace
// ==========================================
export const academicsSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'academics',
  moduleName: 'Academics',
  moduleIcon: BookOpen,
  moduleDescription: 'Curriculum & Classes',
  items: [
    {
      label: 'Classes & Sections',
      href: '/app/academics/classes',
      icon: GraduationCap,
      moduleId: 'academics',
    },
    {
      label: 'Curriculum & Subjects',
      href: '/app/academics/subjects',
      icon: BookOpen,
      moduleId: 'academics',
    },
    {
      label: 'Lesson Plans',
      href: '/app/academics/lessons',
      icon: FileSpreadsheet,
      moduleId: 'academics',
    },
    {
      label: 'Class Timetable',
      href: '/app/academics/timetable',
      icon: CalendarCheck,
      moduleId: 'academics',
    },
    {
      label: 'Academic Calendar',
      href: '/app/academics/calendar',
      icon: CalendarCheck,
      moduleId: 'academics',
    },
  ],
};

// ==========================================
// 3. Teachers & Staff Workspace
// ==========================================
export const staffSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'staff',
  moduleName: 'Teachers & Staff',
  moduleIcon: Users,
  moduleDescription: 'Faculty & Human Resources',
  items: [
    {
      label: 'Staff Directory',
      href: '/app/staff',
      icon: Users,
      moduleId: 'staff',
    },
    {
      label: 'Subject Allocations',
      href: '/app/staff/allocations',
      icon: BookOpen,
      moduleId: 'staff',
    },
    {
      label: 'Staff Leaves & Approvals',
      href: '/app/staff/leaves',
      icon: CalendarCheck,
      moduleId: 'staff',
    },
    {
      label: 'Attendance & Bio-logs',
      href: '/app/staff/attendance',
      icon: CalendarCheck,
      moduleId: 'staff',
    },
    {
      label: 'Department Rosters',
      href: '/app/staff/departments',
      icon: Building2,
      moduleId: 'staff',
    },
  ],
};

// ==========================================
// 4. Students Workspace
// ==========================================
export const studentsSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'students',
  moduleName: 'Students',
  moduleIcon: GraduationCap,
  moduleDescription: 'Admissions & Student Roster',
  items: [
    {
      label: 'Student Directory',
      href: '/app/students',
      icon: GraduationCap,
      moduleId: 'students',
    },
    {
      label: 'Admissions Pipeline',
      href: '/app/students/admissions',
      icon: FileSpreadsheet,
      moduleId: 'students',
    },
    {
      label: 'Guardians & Contacts',
      href: '/app/students/guardians',
      icon: Users,
      moduleId: 'students',
    },
    {
      label: 'Transfers & Records',
      href: '/app/students/transfers',
      icon: History,
      moduleId: 'students',
    },
  ],
};

// ==========================================
// 5. Fees & Finance Workspace
// ==========================================
export const feesSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'fees',
  moduleName: 'Fees & Finance',
  moduleIcon: Receipt,
  moduleDescription: 'Billing, Invoices & Collections',
  items: [
    {
      label: 'Fee Invoices',
      href: '/app/fees',
      icon: Receipt,
      moduleId: 'fees',
    },
    {
      label: 'Fee Structures',
      href: '/app/fees/structures',
      icon: Sliders,
      moduleId: 'fees',
    },
    {
      label: 'Collection Receipts',
      href: '/app/fees/payments',
      icon: CreditCard,
      moduleId: 'fees',
    },
    {
      label: 'Defaulters & Dues',
      href: '/app/fees/defaulters',
      icon: History,
      moduleId: 'fees',
    },
  ],
};

// ==========================================
// 6. Attendance Workspace
// ==========================================
export const attendanceSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'attendance',
  moduleName: 'Attendance',
  moduleIcon: CalendarCheck,
  moduleDescription: 'Registers & Biometrics',
  items: [
    {
      label: 'Daily Registers',
      href: '/app/attendance',
      icon: CalendarCheck,
      moduleId: 'attendance',
    },
    {
      label: 'Biometric & RFID Logs',
      href: '/app/attendance/biometrics',
      icon: History,
      moduleId: 'attendance',
    },
    {
      label: 'Monthly Reports',
      href: '/app/attendance/reports',
      icon: FileSpreadsheet,
      moduleId: 'attendance',
    },
  ],
};

// ==========================================
// 7. Examinations Workspace
// ==========================================
export const examsSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'exams',
  moduleName: 'Examinations',
  moduleIcon: FileSpreadsheet,
  moduleDescription: 'Schedules & Gradebook',
  items: [
    {
      label: 'Exam Schedules',
      href: '/app/exams',
      icon: CalendarCheck,
      moduleId: 'exams',
    },
    {
      label: 'Marks & Gradebook',
      href: '/app/exams/grades',
      icon: FileSpreadsheet,
      moduleId: 'exams',
    },
    {
      label: 'Report Cards & Results',
      href: '/app/exams/reports',
      icon: GraduationCap,
      moduleId: 'exams',
    },
  ],
};

// ==========================================
// Default / All Workspaces Root Overview
// ==========================================
export const overviewSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'workspace-overview',
  moduleName: 'School ERP',
  moduleIcon: LayoutDashboard,
  moduleDescription: 'Enterprise Academic',
  items: [
    {
      label: 'Workspace Overview',
      href: '/workspace',
      icon: LayoutDashboard,
    },
    {
      label: 'Administration',
      href: '/admin',
      icon: ShieldCheck,
      permission: 'settings.roles_permissions.rbac.view',
    },
    {
      label: 'Academics',
      href: '/app/academics',
      icon: BookOpen,
      moduleId: 'academics',
    },
    {
      label: 'Teachers & Staff',
      href: '/app/staff',
      icon: Users,
      moduleId: 'staff',
    },
    {
      label: 'Students',
      href: '/app/students',
      icon: GraduationCap,
      moduleId: 'students',
    },
    {
      label: 'Fees & Finance',
      href: '/app/fees',
      icon: Receipt,
      moduleId: 'fees',
    },
    {
      label: 'Attendance',
      href: '/app/attendance',
      icon: CalendarCheck,
      moduleId: 'attendance',
    },
    {
      label: 'Examinations',
      href: '/app/exams',
      icon: FileSpreadsheet,
      moduleId: 'exams',
    },
  ],
};

/**
 * Resolves the active modular sidebar configuration based on the current URL pathname.
 */
export function getSidebarConfigForPath(pathname: string): WorkspaceModuleSidebarConfig {
  if (pathname.startsWith('/admin')) {
    return adminSidebarConfig;
  }
  if (pathname.startsWith('/app/academics')) {
    return academicsSidebarConfig;
  }
  if (pathname.startsWith('/app/staff')) {
    return staffSidebarConfig;
  }
  if (pathname.startsWith('/app/students')) {
    return studentsSidebarConfig;
  }
  if (pathname.startsWith('/app/fees')) {
    return feesSidebarConfig;
  }
  if (pathname.startsWith('/app/attendance')) {
    return attendanceSidebarConfig;
  }
  if (pathname.startsWith('/app/exams')) {
    return examsSidebarConfig;
  }
  return overviewSidebarConfig;
}

// Backward-compatible default export
export const sidebarConfig = adminSidebarConfig.items;
