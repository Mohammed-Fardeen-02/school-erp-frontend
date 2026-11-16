import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  X,
  Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ModuleAction {
  code: string;
  label: string;
  description: string;
  type: 'READ' | 'WRITE' | 'MANAGE' | 'CRITICAL';
  isHighRisk?: boolean;
}

export interface DomainModuleCapability {
  id: string;
  name: string;
  category: 'Academic' | 'Core' | 'Finance' | 'Administration' | 'System';
  description: string;
  actions: ModuleAction[];
}

export const CANONICAL_DOMAINS: DomainModuleCapability[] = [
  {
    id: 'academics',
    name: 'Academics & Curriculum',
    category: 'Academic',
    description: 'Classes, sections, grade levels, and institutional syllabi authoring.',
    actions: [
      { code: 'academics.classes.view', label: 'View Classes & Sections', description: 'Read class catalog, grades, and student rosters', type: 'READ' },
      { code: 'academics.classes.create', label: 'Create Classes & Sections', description: 'Add new class grades and classroom sections', type: 'WRITE' },
      { code: 'academics.classes.edit', label: 'Edit Classes & Rosters', description: 'Modify class configurations and assign teachers', type: 'WRITE' },
      { code: 'academics.classes.delete', label: 'Delete Classes & Sections', description: 'Remove academic classes and rosters', type: 'MANAGE', isHighRisk: true },
      { code: 'academics.curriculum.manage', label: 'Manage Curriculum & Syllabi', description: 'Author subject blueprints and lesson plans', type: 'WRITE' },
    ],
  },
  {
    id: 'students',
    name: 'Students & Admissions',
    category: 'Academic',
    description: 'Student master profiles, guardians, documents, and onboarding.',
    actions: [
      { code: 'students.directory.view', label: 'View Student Directory', description: 'Access student master records and demographic details', type: 'READ' },
      { code: 'students.admissions.create', label: 'Process New Admissions', description: 'Enroll new student applications and assign student IDs', type: 'WRITE' },
      { code: 'students.profiles.edit', label: 'Edit Student Profiles', description: 'Update contact details, health records, and demographics', type: 'WRITE' },
      { code: 'students.documents.manage', label: 'Manage Identity Documents', description: 'Upload and verify birth certificates and affidavits', type: 'WRITE' },
      { code: 'students.archive.delete', label: 'Archive & Withdraw Students', description: 'Process transfer certificates and student withdrawals', type: 'CRITICAL', isHighRisk: true },
    ],
  },
  {
    id: 'attendance',
    name: 'Attendance & Registers',
    category: 'Core',
    description: 'Daily classroom registers, RFID biometrics, and analytics.',
    actions: [
      { code: 'attendance.registers.view', label: 'View Attendance Registers', description: 'Read daily classroom registers and historical metrics', type: 'READ' },
      { code: 'attendance.mark.edit', label: 'Mark Classroom Attendance', description: 'Take morning, afternoon, and subject attendance', type: 'WRITE' },
      { code: 'attendance.biometric.sync', label: 'Sync Biometric Devices', description: 'Trigger hardware RFID/fingerprint synchronization', type: 'CRITICAL', isHighRisk: true },
      { code: 'attendance.reports.export', label: 'Export Attendance Reports', description: 'Generate monthly attendance compliance sheets', type: 'READ' },
    ],
  },
  {
    id: 'fees',
    name: 'Fees & Finance',
    category: 'Finance',
    description: 'Fee structures, billing schedules, receipts, and payment collection.',
    actions: [
      { code: 'fees.invoices.view', label: 'View Invoices & Balances', description: 'Read student fee statements and outstanding dues', type: 'READ' },
      { code: 'fees.payments.collect', label: 'Collect Payments & Issue Receipts', description: 'Record cash, card, and digital fee payments', type: 'WRITE' },
      { code: 'fees.discounts.apply', label: 'Apply Fee Concessions', description: 'Grant sibling discounts and need-based concessions', type: 'WRITE' },
      { code: 'fees.structures.manage', label: 'Configure Fee Structures', description: 'Modify tuition schedules, lab charges, and bus fees', type: 'CRITICAL', isHighRisk: true },
    ],
  },
  {
    id: 'staff',
    name: 'Staff & Human Resources',
    category: 'Administration',
    description: 'Faculty directory, employee contracts, and leave approvals.',
    actions: [
      { code: 'staff.directory.view', label: 'View Faculty Directory', description: 'Read teacher profiles, contacts, and departmental roles', type: 'READ' },
      { code: 'staff.onboard.create', label: 'Onboard Staff Members', description: 'Create employee accounts and assign designations', type: 'WRITE' },
      { code: 'staff.leaves.approve', label: 'Approve Staff Leaves', description: 'Review and approve teacher leave applications', type: 'WRITE' },
      { code: 'staff.allocations.manage', label: 'Manage Subject Allocations', description: 'Assign teachers to academic classes and subjects', type: 'WRITE' },
    ],
  },
  {
    id: 'exams',
    name: 'Examinations & Grading',
    category: 'Academic',
    description: 'Exam scheduling, grading, moderation, and report card release.',
    actions: [
      { code: 'exams.schedules.view', label: 'View Exam Schedules', description: 'Read timetable schedules and hall allotments', type: 'READ' },
      { code: 'exams.marks.entry', label: 'Enter Assessment Marks', description: 'Input test scores and continuous assessments', type: 'WRITE' },
      { code: 'exams.reports.publish', label: 'Publish Final Report Cards', description: 'Officially release final semester report cards', type: 'CRITICAL', isHighRisk: true },
    ],
  },
  {
    id: 'settings',
    name: 'Administration & System',
    category: 'System',
    description: 'Security policies, RBAC roles, audit logs, and system config.',
    actions: [
      { code: 'settings.roles_permissions.rbac.view', label: 'View Roles & Capabilities', description: 'Inspect RBAC role catalog and matrix nodes', type: 'READ' },
      { code: 'settings.roles_permissions.rbac.edit', label: 'Modify Roles & Permissions', description: 'Author custom role privileges and capability rules', type: 'CRITICAL', isHighRisk: true },
      { code: 'settings.user_assignments.allocations.assign', label: 'Assign Roles to Users', description: 'Allocate role capabilities to faculty and staff', type: 'WRITE' },
      { code: 'settings.audit.view', label: 'View Audit Logs & Trails', description: 'Read security event logs and administrative traces', type: 'READ' },
    ],
  },
];

