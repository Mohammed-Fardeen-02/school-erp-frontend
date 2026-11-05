import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, School, User, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { useCreateTenant } from '../hooks/use-tenants';
import type { CreateTenantDto, OrganizationType } from '../types/tenants.types';

export const NewTenantPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateTenant();

  const [formData, setFormData] = useState<CreateTenantDto>({
    code: '',
    legalName: '',
    displayName: '',
    organizationType: 'INDEPENDENT_SCHOOL',
    email: '',
    phone: '',
    website: '',
    subscriptionPlan: 'STANDARD',
    maxLocations: 1,
    maxUsers: 50,
    maxStudents: 500,
    addressLine1: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    initialMainCampusName: 'Main Campus',
    initialMainCampusCode: 'MAIN',
    ownerEmail: '',
    ownerFirstName: '',
    ownerLastName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.code.trim()) {
      errs.code = 'Institution code is required';
    } else if (!/^[A-Z0-9_-]{2,20}$/i.test(formData.code.trim())) {
      errs.code = 'Code must be 2-20 alphanumeric characters (or dashes/underscores)';
    }

    if (!formData.displayName.trim()) {
      errs.displayName = 'Display name is required';
    }

    if (!formData.legalName.trim()) {
      errs.legalName = 'Legal registered name is required';
    }

    if (!formData.email.trim()) {
      errs.email = 'Official contact email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Invalid email address format';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Official phone number is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload: CreateTenantDto = {
        ...formData,
        code: formData.code.trim().toUpperCase(),
        displayName: formData.displayName.trim(),
        legalName: formData.legalName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        ownerEmail: formData.ownerEmail?.trim().toLowerCase() || undefined,
        ownerFirstName: formData.ownerFirstName?.trim() || undefined,
        ownerLastName: formData.ownerLastName?.trim() || undefined,
      };

      const result = await createMutation.mutateAsync(payload);
      navigate(`/tenants/${result.id}`);
    } catch {
      // Handled by createMutation.error
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/tenants')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-black text-foreground">Provision School Institution</h1>
            <p className="text-xs text-muted-foreground">
              Initialize a dedicated multi-tenant institutional workspace, main campus, and administrator.
            </p>
          </div>
        </div>
      </div>

      {createMutation.isError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
          <strong>Provisioning Failed:</strong> {createMutation.error?.message || 'Server error occurred'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Institution Identity */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Institution Identity & Branding</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Display / Brand Name *
              </label>
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="e.g. Delhi Public School"
                error={errors.displayName}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Unique Tenant Code *
              </label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. DPS-DELHI"
                error={errors.code}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Full Registered Legal Name *
              </label>
              <Input
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                placeholder="e.g. Delhi Public School Educational Society Pvt. Ltd."
                error={errors.legalName}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Institution Type
              </label>
              <select
                value={formData.organizationType}
                onChange={(e) => setFormData({ ...formData, organizationType: e.target.value as OrganizationType })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="INDEPENDENT_SCHOOL">Independent K-12 School</option>
                <option value="K12_SCHOOL_CHAIN">K-12 School Chain (Multi-Campus)</option>
                <option value="COLLEGE_UNIVERSITY">College / Higher Ed University</option>
                <option value="POLYTECHNIC_INSTITUTE">Polytechnic Institute</option>
                <option value="VOCATIONAL_CENTER">Vocational Training Center</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Subscription Plan Tier
              </label>
              <select
                value={formData.subscriptionPlan}
                onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="STANDARD">STANDARD (1 Campus, up to 500 Students)</option>
                <option value="PREMIUM">PREMIUM (Up to 5 Campuses, 2500 Students)</option>
                <option value="ENTERPRISE">ENTERPRISE (Unlimited Campuses & Modules)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Contact & Headquarter Address</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Official Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@school.edu"
                error={errors.email}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Official Phone *
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                error={errors.phone}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Street Address
              </label>
              <Input
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                placeholder="123 Academic Enclave, Knowledge Park"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                City
              </label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New Delhi"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                State / Province
              </label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Delhi"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Initial Main Campus */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <School className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Initial Main Campus / Location</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Main Campus Name
              </label>
              <Input
                value={formData.initialMainCampusName}
                onChange={(e) => setFormData({ ...formData, initialMainCampusName: e.target.value })}
                placeholder="e.g. Primary Campus"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Campus Code
              </label>
              <Input
                value={formData.initialMainCampusCode}
                onChange={(e) => setFormData({ ...formData, initialMainCampusCode: e.target.value.toUpperCase() })}
                placeholder="MAIN"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Initial School Administrator (Optional) */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Initial School Administrator Account (Optional)</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Admin First Name
              </label>
              <Input
                value={formData.ownerFirstName}
                onChange={(e) => setFormData({ ...formData, ownerFirstName: e.target.value })}
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Admin Last Name
              </label>
              <Input
                value={formData.ownerLastName}
                onChange={(e) => setFormData({ ...formData, ownerLastName: e.target.value })}
                placeholder="Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Admin Email
              </label>
              <Input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                placeholder="principal@school.edu"
              />
            </div>
          </div>
        </div>

        {/* Form Submission Action Bar */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/tenants')}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={createMutation.isPending}
            icon={<CheckCircle2 className="h-4 w-4" />}
          >
            Provision & Initialize School
          </Button>
        </div>
      </form>
    </div>
  );
};

