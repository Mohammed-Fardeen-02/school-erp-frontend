import * as React from 'react';
import {
  BookOpen,
  GraduationCap,
  CalendarCheck,
  Receipt,
  Users,
  FileSpreadsheet,
  Bell,
  Clock,
  Bus,
  Library,
  Building,
  ShieldCheck,
} from 'lucide-react';

export interface ModuleShortcut {
  label: string;
  href: string;
}

export interface ModuleConfig {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  icon?: React.ElementType;
  route: string;
  category: 'academic' | 'administrative' | 'financial' | 'campus-life';
  requiredPermission: string;
  isImplemented?: boolean;
  shortcuts?: ModuleShortcut[];
}

export const ERP_MODULES: ModuleConfig[] = [
  // 1. Academics
  {
    id: 'academics',
    name: 'Academics & Curriculum',
    shortName: 'Academics',
    description: 'Classes, sections, curriculum syllabi, lesson plans, and classroom timetables.',
    icon: BookOpen,
    route: '/app/academics/branches',
    category: 'academic',
    requiredPermission: 'academics',
    isImplemented: false,
    shortcuts: [
      { label: 'Branches Master', href: '/app/academics/branches' },
    ],
  },
  // 2. Students & Admissions
  {
    id: 'students',
    name: 'Students & Admissions',
    shortName: 'Students',
    description: 'Student directory, admissions pipeline, enrollment records, and guardians.',
    icon: GraduationCap,
    route: '/app/students',
    category: 'academic',
    requiredPermission: 'students',
    isImplemented: false,
    shortcuts: [
      { label: 'Student Directory', href: '/app/students' },
      { label: 'Admissions Pipeline', href: '/app/students' },
      { label: 'Guardians List', href: '/app/students' },
    ],
  },
  // 3. Attendance
  {
    id: 'attendance',
    name: 'Attendance & Registers',
    shortName: 'Attendance',
    description: 'Daily classroom registers, RFID biometric feeds, and attendance analytics.',
    icon: CalendarCheck,
    route: '/app/attendance',
    category: 'academic',
    requiredPermission: 'attendance',
    isImplemented: false,
    shortcuts: [
      { label: 'Daily Registers', href: '/app/attendance' },
      { label: 'Monthly Reports', href: '/app/attendance' },
      { label: 'Leave Requests', href: '/app/attendance' },
    ],
  },
  // 4. Fees & Finance
  {
    id: 'fees',
    name: 'Fees & Finance',
    shortName: 'Fees & Finance',
    description: 'Fee structures, invoices, online payment receipts, and automated fee reminders.',
    icon: Receipt,
    route: '/app/fees',
    category: 'financial',
    requiredPermission: 'fees',
    isImplemented: false,
    shortcuts: [
      { label: 'Fee Invoices', href: '/app/fees' },
      { label: 'Fee Structures', href: '/app/fees' },
      { label: 'Collection Receipts', href: '/app/fees' },
    ],
  },
  // 5. Staff & HR
  {
    id: 'staff',
    name: 'Staff & Faculty',
    shortName: 'Staff & HR',
    description: 'Faculty directory, subject allocations, staff leaves, and payroll records.',
    icon: Users,
    route: '/app/staff',
    category: 'administrative',
    requiredPermission: 'staff',
    isImplemented: false,
    shortcuts: [
      { label: 'Faculty Directory', href: '/app/staff' },
      { label: 'Subject Allocations', href: '/app/staff' },
      { label: 'Staff Leaves', href: '/app/staff' },
    ],
  },
  // 6. Examinations & Marks
  {
    id: 'exams',
    name: 'Examinations & Marks',
    shortName: 'Examinations',
    description: 'Exam scheduling, hall tickets, mark entries, grading rubrics, and report cards.',
    icon: FileSpreadsheet,
    route: '/app/exams',
    category: 'academic',
    requiredPermission: 'exams',
    isImplemented: false,
    shortcuts: [
      { label: 'Exam Schedules', href: '/app/exams' },
      { label: 'Gradebook Entries', href: '/app/exams' },
      { label: 'Report Cards', href: '/app/exams' },
    ],
  },
  // 7. Front Desk
  {
    id: 'front-office',
    name: 'Front Desk & Reception',
    shortName: 'Front Desk',
    description: 'Visitor management, student inquiries, postal dispatches, and reception logbooks.',
    icon: Bell,
    route: '/app/front-office',
    category: 'administrative',
    requiredPermission: 'front_office',
    isImplemented: false,
    shortcuts: [
      { label: 'Visitor Logs', href: '/app/front-office' },
      { label: 'General Inquiries', href: '/app/front-office' },
      { label: 'Postal Records', href: '/app/front-office' },
    ],
  },
  // 8. Timetable
  {
    id: 'timetable',
    name: 'Timetable & Schedules',
    shortName: 'Timetable',
    description: 'Automated weekly schedule builder, period allocations, and room clash detection.',
    icon: Clock,
    route: '/app/timetable',
    category: 'academic',
    requiredPermission: 'timetable',
    isImplemented: false,
    shortcuts: [
      { label: 'Weekly Schedule', href: '/app/timetable' },
      { label: 'Teacher Timetables', href: '/app/timetable' },
      { label: 'Room Allocations', href: '/app/timetable' },
    ],
  },
  // 9. Transport
  {
    id: 'transport',
    name: 'Transport & Fleet',
    shortName: 'Transport',
    description: 'School bus routes, pickup stops, vehicle GPS tracking, and driver directories.',
    icon: Bus,
    route: '/app/transport',
    category: 'campus-life',
    requiredPermission: 'transport',
    isImplemented: false,
    shortcuts: [
      { label: 'Bus Routes & Stops', href: '/app/transport' },
      { label: 'Vehicle Fleet', href: '/app/transport' },
      { label: 'Driver Contacts', href: '/app/transport' },
    ],
  },
  // 10. Library
  {
    id: 'library',
    name: 'Library & Catalog',
    shortName: 'Library',
    description: 'Book catalog, barcode circulation, issue/return desks, and overdue fine tracking.',
    icon: Library,
    route: '/app/library',
    category: 'campus-life',
    requiredPermission: 'library',
    isImplemented: false,
    shortcuts: [
      { label: 'Book Catalogue', href: '/app/library' },
      { label: 'Issue & Returns', href: '/app/library' },
      { label: 'Overdue Fines', href: '/app/library' },
    ],
  },
  // 11. Hostel & Housing
  {
    id: 'hostel',
    name: 'Hostel & Housing',
    shortName: 'Hostel',
    description: 'Campus residence halls, student room allocations, wardens, and mess timings.',
    icon: Building,
    route: '/app/hostel',
    category: 'campus-life',
    requiredPermission: 'hostel',
    isImplemented: false,
    shortcuts: [
      { label: 'Room Allocation', href: '/app/hostel' },
      { label: 'Hostel Rosters', href: '/app/hostel' },
      { label: 'Mess Schedule', href: '/app/hostel' },
    ],
  },
  // 12. Administration
  {
    id: 'settings',
    name: 'Administration',
    shortName: 'Administration',
    description: 'Centralized institutional management: organization profiles, campuses, user directory, RBAC permissions, security policies, cloud billing, and audit logs.',
    icon: ShieldCheck,
    route: '/admin',
    category: 'administrative',
    requiredPermission: 'settings',
    isImplemented: true,
    shortcuts: [
      { label: 'Organizations', href: '/admin/organizations' },
      { label: 'User Directory', href: '/admin/users' },
      { label: 'Roles & Permissions', href: '/admin/roles' },
      { label: 'Authentication & Security', href: '/admin/security' },
      { label: 'Subscriptions & Billing', href: '/admin/billing' },
      { label: 'Plans & Entitlements', href: '/admin/plans' },
      { label: 'Audit & Activity Logs', href: '/admin/audit-logs' },
    ],
  },
];

