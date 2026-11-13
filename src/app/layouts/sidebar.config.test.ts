import { describe, it, expect } from 'vitest';
import { getSidebarConfigForPath } from './sidebar.config';

describe('Modular Workspace-Scoped Sidebar Configuration', () => {
  it('resolves Administration config with exactly 7 sub-features + overview for /admin routes', () => {
    const config = getSidebarConfigForPath('/admin/organizations');
    expect(config.moduleKey).toBe('admin');
    expect(config.moduleName).toBe('Administration');
    expect(config.items.length).toBe(8); // Hub Overview + 7 Core Features

    const itemLabels = config.items.map((i) => i.label);
    expect(itemLabels).toContain('Admin Hub Overview');
    expect(itemLabels).toContain('Organization Management');
    expect(itemLabels).toContain('User Management');
    expect(itemLabels).toContain('Roles & Permissions');
    expect(itemLabels).toContain('Authentication & Security');
    expect(itemLabels).toContain('Subscriptions & Billing');
    expect(itemLabels).toContain('Plans & Entitlements');
    expect(itemLabels).toContain('Audit & Activity Logs');
  });

  it('resolves Academics config with academic-specific features for /app/academics routes', () => {
    const config = getSidebarConfigForPath('/app/academics/classes');
    expect(config.moduleKey).toBe('academics');
    expect(config.moduleName).toBe('Academics');

    const itemLabels = config.items.map((i) => i.label);
    expect(itemLabels).toContain('Classes & Sections');
    expect(itemLabels).toContain('Curriculum & Subjects');
    expect(itemLabels).toContain('Class Timetable');
    expect(itemLabels).not.toContain('User Management');
    expect(itemLabels).not.toContain('Subscriptions & Billing');
  });

  it('resolves Teachers & Staff config with staff-specific features for /app/staff routes', () => {
    const config = getSidebarConfigForPath('/app/staff/allocations');
    expect(config.moduleKey).toBe('staff');
    expect(config.moduleName).toBe('Teachers & Staff');

    const itemLabels = config.items.map((i) => i.label);
    expect(itemLabels).toContain('Staff Directory');
    expect(itemLabels).toContain('Subject Allocations');
    expect(itemLabels).toContain('Staff Leaves & Approvals');
    expect(itemLabels).not.toContain('Organization Management');
  });

  it('resolves Students config for /app/students routes', () => {
    const config = getSidebarConfigForPath('/app/students');
    expect(config.moduleKey).toBe('students');
    expect(config.moduleName).toBe('Students');

    const itemLabels = config.items.map((i) => i.label);
    expect(itemLabels).toContain('Student Directory');
    expect(itemLabels).toContain('Admissions Pipeline');
  });

  it('resolves Fees config for /app/fees routes', () => {
    const config = getSidebarConfigForPath('/app/fees/structures');
    expect(config.moduleKey).toBe('fees');
    expect(config.moduleName).toBe('Fees & Finance');
  });

  it('resolves Attendance config for /app/attendance routes', () => {
    const config = getSidebarConfigForPath('/app/attendance');
    expect(config.moduleKey).toBe('attendance');
    expect(config.moduleName).toBe('Attendance');
  });

  it('resolves Examinations config for /app/exams routes', () => {
    const config = getSidebarConfigForPath('/app/exams/grades');
    expect(config.moduleKey).toBe('exams');
    expect(config.moduleName).toBe('Examinations');
  });

  it('falls back to overview config for root /workspace', () => {
    const config = getSidebarConfigForPath('/workspace');
    expect(config.moduleKey).toBe('workspace-overview');
    expect(config.items.length).toBeGreaterThan(0);
  });
});

