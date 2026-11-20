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
  Settings,
  GitBranch,
  Clock,
  Bus,
  Library as LibraryIcon,
  Building,
  Bell,
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
// 10 operational core features
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
      label: 'Branches & Campuses',
      href: '/admin/branches',
      icon: GitBranch,
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
      label: 'Audit & Compliance Logs',
      href: '/admin/audit-logs',
      icon: History,
      permission: 'settings.audit_logs.trail.view',
    },
    {
      label: 'Tenant Configuration',
      href: '/admin/configuration',
      icon: Settings,
      permission: 'organizations.manage',
    },
  ],
};

// ==========================================
// 2. Academics Workspace
// Operational: Branches Master
// ==========================================
export const academicsSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'academics',
  moduleName: 'Academics & Curriculum',
  moduleIcon: BookOpen,
  moduleDescription: 'Curriculum & Classes (In Development)',
  badge: 'Soon',
  items: [
    {
      label: 'Branches Master',
      href: '/app/academics/branches',
      icon: GitBranch,
      permission: 'academics',
      moduleId: 'academics',
    },
    {
      label: 'Academics Overview',
      href: '/app/academics',
      icon: BookOpen,
      permission: 'academics',
      moduleId: 'academics',
      badge: 'Roadmap',
    },
  ],
};

// ==========================================
// 3. Students Workspace
// ==========================================
export const studentsSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'students',
  moduleName: 'Students & Admissions',
  moduleIcon: GraduationCap,
  moduleDescription: 'Student Directory & Admissions (In Development)',
  badge: 'Soon',
  items: [
    {
      label: 'Students Overview',
      href: '/app/students',
      icon: GraduationCap,
      permission: 'students',
      moduleId: 'students',
      badge: 'Roadmap',
    },
  ],
};

// ==========================================
// 4. Attendance Workspace
// ==========================================
export const attendanceSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'attendance',
  moduleName: 'Attendance & Registers',
  moduleIcon: CalendarCheck,
  moduleDescription: 'Registers & Biometrics (In Development)',
  badge: 'Soon',
  items: [
    {
      label: 'Attendance Overview',
      href: '/app/attendance',
      icon: CalendarCheck,
      permission: 'attendance',
      moduleId: 'attendance',
      badge: 'Roadmap',
    },
  ],
};

// ==========================================
// 5. Timetable Workspace
// ==========================================
export const timetableSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'timetable',
  moduleName: 'Timetable & Schedules',
  moduleIcon: Clock,
  moduleDescription: 'Weekly Schedules & Periods (In Development)',
  badge: 'Soon',
  items: [
    {
      label: 'Timetable Overview',
      href: '/app/timetable',
      icon: Clock,
      permission: 'timetable',
      moduleId: 'timetable',
      badge: 'Roadmap',
    },
  ],
};

// ==========================================
// 6. Examinations Workspace
// ==========================================
export const examsSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'exams',
  moduleName: 'Examinations & Marks',
  moduleIcon: FileSpreadsheet,
  moduleDescription: 'Schedules & Gradebook (In Development)',
  badge: 'Soon',
  items: [
    {
      label: 'Examinations Overview',
      href: '/app/exams',
      icon: FileSpreadsheet,
      permission: 'exams',
      moduleId: 'exams',
      badge: 'Roadmap',
    },
  ],
};

// ==========================================
// 7. Teachers & Staff Workspace
// ==========================================
export const staffSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'staff',
  moduleName: 'Staff & Faculty',
  moduleIcon: Users,
  moduleDescription: 'Faculty & Human Resources (In Development)',
  badge: 'Soon',
  items: [
    {
      label: 'Staff Overview',
      href: '/app/staff',
      icon: Users,
      permission: 'staff',
      moduleId: 'staff',
      badge: 'Roadmap',
    },
  ],
};

// ==========================================
// 8. Front Desk Workspace
// ==========================================
export const frontOfficeSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'front-office',
  moduleName: 'Front Desk & Reception',
  moduleIcon: Bell,
  moduleDescription: 'Visitor Management & Inquiries (In Development)',
  badge: 'Soon',
  items: [
    {
      label: 'Front Desk Overview',
      href: '/app/front-office',
      icon: Bell,
      permission: 'front_office',
      moduleId: 'front-office',
      badge: 'Roadmap',
    },
  ],
};

// ==========================================
// 9. Fees & Finance Workspace
// ==========================================
export const feesSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'fees',
  moduleName: 'Fees & Finance',
  moduleIcon: Receipt,
  moduleDescription: 'Billing, Invoices & Collections (In Development)',
  badge: 'Soon',
  items: [
    {
      label: 'Fees Overview',
      href: '/app/fees',
      icon: Receipt,
      permission: 'fees',
      moduleId: 'fees',
      badge: 'Roadmap',
    },
  ],
};

// ==========================================
// 10. Transport Workspace
// ==========================================
export const transportSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'transport',
  moduleName: 'Transport & Fleet',
  moduleIcon: Bus,
  moduleDescription: 'Routes, Fleet & Drivers (In Development)',
  badge: 'Soon',
  items: [
    {
      label: 'Transport Overview',
      href: '/app/transport',
      icon: Bus,
      permission: 'transport',
      moduleId: 'transport',
      badge: 'Roadmap',
    },
  ],
};