/**
 * Authoritative module-level permission evaluator.
 * A tenant user must satisfy effective RBAC permission conditions to access a module.
 *
 * Implements canonical Level 1 root node matching, alias resolution,
 * institutional administration capability aggregation, and hierarchical prefix inheritance.
 */
export function checkModulePermission(
  module: ModuleConfig,
  permissionsSet: Set<string> | undefined,
  checkPermission: (code: string) => boolean,
  isSuperAdmin: boolean
): boolean {
  // Platform super-admins possess universal administrative authority
  if (isSuperAdmin) {
    return true;
  }

  // Fail-closed security rule: unmapped or empty permission requirement is denied
  if (!module.requiredPermission) {
    return false;
  }

  // 1. Direct canonical permission check
  if (checkPermission(module.requiredPermission)) {
    return true;
  }

  // 2. Canonical alias resolution (e.g. front_office vs front-office)
  if (
    (module.requiredPermission === 'front_office' || module.requiredPermission === 'front-office') &&
    (checkPermission('front_office') || checkPermission('front-office'))
  ) {
    return true;
  }

  // 3. Institutional Administration module access through standard admin capabilities
  if (
    module.id === 'settings' &&
    (checkPermission('settings.roles_permissions.rbac.view') ||
      checkPermission('organizations.manage') ||
      checkPermission('settings.audit_logs.trail.view'))
  ) {
    return true;
  }

  // 4. Hierarchical prefix inheritance: check if user possesses any granular sub-capability
  if (permissionsSet && permissionsSet.size > 0) {
    const prefix = `${module.requiredPermission}.`;
    for (const perm of permissionsSet) {
      if (perm.startsWith(prefix)) {
        return true;
      }
    }
    if (module.id === 'front-office') {
      for (const perm of permissionsSet) {
        if (perm.startsWith('front_office.') || perm.startsWith('front-office.')) {
          return true;
        }
      }
    }
  }

  return false;
}

