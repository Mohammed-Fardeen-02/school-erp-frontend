import React, { useState } from 'react';
import { X, Building2, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import type { OrganizationCampus } from '../../types/admin.types';

export interface CampusManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationName: string;
  campuses: OrganizationCampus[];
  onAddCampus: (campus: Partial<OrganizationCampus>) => Promise<void>;
}

export const CampusManagerModal: React.FC<CampusManagerModalProps> = ({
  isOpen,
  onClose,
  organizationName,
  campuses,
  onAddCampus,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    setIsSubmitting(true);
    try {
      await onAddCampus({
        name,
        code: code.toUpperCase(),
        city,
        email,
        phone,
        isMainCampus: campuses.length === 0,
        isActive: true,
      });
      setName('');
      setCode('');
      setCity('');
      setEmail('');
      setPhone('');
      setShowAddForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Campuses & Locations</h2>
              <p className="text-xs text-muted-foreground">{organizationName}</p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Configured Campuses ({campuses.length})
            </h3>
            {!showAddForm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(true)}
                icon={<Plus className="h-3.5 w-3.5" />}
              >
                Add Campus
              </Button>
            )}
          </div>

          {/* New Campus Inline Form */}
          {showAddForm && (
            <form onSubmit={handleSave} className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
              <h4 className="text-xs font-bold text-primary">New Campus Setup</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Campus Name"
                  placeholder="e.g. North Branch"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Campus Code"
                  placeholder="e.g. NORTH"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="City"
                  placeholder="Springfield"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  label="Contact Email"
                  placeholder="north@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Phone"
                  placeholder="+1-555-0102"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  Save Campus
                </Button>
              </div>
            </form>
          )}

          {/* List of Campuses */}
          <div className="space-y-2">
            {campuses.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface p-3.5 text-xs shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{c.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground bg-surface-muted px-1.5 py-0.5 rounded">
                        {c.code}
                      </span>
                      {c.isMainCampus && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Main Campus
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-0.5">
                      {[c.city, c.phone, c.email].filter(Boolean).join(' • ') || 'No contact specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-success font-semibold">
                    <Check className="h-3.5 w-3.5" />
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3 bg-surface-muted/30 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

