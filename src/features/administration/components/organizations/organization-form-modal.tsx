import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Building2, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import type { TenantDto } from '@/features/tenants/types/tenants.types';
import type { SaveOrganizationPayload } from '../../types/admin.types';

const orgSchema = z.object({
  legalName: z.string().min(2, 'Legal name is required'),
  displayName: z.string().min(2, 'Display name is required'),
  code: z.string().min(2, 'Code must be at least 2 characters').toUpperCase(),
  organizationType: z.enum([
    'K12_SCHOOL_CHAIN',
    'INDEPENDENT_SCHOOL',
    'COLLEGE_UNIVERSITY',
    'POLYTECHNIC_INSTITUTE',
    'VOCATIONAL_CENTER',
  ]),
  email: z.string().email('Valid institutional email is required'),
  phone: z.string().min(5, 'Phone number is required'),
  website: z.string().optional(),
  taxId: z.string().optional(),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

type OrgFormData = z.infer<typeof orgSchema>;

export interface OrganizationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: SaveOrganizationPayload, id?: string) => Promise<void>;
  initialData?: TenantDto | null;
  isLoading?: boolean;
}

export const OrganizationFormModal: React.FC<OrganizationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      legalName: '',
      displayName: '',
      code: '',
      organizationType: 'K12_SCHOOL_CHAIN',
      email: '',
      phone: '',
      website: '',
      taxId: '',
      addressLine1: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        legalName: initialData.legalName,
        displayName: initialData.displayName,
        code: initialData.code,
        organizationType: initialData.organizationType,
        email: initialData.email,
        phone: initialData.phone,
        website: initialData.website || '',
        taxId: initialData.taxId || '',
        addressLine1: initialData.addressLine1 || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || '',
        postalCode: initialData.postalCode || '',
      });
    } else {
      reset({
        legalName: '',
        displayName: '',
        code: '',
        organizationType: 'K12_SCHOOL_CHAIN',
        email: '',
        phone: '',
        website: '',
        taxId: '',
        addressLine1: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const onFormSubmit = async (data: OrgFormData, isDraft = false) => {
    const payload: SaveOrganizationPayload = {
      ...data,
      status: isDraft ? 'PROVISIONING' : 'ACTIVE',
      isDraft,
    };
    await onSubmit(payload, initialData?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit ? 'Edit School Organization' : 'Add New Institution'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure institutional legal identity, campuses, and administrative attributes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          id="org-form"
          onSubmit={handleSubmit((data) => onFormSubmit(data, false))}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Legal School / Trust Name"
              placeholder="e.g. St. Mary's Educational Academy"
              error={errors.legalName?.message}
              {...register('legalName')}
            />
            <Input
              label="Display Name"
              placeholder="e.g. St. Mary's High School"
              error={errors.displayName?.message}
              {...register('displayName')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Institutional Code"
              placeholder="e.g. SMH-2026"
              error={errors.code?.message}
              disabled={isEdit}
              {...register('code')}
            />
            <Select
              label="Organization Category"
              error={Boolean(errors.organizationType?.message)}
              {...register('organizationType')}
            >
              <option value="K12_SCHOOL_CHAIN">K-12 School Chain</option>
              <option value="INDEPENDENT_SCHOOL">Independent School</option>
              <option value="COLLEGE_UNIVERSITY">College / Higher Ed</option>
              <option value="POLYTECHNIC_INSTITUTE">Polytechnic Institute</option>
              <option value="VOCATIONAL_CENTER">Vocational Center</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Official Contact Email"
              type="email"
              placeholder="admin@school.edu"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Official Phone"
              placeholder="+1-555-0100"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Website (Optional)"
              placeholder="https://springfield.edu"
              error={errors.website?.message}
              {...register('website')}
            />
            <Input
              label="Tax ID / Registration No"
              placeholder="TAX-998822"
              error={errors.taxId?.message}
              {...register('taxId')}
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Campus Address Details
            </h4>
            <Input
              label="Address Line 1"
              placeholder="123 Academic Way"
              {...register('addressLine1')}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input label="City" placeholder="Springfield" {...register('city')} />
              <Input label="State / Province" placeholder="OR" {...register('state')} />
              <Input label="Country" placeholder="USA" {...register('country')} />
              <Input label="Postal Code" placeholder="97477" {...register('postalCode')} />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 bg-surface-muted/30 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            {!isEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSubmit((data) => onFormSubmit(data, true))}
                disabled={isSubmitting || isLoading}
                icon={<FileText className="h-4 w-4" />}
              >
                Save as Draft
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              type="submit"
              form="org-form"
              disabled={isSubmitting || isLoading}
              icon={<Save className="h-4 w-4" />}
            >
              {isEdit ? 'Save Changes' : 'Save & Activate'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
