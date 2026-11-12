import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserFormModal } from './user-form-modal';
import { InviteUserModal } from './invite-user-modal';

describe('User Modals Validations (Required-only)', () => {
  describe('UserFormModal', () => {
    it('shows validation errors only for required fields when empty', async () => {
      const onSubmit = vi.fn();
      const onClose = vi.fn();

      render(
        <UserFormModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      );

      const submitBtn = screen.getByRole('button', { name: /create user/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Valid institutional email is required')).toBeInTheDocument();
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits successfully when required fields are populated and optional fields omitted', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onClose = vi.fn();

      render(
        <UserFormModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      );

      fireEvent.change(screen.getByPlaceholderText('Eleanor'), {
        target: { value: 'Eleanor' },
      });
      fireEvent.change(screen.getByPlaceholderText('Vance'), {
        target: { value: 'Vance' },
      });
      fireEvent.change(screen.getByPlaceholderText('name@school.edu'), {
        target: { value: 'eleanor.vance@school.edu' },
      });

      // Leave phone and password empty
      const submitBtn = screen.getByRole('button', { name: /create user/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'Eleanor',
            lastName: 'Vance',
            email: 'eleanor.vance@school.edu',
            phone: '',
            password: '',
            status: 'ACTIVE',
          }),
          undefined
        );
      });
    });
  });

  describe('InviteUserModal', () => {
    it('shows validation errors only for required fields when empty', async () => {
      const onSubmit = vi.fn();
      const onClose = vi.fn();

      render(
        <InviteUserModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      );

      const submitBtn = screen.getByRole('button', { name: /send invitation/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Valid institutional email is required')).toBeInTheDocument();
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits successfully when required fields are populated and optional phone/campus omitted', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const onClose = vi.fn();

      render(
        <InviteUserModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      );

      fireEvent.change(screen.getByPlaceholderText('e.g. Marcus'), {
        target: { value: 'Marcus' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g. Chen'), {
        target: { value: 'Chen' },
      });
      fireEvent.change(screen.getByPlaceholderText('marcus.chen@school.edu'), {
        target: { value: 'marcus.chen@school.edu' },
      });

      // Leave phone empty and campus scope at organization-wide
      const submitBtn = screen.getByRole('button', { name: /send invitation/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'Marcus',
            lastName: 'Chen',
            email: 'marcus.chen@school.edu',
            roleId: 'role_teacher',
            phone: '',
            locationId: null,
          })
        );
      });
    });
  });
});

