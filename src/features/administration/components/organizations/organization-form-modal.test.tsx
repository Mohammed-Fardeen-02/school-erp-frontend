import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrganizationFormModal } from './organization-form-modal';

describe('OrganizationFormModal Validations', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network sandbox offline'));
  });

  it('enforces required-only validation and displays error messages when required fields are empty', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <OrganizationFormModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    // Click submit without filling required fields
    const submitBtn = screen.getByRole('button', { name: /save & activate/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Legal school name is required')).toBeInTheDocument();
      expect(screen.getByText('Display name is required')).toBeInTheDocument();
      expect(screen.getByText('Institutional code is required')).toBeInTheDocument();
      expect(screen.getByText('Valid institutional email is required')).toBeInTheDocument();
      expect(screen.getByText('Contact phone is required')).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits successfully when required fields are valid even if optional address fields are omitted', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <OrganizationFormModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    // Fill only required fields
    fireEvent.change(screen.getByPlaceholderText("e.g. St. Mary's Educational Academy"), {
      target: { value: 'Global Green School Foundation' },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. St. Mary's High School"), {
      target: { value: 'Green Valley School' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. SMH-2026'), {
      target: { value: 'GVS_01' },
    });
    fireEvent.change(screen.getByPlaceholderText('admin@school.edu'), {
      target: { value: 'admin@greenvalley.edu' },
    });
    fireEvent.change(screen.getByPlaceholderText('+1-555-0100'), {
      target: { value: '+91-9876543210' },
    });

    // Leave website, taxId, addressLine1, city, state, country, postalCode completely empty
    const submitBtn = screen.getByRole('button', { name: /save & activate/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          legalName: 'Global Green School Foundation',
          displayName: 'Green Valley School',
          code: 'GVS_01',
          email: 'admin@greenvalley.edu',
          phone: '+91-9876543210',
          organizationType: 'K12_SCHOOL_CHAIN',
          website: '',
          taxId: '',
          addressLine1: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
        }),
        undefined
      );
    });
  });
});
