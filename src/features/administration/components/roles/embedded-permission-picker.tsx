import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/forms/input';
import { Button } from '@/components/ui/button';

export interface ModuleCapability {
  id: string;
  name: string;
  category: string;
  actions: {
    code: string;
    label: string;
    description: string;
  }[];
}

const CANONICAL_DOMAINS: ModuleCapability[] = [
  {
    id: 'academics',
    name: 'Academics & Curriculum',
    category: 'Academic',
    actions: [
      { code: 'academics.classes.view', label: 'View Classes & Sections', description: 'Read class catalog and rosters' },
      { code: 'academics.classes.create', label: 'Create Classes', description: 'Add new class grades & sections' },
      { code: 'academics.classes.edit', label: 'Edit Classes', description: 'Modify class configurations' },
      { code: 'academics.classes.delete', label: 'Delete Classes', description: 'Remove classes & sections' },
      { code: 'academics.curriculum.manage', label: 'Manage Curriculum & Syllabi', description: 'Author course plans and subjects' },
    ],
  },
  {
    id: 'students',
    name: 'Students & Admissions',
    category: 'Academic',
    actions: [
      { code: 'students.directory.view', label: 'View Student Directory', description: 'Access student master records' },
      { code: 'students.admissions.create', label: 'Process Admissions', description: 'Register new student intake' },
      { code: 'students.profiles.edit', label: 'Edit Student Profiles', description: 'Update demographics and academic history' },
      { code: 'students.documents.manage', label: 'Manage Identity Documents', description: 'Upload and verify birth certificates' },
      { code: 'students.archive.delete', label: 'Archive / Withdraw Students', description: 'Process transfer certificates & withdrawals' },
    ],
  },
  {
    id: 'attendance',
    name: 'Attendance & Registers',
    category: 'Core',
    actions: [
      { code: 'attendance.registers.view', label: 'View Attendance Records', description: 'Read daily classroom registers' },
      { code: 'attendance.mark.edit', label: 'Mark Classroom Attendance', description: 'Take morning & afternoon attendance' },
      { code: 'attendance.biometric.sync', label: 'Sync Biometric Devices', description: 'Trigger hardware RFID/fingerprint sync' },
      { code: 'attendance.reports.export', label: 'Export Attendance Reports', description: 'Generate monthly compliance sheets' },
    ],
  },
  {
    id: 'fees',
    name: 'Fees & Finance',
    category: 'Finance',
    actions: [
      { code: 'fees.invoices.view', label: 'View Fee Invoices', description: 'Read fee schedules and outstanding balances' },
      { code: 'fees.payments.collect', label: 'Collect Payments & Issue Receipts', description: 'Record cash, POS, and online fees' },
      { code: 'fees.discounts.apply', label: 'Apply Fee Concessions', description: 'Grant sibling discounts and scholarships' },
      { code: 'fees.structures.manage', label: 'Manage Fee Structures', description: 'Configure tuition, bus, and lab fees' },
    ],
  },
  {
    id: 'staff',
    name: 'Staff & Human Resources',
    category: 'Administration',
    actions: [
      { code: 'staff.directory.view', label: 'View Faculty Directory', description: 'Read teacher profiles and departments' },
      { code: 'staff.onboard.create', label: 'Onboard Staff Members', description: 'Create employee accounts and contracts' },
      { code: 'staff.leaves.approve', label: 'Approve Leave Applications', description: 'Manage sick and annual leave requests' },
      { code: 'staff.allocations.manage', label: 'Manage Subject Allocations', description: 'Assign teachers to classes & subjects' },
    ],
  },
  {
    id: 'exams',
    name: 'Examinations & Grading',
    category: 'Academic',
    actions: [
      { code: 'exams.schedules.view', label: 'View Exam Schedules', description: 'Read exam dates and hall allotments' },
      { code: 'exams.marks.entry', label: 'Enter Assessment Marks', description: 'Grade midterm and final test scores' },
      { code: 'exams.reports.publish', label: 'Publish Report Cards', description: 'Release final report cards to parents' },
    ],
  },
  {
    id: 'settings',
    name: 'Administration & System',
    category: 'System',
    actions: [
      { code: 'settings.roles_permissions.rbac.view', label: 'View Roles & Capabilities', description: 'Inspect RBAC matrix' },
      { code: 'settings.roles_permissions.rbac.edit', label: 'Modify Roles & Permissions', description: 'Author custom role privileges' },
      { code: 'settings.user_assignments.allocations.assign', label: 'Assign Roles to Members', description: 'Allocate role scopes' },
      { code: 'settings.audit.view', label: 'View Audit Logs', description: 'Read security event logs' },
    ],
  },
];

