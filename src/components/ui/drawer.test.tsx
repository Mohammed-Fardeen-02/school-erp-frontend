import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer } from './drawer';

describe('Drawer Component (Stage W1.4)', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Drawer isOpen={false} onClose={vi.fn()} title="Test Drawer">
        <div>Content</div>
      </Drawer>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title, subtitle, content, and footer when open', () => {
    const handleClose = vi.fn();
    render(
      <Drawer
        isOpen={true}
        onClose={handleClose}
        title="Inspect Record"
        subtitle="Detailed record metadata"
        footer={<button type="button">Apply</button>}
      >
        <div>Drawer Body Content</div>
      </Drawer>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    expect(screen.getByText('Inspect Record')).toBeInTheDocument();
    expect(screen.getByText('Detailed record metadata')).toBeInTheDocument();
    expect(screen.getByText('Drawer Body Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={handleClose} title="Drawer">
        <div>Body</div>
      </Drawer>
    );

    const closeBtn = screen.getByRole('button', { name: /close drawer/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={handleClose} title="Drawer">
        <div>Body</div>
      </Drawer>
    );

    const backdrop = screen.getByTestId('drawer-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={handleClose} title="Drawer">
        <div>Body</div>
      </Drawer>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

