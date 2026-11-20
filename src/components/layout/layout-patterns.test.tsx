import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  DirectoryPageLayout,
  DetailPageLayout,
  FormPageLayout,
  FormSection,
} from './index';

describe('Standard ERP Screen Patterns (Stage W1.4)', () => {
  describe('DirectoryPageLayout', () => {
    it('renders header, stats row, toolbar, and main content area', () => {
      render(
        <DirectoryPageLayout
          header={<div data-testid="page-header">Header</div>}
          statsRow={<div data-testid="stats-row">KPIs</div>}
          toolbar={<div data-testid="toolbar">Filters</div>}
        >
          <div data-testid="data-table">Table Data</div>
        </DirectoryPageLayout>
      );

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('stats-row')).toBeInTheDocument();
      expect(screen.getByTestId('toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('renders error alert when error prop is provided', () => {
      render(
        <DirectoryPageLayout
          header={<div>Header</div>}
          error={new Error('Failed to load records')}
        >
          <div>Table</div>
        </DirectoryPageLayout>
      );

      expect(screen.getByText('Failed to load records')).toBeInTheDocument();
    });

    it('renders emptyState when empty is true', () => {
      render(
        <DirectoryPageLayout
          header={<div>Header</div>}
          empty={true}
          emptyState={<div data-testid="empty-view">No Records Found</div>}
        >
          <div data-testid="table">Should be hidden</div>
        </DirectoryPageLayout>
      );

      expect(screen.getByTestId('empty-view')).toBeInTheDocument();
      expect(screen.queryByTestId('table')).not.toBeInTheDocument();
    });
  });

  describe('DetailPageLayout', () => {
    it('renders 2/3 + 1/3 layout when sidebar is provided', () => {
      render(
        <DetailPageLayout
          header={<div data-testid="detail-header">Detail Header</div>}
          tabs={<div data-testid="detail-tabs">Tabs</div>}
          main={<div data-testid="detail-main">Overview Form</div>}
          sidebar={<div data-testid="detail-sidebar">Metadata Sidebar</div>}
        />
      );

      expect(screen.getByTestId('detail-header')).toBeInTheDocument();
      expect(screen.getByTestId('detail-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('detail-main')).toBeInTheDocument();
      expect(screen.getByTestId('detail-sidebar')).toBeInTheDocument();
    });

    it('renders full-width main content when no sidebar is provided', () => {
      render(
        <DetailPageLayout
          header={<div>Header</div>}
          main={<div data-testid="full-main">Full Main</div>}
        />
      );

      expect(screen.getByTestId('full-main')).toBeInTheDocument();
      expect(screen.queryByTestId('detail-sidebar')).not.toBeInTheDocument();
    });
  });

  describe('FormPageLayout & FormSection', () => {
    it('renders header, form sections, and action footer', () => {
      render(
        <FormPageLayout
          header={<div data-testid="form-header">Create Entity</div>}
          footer={<button type="submit">Save Record</button>}
        >
          <FormSection
            title="General Information"
            description="Core details of this entity"
          >
            <input placeholder="Entity Name" />
          </FormSection>
        </FormPageLayout>
      );

      expect(screen.getByTestId('form-header')).toBeInTheDocument();
      expect(screen.getByText('General Information')).toBeInTheDocument();
      expect(screen.getByText('Core details of this entity')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Entity Name')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Record' })).toBeInTheDocument();
    });
  });
});