export interface EmbeddedPermissionPickerProps {
  selectedCodes: string[];
  onChange: (codes: string[]) => void;
  isReadOnly?: boolean;
}

export const EmbeddedPermissionPicker: React.FC<EmbeddedPermissionPickerProps> = ({
  selectedCodes,
  onChange,
  isReadOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  const selectedSet = useMemo(() => new Set(selectedCodes), [selectedCodes]);

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

  const toggleModule = (module: ModuleCapability) => {
    if (isReadOnly) return;
    const next = new Set(selectedSet);
    const allModuleCodes = module.actions.map((a) => a.code);
    const allSelected = allModuleCodes.every((c) => next.has(c));

    if (allSelected) {
      allModuleCodes.forEach((c) => next.delete(c));
    } else {
      allModuleCodes.forEach((c) => next.add(c));
    }
    onChange(Array.from(next));
  };

  const selectAll = () => {
    if (isReadOnly) return;
    const all = CANONICAL_DOMAINS.flatMap((m) => m.actions.map((a) => a.code));
    onChange(all);
  };

  const clearAll = () => {
    if (isReadOnly) return;
    onChange([]);
  };

  const toggleCollapse = (moduleId: string) => {
    setCollapsedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // Filter modules and actions
  const filteredModules = useMemo(() => {
    if (!searchTerm.trim()) return CANONICAL_DOMAINS;
    const term = searchTerm.toLowerCase();

    return CANONICAL_DOMAINS.map((m) => {
      const matchModule = m.name.toLowerCase().includes(term);
      const matchingActions = m.actions.filter(
        (a) =>
          a.label.toLowerCase().includes(term) ||
          a.code.toLowerCase().includes(term) ||
          a.description.toLowerCase().includes(term)
      );
      if (matchModule || matchingActions.length > 0) {
        return {
          ...m,
          actions: matchModule ? m.actions : matchingActions,
        };
      }
      return null;
    }).filter(Boolean) as ModuleCapability[];
  }, [searchTerm]);

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-4">
      {/* Search & Bulk Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="relative w-full max-w-xs">
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-2 font-medium">
            <span className="font-bold text-primary">{selectedCodes.length}</span> capabilities granted
          </span>
          {!isReadOnly && (
            <>
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {filteredModules.map((module) => {
          const allModuleCodes = module.actions.map((a) => a.code);
          const selectedCount = allModuleCodes.filter((c) => selectedSet.has(c)).length;
          const isAllSelected = selectedCount === allModuleCodes.length && allModuleCodes.length > 0;
          const isCollapsed = Boolean(collapsedModules[module.id]);

          return (
            <div
              key={module.id}
              className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs"
            >
              {/* Module Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-surface-muted/40 border-b border-border">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(module.id)}
                    className="text-muted-foreground hover:text-foreground p-0.5"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{module.name}</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground bg-surface-muted px-2 py-0.5 rounded-full">
                      {module.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {selectedCount} / {allModuleCodes.length}
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
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-surface">
                  {module.actions.map((action) => {
                    const isChecked = selectedSet.has(action.code);

                    return (
                      <label
                        key={action.code}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'border-primary/40 bg-primary/5 text-foreground shadow-xs'
                            : 'border-border bg-surface text-muted-foreground hover:bg-surface-muted/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAction(action.code)}
                          disabled={isReadOnly}
                          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-foreground">{action.label}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{action.description}</p>
                          <span className="font-mono text-[10px] text-primary/70">{action.code}</span>
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