export interface GranularCapabilitySelectorProps {
  selectedCodes: string[];
  onChange: (codes: string[]) => void;
  isReadOnly?: boolean;
}

export const GranularCapabilitySelector: React.FC<GranularCapabilitySelectorProps> = ({
  selectedCodes,
  onChange,
  isReadOnly = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const selectedSet = useMemo(() => new Set(selectedCodes), [selectedCodes]);

  const categories = [
    { id: 'ALL', label: 'All Modules' },
    { id: 'Academic', label: 'Academics' },
    { id: 'Core', label: 'Core School' },
    { id: 'Finance', label: 'Finance & Fees' },
    { id: 'Administration', label: 'Administration' },
    { id: 'System', label: 'System & Security' },
  ];

  const toggleAction = (code: string) => {
    if (isReadOnly) return;
    const next = new Set(selectedSet);
    if (next.has(code)) {
      next.delete(code);
    } else {
      next.add(code);
    }
    onChange(Array.from(next));
  };

  const toggleModule = (module: DomainModuleCapability) => {
    if (isReadOnly) return;
    const next = new Set(selectedSet);
    const codes = module.actions.map((a) => a.code);
    const allSelected = codes.every((c) => next.has(c));

    if (allSelected) {
      codes.forEach((c) => next.delete(c));
    } else {
      codes.forEach((c) => next.add(c));
    }
    onChange(Array.from(next));
  };

  const selectCategoryAll = () => {
    if (isReadOnly) return;
    const next = new Set(selectedSet);
    filteredModules.forEach((m) => {
      m.actions.forEach((a) => next.add(a.code));
    });
    onChange(Array.from(next));
  };

  const clearCategoryAll = () => {
    if (isReadOnly) return;
    const next = new Set(selectedSet);
    filteredModules.forEach((m) => {
      m.actions.forEach((a) => next.delete(a.code));
    });
    onChange(Array.from(next));
  };

  const filteredModules = useMemo(() => {
    let list = CANONICAL_DOMAINS;

    if (activeCategory !== 'ALL') {
      list = list.filter((m) => m.category === activeCategory);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list
        .map((m) => {
          const matchModule = m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
          const matchActions = m.actions.filter(
            (a) =>
              a.label.toLowerCase().includes(q) ||
              a.code.toLowerCase().includes(q) ||
              a.description.toLowerCase().includes(q)
          );
          if (matchModule || matchActions.length > 0) {
            return {
              ...m,
              actions: matchModule ? m.actions : matchActions,
            };
          }
          return null;
        })
        .filter(Boolean) as DomainModuleCapability[];
    }

    return list;
  }, [activeCategory, search]);

  const totalVisibleActions = useMemo(() => {
    return filteredModules.reduce((acc, m) => acc + m.actions.length, 0);
  }, [filteredModules]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header & Category Tabs */}
      <div className="space-y-3 border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Granted Capabilities & Access Checkboxes</h2>
              <p className="text-xs text-muted-foreground">
                Grant specific domain operations and permissions to this custom role definition.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isReadOnly && (
              <>
                <Button variant="outline" size="sm" onClick={selectCategoryAll} className="text-xs h-8">
                  Select Visible
                </Button>
                <Button variant="ghost" size="sm" onClick={clearCategoryAll} className="text-xs h-8 text-muted-foreground">
                  Clear Visible
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-surface-muted/60 text-muted-foreground hover:bg-surface-muted hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search capabilities or codes..."
            className="w-full pl-10 pr-8 h-9 text-xs bg-surface border border-border text-foreground placeholder:text-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Showing {totalVisibleActions} capability options</span>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3 pt-1">
        {filteredModules.map((module) => {
          const moduleCodes = module.actions.map((a) => a.code);
          const selectedCount = moduleCodes.filter((c) => selectedSet.has(c)).length;
          const isAllSelected = selectedCount === moduleCodes.length && moduleCodes.length > 0;
          const isCollapsed = Boolean(collapsed[module.id]);

          return (
            <div
              key={module.id}
              className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xs"
            >
              {/* Module Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-surface-muted/40 border-b border-border">
                <div className="flex items-center gap-2.5">
                  {!isReadOnly && (
                    <input
                      type="checkbox"
                      data-testid={`module-checkbox-${module.id}`}
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = selectedCount > 0 && !isAllSelected;
                        }
                      }}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleModule(module);
                      }}
                      title={
                        isAllSelected
                          ? `Deselect all capabilities in ${module.name}`
                          : `Select all capabilities in ${module.name}`
                      }
                      aria-label={`Select all capabilities in ${module.name}`}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setCollapsed((p) => ({ ...p, [module.id]: !p[module.id] }))}
                    className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-surface-muted transition-colors cursor-pointer"
                    aria-label={isCollapsed ? `Expand ${module.name}` : `Collapse ${module.name}`}
                  >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-foreground">{module.name}</span>
                      <span className="text-[10px] font-semibold text-muted-foreground bg-surface-muted px-2 py-0.5 rounded-full">
                        {module.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground hidden sm:block mt-0.5">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-muted-foreground">
                    <strong className="text-primary">{selectedCount}</strong> / {moduleCodes.length}
                  </span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => toggleModule(module)}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      {isAllSelected ? 'Deselect Module' : 'Select All'}
                    </button>
                  )}
                </div>
              </div>

              {/* Actions Grid */}
              {!isCollapsed && (
                <div className="p-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 bg-surface">
                  {module.actions.map((action) => {
                    const isChecked = selectedSet.has(action.code);

                    return (
                      <label
                        key={action.code}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer relative ${
                          isChecked
                            ? 'border-primary/40 bg-primary/5 text-foreground shadow-xs'
                            : 'border-border bg-surface text-muted-foreground hover:bg-surface-muted/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          data-testid={`action-checkbox-${action.code}`}
                          checked={isChecked}
                          onChange={() => toggleAction(action.code)}
                          disabled={isReadOnly}
                          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs font-bold text-foreground truncate">
                              {action.label}
                            </span>
                            {action.isHighRisk ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-500/10 px-1.5 py-0.5 rounded shrink-0">
                                <AlertTriangle className="h-3 w-3" />
                                <span>CRITICAL</span>
                              </span>
                            ) : action.type === 'WRITE' ? (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                                WRITE
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-500/10 px-1.5 py-0.5 rounded shrink-0">
                                READ
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {action.description}
                          </p>
                          <span className="font-mono text-[10px] text-primary/70 block mt-1">
                            {action.code}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
