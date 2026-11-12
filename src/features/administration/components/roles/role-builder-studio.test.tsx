import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoleBuilderStudio } from './role-builder-studio';

function renderStudio(props?: Partial<React.ComponentProps<typeof RoleBuilderStudio>>) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    ...props,
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RoleBuilderStudio {...defaultProps} />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('RoleBuilderStudio Custom Role Layout & Capabilities', () => {
  it('does NOT render Quick-Starter Role Archetypes carousel', () => {
    renderStudio();
    expect(screen.queryByText(/Quick-Starter Role Archetypes/i)).toBeNull();
  });

  it('renders Role Profile & Scope Configuration and New Custom Role side-by-side at the top', () => {
    renderStudio();
    expect(screen.getByText('Role Profile & Scope Configuration')).toBeInTheDocument();
    expect(screen.getByText('New Custom Role')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Auto-generated from Role Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Examination Coordinator')).toBeInTheDocument();
  });

  it('renders Granted Capabilities & Access Checkboxes container below', () => {
    renderStudio();
    expect(screen.getByText('Granted Capabilities & Access Checkboxes')).toBeInTheDocument();
  });

  it('renders module-level checkboxes next to accordion expanders to select/deselect the entire module', () => {
    renderStudio();

    const academicsCheckbox = screen.getByTestId('module-checkbox-academics') as HTMLInputElement;
    expect(academicsCheckbox).toBeInTheDocument();
    expect(academicsCheckbox.checked).toBe(false);

    // Clicking the module-level checkbox selects all capabilities in the module
    fireEvent.click(academicsCheckbox);
    expect(academicsCheckbox.checked).toBe(true);

    // All capabilities under Academics should now be checked
    const viewClassesCheckbox = screen.getByTestId('action-checkbox-academics.classes.view') as HTMLInputElement;
    expect(viewClassesCheckbox.checked).toBe(true);

    // Clicking it again deselects all capabilities in the module
    fireEvent.click(academicsCheckbox);
    expect(academicsCheckbox.checked).toBe(false);
    expect(viewClassesCheckbox.checked).toBe(false);
  });

  it('reflects partial capability selection with indeterminate state on module checkbox', () => {
    renderStudio({
      initialData: {
        roleCode: 'TEST_PARTIAL',
        roleName: 'Partial Role',
        permissionCodes: ['academics.classes.view'], // Only 1 of 5 selected
      },
    });

    const academicsCheckbox = screen.getByTestId('module-checkbox-academics') as HTMLInputElement;
    expect(academicsCheckbox.checked).toBe(false);
    expect(academicsCheckbox.indeterminate).toBe(true);
  });

  it('validates strictly required fields only (roleName) and allows empty description and auto-generated roleCode', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderStudio({ onSubmit });

    const submitBtn = screen.getByRole('button', { name: /save as inactive draft/i });
    fireEvent.click(submitBtn);

    // Validation errors show for required fields
    expect(await screen.findByText('Role name must be at least 3 characters')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    // Now fill roleName with valid input and leave description empty
    fireEvent.change(screen.getByPlaceholderText('e.g. Examination Coordinator'), {
      target: { value: 'Head of Examination' },
    });

    fireEvent.click(submitBtn);

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          roleName: 'Head of Examination',
          description: '',
        }),
        undefined
      );
    });
  });
});
