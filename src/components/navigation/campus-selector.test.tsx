import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CampusSelector } from './campus-selector';
import * as useCampusContextModule from '@/features/workspace/hooks/use-campus-context';

vi.mock('@/features/workspace/hooks/use-campus-context');

const mockSwitchCampus = vi.fn();
const mockRefetch = vi.fn();

describe('CampusSelector Component (Stage W1.3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when campus data is loading', () => {
    vi.spyOn(useCampusContextModule, 'useCampusContext').mockReturnValue({
      campuses: [],
      activeCampus: null,
      activeLocationId: null,
      isSingleCampus: false,
      isLoading: true,
      isError: false,
      error: null,
      isSwitching: false,
      switchCampus: mockSwitchCampus,
      refetch: mockRefetch,
    });

    render(<CampusSelector />);

    expect(screen.getByTestId('campus-selector-loading')).toBeInTheDocument();
    expect(screen.getByText(/loading campus/i)).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('renders error state with retry button on fetch failure', () => {
    vi.spyOn(useCampusContextModule, 'useCampusContext').mockReturnValue({
      campuses: [],
      activeCampus: null,
      activeLocationId: null,
      isSingleCampus: false,
      isLoading: false,
      isError: true,
      error: new Error('Failed to load locations'),
      isSwitching: false,
      switchCampus: mockSwitchCampus,
      refetch: mockRefetch,
    });

    render(<CampusSelector />);

    expect(screen.getByTestId('campus-selector-error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load locations')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry loading campuses/i });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('renders single-campus non-interactive badge when organization has only 1 campus', () => {
    vi.spyOn(useCampusContextModule, 'useCampusContext').mockReturnValue({
      campuses: [
        {
          id: 'camp-main',
          code: 'MAIN',
          name: 'Main Campus',
          locationType: 'MAIN_CAMPUS',
          isMainCampus: true,
          isActive: true,
        },
      ],
      activeCampus: {
        id: 'camp-main',
        code: 'MAIN',
        name: 'Main Campus',
        locationType: 'MAIN_CAMPUS',
        isMainCampus: true,
        isActive: true,
      },
      activeLocationId: 'camp-main',
      isSingleCampus: true,
      isLoading: false,
      isError: false,
      error: null,
      isSwitching: false,
      switchCampus: mockSwitchCampus,
      refetch: mockRefetch,
    });

    render(<CampusSelector />);

    // Should render non-interactive badge and NO combobox button
    expect(screen.getByTestId('campus-selector-single')).toBeInTheDocument();
    expect(screen.getByText('Main Campus')).toBeInTheDocument();
    expect(screen.getByText('(MAIN)')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('renders multi-campus combobox and toggles listbox on click', () => {
    const multiCampuses = [
      {
        id: 'camp-1',
        code: 'MAIN',
        name: 'Main Campus',
        locationType: 'MAIN_CAMPUS',
        isMainCampus: true,
        isActive: true,
      },
      {
        id: 'camp-2',
        code: 'NORTH',
        name: 'North Campus',
        locationType: 'BRANCH_CAMPUS',
        isMainCampus: false,
        isActive: true,
      },
    ];

    vi.spyOn(useCampusContextModule, 'useCampusContext').mockReturnValue({
      campuses: multiCampuses,
      activeCampus: multiCampuses[0],
      activeLocationId: 'camp-1',
      isSingleCampus: false,
      isLoading: false,
      isError: false,
      error: null,
      isSwitching: false,
      switchCampus: mockSwitchCampus,
      refetch: mockRefetch,
    });

    render(<CampusSelector />);

    const combobox = screen.getByRole('combobox', { name: /select campus context/i });
    expect(combobox).toBeInTheDocument();
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Main Campus')).toBeInTheDocument();

    // Listbox should be closed initially
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    // Click to open dropdown
    fireEvent.click(combobox);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');

    const listbox = screen.getByRole('listbox', { name: /authorized campuses/i });
    expect(listbox).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);

    // Active campus option check
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveTextContent('Main Campus');
    expect(options[0]).toHaveTextContent('Code: MAIN');

    // Inactive campus option check
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
    expect(options[1]).toHaveTextContent('North Campus');
    expect(options[1]).toHaveTextContent('Code: NORTH');

    // Select different campus
    fireEvent.click(options[1]);
    expect(mockSwitchCampus).toHaveBeenCalledWith('camp-2');
  });

  it('does not trigger campus switch when active campus is clicked again', () => {
    const multiCampuses = [
      {
        id: 'camp-1',
        code: 'MAIN',
        name: 'Main Campus',
        locationType: 'MAIN_CAMPUS',
        isMainCampus: true,
        isActive: true,
      },
      {
        id: 'camp-2',
        code: 'NORTH',
        name: 'North Campus',
        locationType: 'BRANCH_CAMPUS',
        isMainCampus: false,
        isActive: true,
      },
    ];

    vi.spyOn(useCampusContextModule, 'useCampusContext').mockReturnValue({
      campuses: multiCampuses,
      activeCampus: multiCampuses[0],
      activeLocationId: 'camp-1',
      isSingleCampus: false,
      isLoading: false,
      isError: false,
      error: null,
      isSwitching: false,
      switchCampus: mockSwitchCampus,
      refetch: mockRefetch,
    });

    render(<CampusSelector />);

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);

    const activeOption = screen.getAllByRole('option')[0];
    fireEvent.click(activeOption);

    // Should NOT call switchCampus because it's already active
    expect(mockSwitchCampus).not.toHaveBeenCalled();
    // Dropdown should close
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)', () => {
    const multiCampuses = [
      {
        id: 'camp-1',
        code: 'MAIN',
        name: 'Main Campus',
        locationType: 'MAIN_CAMPUS',
        isMainCampus: true,
        isActive: true,
      },
      {
        id: 'camp-2',
        code: 'NORTH',
        name: 'North Campus',
        locationType: 'BRANCH_CAMPUS',
        isMainCampus: false,
        isActive: true,
      },
    ];

    vi.spyOn(useCampusContextModule, 'useCampusContext').mockReturnValue({
      campuses: multiCampuses,
      activeCampus: multiCampuses[0],
      activeLocationId: 'camp-1',
      isSingleCampus: false,
      isLoading: false,
      isError: false,
      error: null,
      isSwitching: false,
      switchCampus: mockSwitchCampus,
      refetch: mockRefetch,
    });

    render(<CampusSelector />);

    const combobox = screen.getByRole('combobox');

    // ArrowDown to open
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // ArrowDown moves down to second campus
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });

    // Enter to select highlighted
    fireEvent.keyDown(combobox, { key: 'Enter' });
    expect(mockSwitchCampus).toHaveBeenCalledWith('camp-2');

    // Reopen and test Escape
    fireEvent.keyDown(combobox, { key: ' ' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(combobox, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

