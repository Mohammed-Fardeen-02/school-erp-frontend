import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, GitBranch, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import { AddressLocationPicker } from '@/components/forms/address-location-picker';
import { useToast } from '@/components/feedback/toast';
import type { BranchDto, SaveBranchPayload, BranchLocationType } from '../types/branches.types';

const branchSchema = z.object({
  name: z.string().trim().min(2, 'Branch name must be at least 2 characters'),
  code: z
    .string()
    .trim()
    .max(50, 'Branch code cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),
  locationType: z.enum([
    'MAIN_CAMPUS',
    'BRANCH_CAMPUS',
    'ADMINISTRATIVE_HQ',
    'TRAINING_CENTER',
    'HOSTEL_FACILITY',
    'SPORTS_COMPLEX',
  ]),
  isMainCampus: z.boolean().default(false),
  principalName: z.string().optional().or(z.literal('')),
  email: z.string().trim().email('Valid email is required').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  addressLine1: z.string().optional().or(z.literal('')),
  addressLine2: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  postalCode: z.string().optional().or(z.literal('')),
});

type BranchFormData = z.infer<typeof branchSchema>;

export interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: SaveBranchPayload, id?: string) => Promise<void>;
  initialData?: BranchDto | null;
  isLoading?: boolean;
}

export const BranchFormModal: React.FC<BranchFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const isEdit = Boolean(initialData);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      code: '',
      locationType: 'BRANCH_CAMPUS',
      isMainCampus: false,
      principalName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  });

  const watchCountry = watch('country');
  const watchState = watch('state');
  const watchCity = watch('city');
  const watchPostalCode = watch('postalCode');

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        code: initialData.code,
        locationType: initialData.locationType,
        isMainCampus: initialData.isMainCampus,
        principalName: initialData.principalName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        addressLine1: initialData.addressLine1 || '',
        addressLine2: initialData.addressLine2 || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || '',
        postalCode: initialData.postalCode || '',
      });
    } else {
      reset({
        name: '',
        code: '',
        locationType: 'BRANCH_CAMPUS',
        isMainCampus: false,
        principalName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const handleValidationErrors = (formErrors: Record<string, any>) => {
    const firstError = Object.values(formErrors)[0];
    if (firstError?.message) {
      toast.error(String(firstError.message), 'Validation Error');
    }
  };

  const onFormSubmit = async (data: BranchFormData) => {
    const payload: SaveBranchPayload = {
      name: data.name.trim(),
      code: data.code?.trim() || undefined,
      locationType: data.locationType as BranchLocationType,
      isMainCampus: data.isMainCampus,
      principalName: data.principalName?.trim() || undefined,
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      addressLine1: data.addressLine1?.trim() || undefined,
      addressLine2: data.addressLine2?.trim() || undefined,
      city: data.city?.trim() || undefined,
      state: data.state?.trim() || undefined,
      country: data.country?.trim() || undefined,
      postalCode: data.postalCode?.trim() || undefined,
    };

    try {
      await onSubmit(payload, initialData?.id);
      onClose();
    } catch {
      // Handled by parent caller
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit ? 'Edit Branch / Campus' : 'Add New Academic Branch'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure branch campus identity, academic head, and physical facilities.
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

        {/* Modal Body */}
        <form
          id="branch-form"
          onSubmit={handleSubmit(onFormSubmit, handleValidationErrors)}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Branch Name *"
              placeholder="e.g. North Academic Campus"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Branch Code"
              placeholder="Auto-generated if left empty (e.g. NAC-01)"
              helperText="Unique branch identifier (leave blank to auto-generate)"
              error={errors.code?.message}
              {...register('code')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Branch Type / Category *"
              error={Boolean(errors.locationType?.message)}
              {...register('locationType')}
            >
              <option value="BRANCH_CAMPUS">Branch Campus / Regional Center</option>
              <option value="MAIN_CAMPUS">Main Campus (Primary)</option>
              <option value="TRAINING_CENTER">Training & Academic Center</option>
              <option value="ADMINISTRATIVE_HQ">Administrative Headquarters</option>
              <option value="HOSTEL_FACILITY">Residential / Hostel Facility</option>
              <option value="SPORTS_COMPLEX">Athletics & Sports Complex</option>
            </Select>

            <Input
              label="Academic Head / Principal In-Charge"
              placeholder="e.g. Dr. Alistair Finch"
              error={errors.principalName?.message}
              {...register('principalName')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Branch Contact Email"
              type="email"
              placeholder="north.campus@school.edu"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Branch Contact Phone"
              placeholder="+91 80 2345 6702"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          {/* Location & Address */}
          <div className="space-y-3 pt-2 border-t border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Branch Address & Location Details (Optional)
            </h4>
            <Input
              label="Address Line 1"
              placeholder="e.g. Plot 12, Kogilu Main Road"
              {...register('addressLine1')}
            />
            <AddressLocationPicker
              country={watchCountry || ''}
              state={watchState || ''}
              city={watchCity || ''}
              postalCode={watchPostalCode || ''}
              onCountryChange={(val) => setValue('country', val, { shouldValidate: true })}
              onStateChange={(val) => setValue('state', val, { shouldValidate: true })}
              onCityChange={(val) => setValue('city', val, { shouldValidate: true })}
              onPostalCodeChange={(val) => setValue('postalCode', val, { shouldValidate: true })}
            />
          </div>

          {/* Main campus toggle */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <input
              type="checkbox"
              id="isMainCampus"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              {...register('isMainCampus')}
            />
            <label htmlFor="isMainCampus" className="text-xs font-semibold text-foreground cursor-pointer">
              Designate as Primary / Main Campus for this organization
            </label>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="border-t border-border px-6 py-4 bg-surface-muted/30 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            type="submit"
            form="branch-form"
            disabled={isSubmitting || isLoading}
            icon={<Save className="h-4 w-4" />}
          >
            {isEdit ? 'Save Changes' : 'Create Branch'}
          </Button>
        </div>
      </div>
    </div>
  );
};
