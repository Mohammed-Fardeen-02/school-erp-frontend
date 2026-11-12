import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, UserPlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import type { AdminUserRecord, SaveUserPayload, UserStatus } from '../../types/admin.types';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid institutional email is required'),
  phone: z.string().optional(),
  password: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'INVITED', 'SUSPENDED']).default('ACTIVE'),
  roleId: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: SaveUserPayload, id?: string) => Promise<void>;
  initialData?: AdminUserRecord | null;
  isLoading?: boolean;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
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
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone || '',
        status: initialData.status,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        status: 'ACTIVE',
      });
    }
  }, [initialData, reset, isOpen]);

  const onFormSubmit = async (data: UserFormData) => {
    await onSubmit(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        status: data.status as UserStatus,
      },
      initialData?.id
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit ? 'Edit User Profile' : 'Add Institutional User'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage user identity and account status.
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
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Eleanor"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="Vance"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Institutional Email"
            type="email"
            placeholder="name@school.edu"
            error={errors.email?.message}
            disabled={isEdit}
            {...register('email')}
          />

          <Input
            label="Phone"
            placeholder="+1-555-0100"
            error={errors.phone?.message}
            {...register('phone')}
          />

          {!isEdit && (
            <Input
              label="Initial Password"
              type="password"
              placeholder="••••••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          )}

          <Select
            label="Account Status"
            error={Boolean(errors.status?.message)}
            {...register('status')}
          >
            <option value="ACTIVE">Active Account</option>
            <option value="INACTIVE">Inactive (Suspended)</option>
            <option value="INVITED">Pending Invitation</option>
          </Select>

          <div className="border-t border-border pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSubmitting || isLoading}
              icon={<Save className="h-4 w-4" />}
            >
              {isEdit ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
