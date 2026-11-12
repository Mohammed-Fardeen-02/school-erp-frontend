import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Mail, Send, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Select } from '@/components/forms/select';
import { Checkbox } from '@/components/forms/checkbox';
import type { InviteUserPayload } from '../../types/admin.types';

const inviteSchema = z.object({
  email: z.string().email('Valid institutional email is required'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  roleId: z.string().min(1, 'Please select an assigned role'),
  locationId: z.string().optional(),
  sendEmailNotification: z.boolean().default(true),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: InviteUserPayload) => Promise<void>;
  roles?: { id: string; name: string }[];
  campuses?: { id: string; name: string }[];
  isLoading?: boolean;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roles = [
    { id: 'role_admin', name: 'School Administrator' },
    { id: 'role_principal', name: 'Principal / Head of School' },
    { id: 'role_teacher', name: 'Teacher / Faculty' },
    { id: 'role_bursar', name: 'Bursar / Finance Officer' },
    { id: 'role_staff', name: 'Administrative Staff' },
  ],
  campuses = [
    { id: 'loc_main', name: 'Main Campus (All-Campus Scope)' },
    { id: 'loc_north', name: 'North Branch' },
  ],
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      roleId: 'role_teacher',
      locationId: '',
      sendEmailNotification: true,
    },
  });

  const onFormSubmit = async (data: InviteFormData) => {
    await onSubmit({
      ...data,
      locationId: data.locationId ? data.locationId : null,
    });
    reset();
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
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Invite Institutional User</h2>
              <p className="text-xs text-muted-foreground">
                Send an onboard invitation email with assigned role and campus scope.
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
              placeholder="e.g. Marcus"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="e.g. Chen"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Institutional Email Address"
            type="email"
            placeholder="marcus.chen@school.edu"
            leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Phone Number (Optional)"
            placeholder="+1-555-0199"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assigned Role"
              error={Boolean(errors.roleId?.message)}
              {...register('roleId')}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>

            <Select
              label="Campus Scope"
              error={Boolean(errors.locationId?.message)}
              {...register('locationId')}
            >
              <option value="">Organization-Wide (All)</option>
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="pt-2">
            <Checkbox
              label="Send invitation onboarding link via email immediately"
              defaultChecked
              {...register('sendEmailNotification')}
            />
          </div>

          <div className="border-t border-border pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSubmitting || isLoading}
              icon={<Send className="h-4 w-4" />}
            >
              Send Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
