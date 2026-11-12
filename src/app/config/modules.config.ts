import * as React from 'react';
import {
  BookOpen,
  GraduationCap,
  CalendarCheck,
  Receipt,
  Users,
  FileSpreadsheet,
  Settings,
  Bell,
  Clock,
  Bus,
  Library,
  Building,
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
  category: 'core' | 'academic' | 'administrative' | 'financial' | 'system';
  requiredPermission: string;
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
    route: '/app/academics',
    category: 'academic',
    requiredPermission: 'academics',
    shortcuts: [
      { label: 'Classes & Sections', href: '/app/academics' },
      { label: 'Curriculum Syllabi', href: '/app/academics' },
      { label: 'Lesson Plans', href: '/app/academics' },
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
    requiredPermission: 'front-office',
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
    category: 'core',
    requiredPermission: 'transport',
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
    category: 'core',
    requiredPermission: 'library',
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
    category: 'core',
    requiredPermission: 'hostel',
    shortcuts: [
      { label: 'Room Allocation', href: '/app/hostel' },
      { label: 'Hostel Rosters', href: '/app/hostel' },
      { label: 'Mess Schedule', href: '/app/hostel' },
    ],
  },
  // 12. Administration & Access Management
  {
    id: 'settings',
    name: 'Administration & Access',
    shortName: 'Admin & Access',
    description: 'Centralized administration workspace: organizations, user management, RBAC matrix, security, billing, and audit logs.',
    icon: Settings,
    route: '/admin',
    category: 'system',
    requiredPermission: 'settings',
    shortcuts: [
      { label: 'Organizations', href: '/admin/organizations' },
      { label: 'User Directory', href: '/admin/users' },
      { label: 'Roles & Matrix', href: '/admin/roles' },
      { label: 'Security & Sessions', href: '/admin/security' },
      { label: 'Subscriptions & Billing', href: '/admin/billing' },
      { label: 'Audit Trails', href: '/admin/audit-logs' },
    ],
  },
];