// ==========================================
// 11. Library Workspace
// ==========================================
export const librarySidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'library',
  moduleName: 'Library & Catalog',
  moduleIcon: LibraryIcon,
  moduleDescription: 'Book Catalog & Circulation (In Development)',
  badge: 'Soon',
  items: [
    {
      label: 'Library Overview',
      href: '/app/library',
      icon: LibraryIcon,
      permission: 'library',
      moduleId: 'library',
      badge: 'Roadmap',
    },
  ],
};

// ==========================================
// 12. Hostel & Housing Workspace
// ==========================================
export const hostelSidebarConfig: WorkspaceModuleSidebarConfig = {
  moduleKey: 'hostel',
  moduleName: 'Hostel & Housing',
  moduleIcon: Building,
  moduleDescription: 'Residence Halls & Rooms (In Development)',
  badge: 'Soon',
  items: [
    {
      label: 'Hostel Overview',
      href: '/app/hostel',
      icon: Building,
      permission: 'hostel',
      moduleId: 'hostel',
      badge: 'Roadmap',
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
      moduleId: 'settings',
      children: [
        {
          label: 'Organizations',
          href: '/admin/organizations',
          icon: Building2,
          permission: 'organizations.manage',
        },
        {
          label: 'Branches & Campuses',
          href: '/admin/branches',
          icon: GitBranch,
          permission: 'organizations.manage',
        },
        {
          label: 'Users',
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
      ],
    },
    {
      label: 'Academics',
      href: '/app/academics/branches',
      icon: BookOpen,
      moduleId: 'academics',
      permission: 'academics',
      children: [
        {
          label: 'Branches Master',
          href: '/app/academics/branches',
          icon: GitBranch,
          permission: 'academics',
        },
      ],
    },
    {
      label: 'Staff & HR',
      href: '/app/staff',
      icon: Users,
      moduleId: 'staff',
      permission: 'staff',
    },
    {
      label: 'Students',
      href: '/app/students',
      icon: GraduationCap,
      moduleId: 'students',
      permission: 'students',
    },
    {
      label: 'Fees & Finance',
      href: '/app/fees',
      icon: Receipt,
      moduleId: 'fees',
      permission: 'fees',
    },
    {
      label: 'Attendance',
      href: '/app/attendance',
      icon: CalendarCheck,
      moduleId: 'attendance',
      permission: 'attendance',
    },
    {
      label: 'Timetable',
      href: '/app/timetable',
      icon: Clock,
      moduleId: 'timetable',
      permission: 'timetable',
    },
    {
      label: 'Examinations',
      href: '/app/exams',
      icon: FileSpreadsheet,
      moduleId: 'exams',
      permission: 'exams',
    },
    {
      label: 'Front Desk',
      href: '/app/front-office',
      icon: Bell,
      moduleId: 'front-office',
      permission: 'front_office',
    },
    {
      label: 'Transport',
      href: '/app/transport',
      icon: Bus,
      moduleId: 'transport',
      permission: 'transport',
    },
    {
      label: 'Library',
      href: '/app/library',
      icon: LibraryIcon,
      moduleId: 'library',
      permission: 'library',
    },
    {
      label: 'Hostel',
      href: '/app/hostel',
      icon: Building,
      moduleId: 'hostel',
      permission: 'hostel',
    },
  ],
};

/**
 * Resolves the active modular sidebar configuration based on the current URL pathname.
 * Covers all 12 canonical modules.
 */
export function getSidebarConfigForPath(pathname: string): WorkspaceModuleSidebarConfig {
  if (pathname.startsWith('/admin') || pathname.startsWith('/settings')) {
    return adminSidebarConfig;
  }
  if (pathname.startsWith('/app/academics')) {
    return academicsSidebarConfig;
  }
  if (pathname.startsWith('/app/students')) {
    return studentsSidebarConfig;
  }
  if (pathname.startsWith('/app/attendance')) {
    return attendanceSidebarConfig;
  }
  if (pathname.startsWith('/app/timetable')) {
    return timetableSidebarConfig;
  }
  if (pathname.startsWith('/app/exams')) {
    return examsSidebarConfig;
  }
  if (pathname.startsWith('/app/staff')) {
    return staffSidebarConfig;
  }
  if (pathname.startsWith('/app/front-office')) {
    return frontOfficeSidebarConfig;
  }
  if (pathname.startsWith('/app/fees')) {
    return feesSidebarConfig;
  }
  if (pathname.startsWith('/app/transport')) {
    return transportSidebarConfig;
  }
  if (pathname.startsWith('/app/library')) {
    return librarySidebarConfig;
  }
  if (pathname.startsWith('/app/hostel')) {
    return hostelSidebarConfig;
  }
  return overviewSidebarConfig;
}

// Backward-compatible default export
export const sidebarConfig = adminSidebarConfig.items;
