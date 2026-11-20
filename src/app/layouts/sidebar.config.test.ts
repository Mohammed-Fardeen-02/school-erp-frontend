import { describe, it, expect } from 'vitest';
import {
  getSidebarConfigForPath,
  adminSidebarConfig,
  academicsSidebarConfig,
  studentsSidebarConfig,
  attendanceSidebarConfig,
  timetableSidebarConfig,
  examsSidebarConfig,
  staffSidebarConfig,
  frontOfficeSidebarConfig,
  feesSidebarConfig,
  transportSidebarConfig,
  librarySidebarConfig,
  hostelSidebarConfig,
  overviewSidebarConfig,
} from './sidebar.config';

describe('Modular Workspace-Scoped Sidebar Configuration (Stage W1.2)', () => {
  // 1. All 12 Canonical Modules Resolve Their Dedicated Configurations
  describe('All 12 Canonical Modules Resolution', () => {
    it('1. resolves Administration config for /admin routes with 10 operational items', () => {
      const config = getSidebarConfigForPath('/admin/organizations');
      expect(config.moduleKey).toBe('admin');
      expect(config.moduleName).toBe('Administration');
      expect(config.items.length).toBe(10);

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Admin Hub Overview');
      expect(labels).toContain('Organization Management');
      expect(labels).toContain('Branches & Campuses');
      expect(labels).toContain('User Management');
      expect(labels).toContain('Roles & Permissions');
      expect(labels).toContain('Authentication & Security');
      expect(labels).toContain('Subscriptions & Billing');
      expect(labels).toContain('Plans & Entitlements');
      expect(labels).toContain('Audit & Compliance Logs');
      expect(labels).toContain('Tenant Configuration');
    });

    it('2. resolves Academics config for /app/academics routes with Branches Master operational', () => {
      const config = getSidebarConfigForPath('/app/academics/branches');
      expect(config.moduleKey).toBe('academics');
      expect(config.moduleName).toBe('Academics & Curriculum');
      expect(config.badge).toBe('Soon');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Branches Master');
      expect(labels).toContain('Academics Overview');
      // Dead links removed
      expect(labels).not.toContain('Classes & Sections');
      expect(labels).not.toContain('Curriculum & Subjects');
      expect(labels).not.toContain('Class Timetable');
    });

    it('3. resolves Students config for /app/students routes without dead links', () => {
      const config = getSidebarConfigForPath('/app/students');
      expect(config.moduleKey).toBe('students');
      expect(config.moduleName).toBe('Students & Admissions');
      expect(config.badge).toBe('Soon');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Students Overview');
      expect(labels).not.toContain('Admissions Pipeline');
      expect(labels).not.toContain('Guardians & Contacts');
    });

    it('4. resolves Attendance config for /app/attendance routes without dead links', () => {
      const config = getSidebarConfigForPath('/app/attendance');
      expect(config.moduleKey).toBe('attendance');
      expect(config.moduleName).toBe('Attendance & Registers');
      expect(config.badge).toBe('Soon');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Attendance Overview');
      expect(labels).not.toContain('Biometric & RFID Logs');
    });

    it('5. resolves Timetable config for /app/timetable routes', () => {
      const config = getSidebarConfigForPath('/app/timetable');
      expect(config.moduleKey).toBe('timetable');
      expect(config.moduleName).toBe('Timetable & Schedules');
      expect(config.badge).toBe('Soon');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Timetable Overview');
    });

    it('6. resolves Examinations config for /app/exams routes without dead links', () => {
      const config = getSidebarConfigForPath('/app/exams');
      expect(config.moduleKey).toBe('exams');
      expect(config.moduleName).toBe('Examinations & Marks');
      expect(config.badge).toBe('Soon');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Examinations Overview');
      expect(labels).not.toContain('Marks & Gradebook');
    });

    it('7. resolves Staff & HR config for /app/staff routes without dead links', () => {
      const config = getSidebarConfigForPath('/app/staff');
      expect(config.moduleKey).toBe('staff');
      expect(config.moduleName).toBe('Staff & Faculty');
      expect(config.badge).toBe('Soon');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Staff Overview');
      expect(labels).not.toContain('Subject Allocations');
    });

    it('8. resolves Front Desk config for /app/front-office routes', () => {
      const config = getSidebarConfigForPath('/app/front-office');
      expect(config.moduleKey).toBe('front-office');
      expect(config.moduleName).toBe('Front Desk & Reception');
      expect(config.badge).toBe('Soon');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Front Desk Overview');
    });

    it('9. resolves Fees & Finance config for /app/fees routes without dead links', () => {
      const config = getSidebarConfigForPath('/app/fees');
      expect(config.moduleKey).toBe('fees');
      expect(config.moduleName).toBe('Fees & Finance');
      expect(config.badge).toBe('Soon');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Fees Overview');
      expect(labels).not.toContain('Fee Structures');
      expect(labels).not.toContain('Collection Receipts');
    });

    it('10. resolves Transport config for /app/transport routes', () => {
      const config = getSidebarConfigForPath('/app/transport');
      expect(config.moduleKey).toBe('transport');
      expect(config.moduleName).toBe('Transport & Fleet');
      expect(config.badge).toBe('Soon');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Transport Overview');
    });

    it('11. resolves Library config for /app/library routes', () => {
      const config = getSidebarConfigForPath('/app/library');
      expect(config.moduleKey).toBe('library');
      expect(config.moduleName).toBe('Library & Catalog');
      expect(config.badge).toBe('Soon');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Library Overview');
    });

    it('12. resolves Hostel config for /app/hostel routes', () => {
      const config = getSidebarConfigForPath('/app/hostel');
      expect(config.moduleKey).toBe('hostel');
      expect(config.moduleName).toBe('Hostel & Housing');
      expect(config.badge).toBe('Soon');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Hostel Overview');
    });
  });

  // 2. Default & Overview Fallback
  describe('Default Overview Fallback', () => {
    it('falls back to overview config for root /workspace with all 12 modules', () => {
      const config = getSidebarConfigForPath('/workspace');
      expect(config.moduleKey).toBe('workspace-overview');
      expect(config.moduleName).toBe('School ERP');

      const labels = config.items.map((i) => i.label);
      expect(labels).toContain('Workspace Overview');
      expect(labels).toContain('Administration');
      expect(labels).toContain('Academics');
      expect(labels).toContain('Staff & HR');
      expect(labels).toContain('Students');
      expect(labels).toContain('Fees & Finance');
      expect(labels).toContain('Attendance');
      expect(labels).toContain('Timetable');
      expect(labels).toContain('Examinations');
      expect(labels).toContain('Front Desk');
      expect(labels).toContain('Transport');
      expect(labels).toContain('Library');
      expect(labels).toContain('Hostel');
    });

    it('falls back to overview config for unrecognized routes', () => {
      const config = getSidebarConfigForPath('/some/unknown/route');
      expect(config.moduleKey).toBe('workspace-overview');
    });
  });
});
