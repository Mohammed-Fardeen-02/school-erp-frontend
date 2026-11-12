import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Shield, Building2, MapPin } from 'lucide-react';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import { useAdminCampuses } from '../../hooks/use-admin';

export interface RoleProfileCardProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isEdit?: boolean;
  campusScope: 'ALL' | 'SPECIFIC';
  onCampusScopeChange: (scope: 'ALL' | 'SPECIFIC') => void;
  specificCampusId?: string;
  onSpecificCampusChange?: (campusId: string) => void;
}

export const RoleProfileCard: React.FC<RoleProfileCardProps> = ({
  register,
  errors,
  isEdit = false,
  campusScope,
  onCampusScopeChange,
  specificCampusId,
  onSpecificCampusChange,
}) => {
  const { data: campuses = [] } = useAdminCampuses();

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 border-b border-border pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Role Profile & Scope Configuration</h2>
            <p className="text-xs text-muted-foreground">
              Define identity, identifier code, and organizational campus authorization boundaries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Role Code (Auto-Generated)"
            placeholder="Auto-generated from Role Name (e.g. ROLE_EXAM_COORDINATOR)"
            disabled={true}
            helperText="Unique role code will be generated automatically by the backend."
            {...register('roleCode')}
          />
          <Input
            label="Role Display Name *"
            placeholder="e.g. Examination Coordinator"
            error={errors.roleName?.message as string | undefined}
            {...register('roleName')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Role Description (Optional)"
            placeholder="Detailed description of responsibilities and permissions associated with this role..."
            error={errors.description?.message as string | undefined}
            {...register('description')}
          />
        </div>
      </div>

      {/* Campus Scoping Options */}
      <div className="pt-2 border-t border-border space-y-3">
        <div>
          <label className="text-xs font-bold text-foreground block">
            Institutional Campus Scope
          </label>
          <p className="text-xs text-muted-foreground">
            Define whether this custom role applies across all institutional campus branches or a specific campus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            onClick={() => onCampusScopeChange('ALL')}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
              campusScope === 'ALL'
                ? 'border-primary ring-1 ring-primary/20 bg-primary/5 text-foreground shadow-xs'
                : 'border-border bg-surface text-muted-foreground hover:bg-surface-muted/50'
            }`}
          >
            <input
              type="radio"
              name="campusScope"
              checked={campusScope === 'ALL'}
              onChange={() => onCampusScopeChange('ALL')}
              className="mt-0.5 h-4 w-4 text-primary focus:ring-primary accent-primary"
            />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>All Campuses Scope</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Role grants capability access across all institutional branches and campuses.
              </p>
            </div>
          </label>

          <label
            onClick={() => onCampusScopeChange('SPECIFIC')}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
              campusScope === 'SPECIFIC'
                ? 'border-primary ring-1 ring-primary/20 bg-primary/5 text-foreground shadow-xs'
                : 'border-border bg-surface text-muted-foreground hover:bg-surface-muted/50'
            }`}
          >
            <input
              type="radio"
              name="campusScope"
              checked={campusScope === 'SPECIFIC'}
              onChange={() => onCampusScopeChange('SPECIFIC')}
              className="mt-0.5 h-4 w-4 text-primary focus:ring-primary accent-primary"
            />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                <span>Single Campus Branch</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Role capabilities are restricted strictly to a designated campus location.
              </p>
            </div>
          </label>
        </div>

        {campusScope === 'SPECIFIC' && (
          <div className="pt-2 animate-in fade-in-0 slide-in-from-top-1">
            <Select
              label="Select Designated Campus"
              value={specificCampusId || ''}
              onChange={(e) => onSpecificCampusChange?.(e.target.value)}
            >
              <option value="">Choose a campus branch...</option>
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code}) - {c.city || 'Main Facility'}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

