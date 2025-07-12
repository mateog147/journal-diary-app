import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HomeEntriesComponent } from '../../src/components/organism/HomeEntries';
import { Alert } from 'react-native';
import * as reduxHooks from 'react-redux';

// Mock the redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock the EntryService
jest.mock('../../src/store/services/EntryService', () => ({
  EntryService: jest.fn(() => ({
    getClientEntriesByDate: jest.fn(),
    deleteEntry: jest.fn(),
  })),
}));

// Mock react-native-calendars
jest.mock('react-native-calendars', () => {
  const React = require('react');
  // @ts-ignore
  const Calendar = (props) => {
    return React.createElement('View', {
      testID: 'calendar',
      onDayPress: props.onDayPress
    }, null);
  };
  return { Calendar };
});

describe('HomeEntriesComponent', () => {
  // Setup for common mocks
  const mockDispatch = jest.fn();
  const mockNavigation = {
    navigate: jest.fn(),
    setParams: jest.fn(),
  };
  const mockGetEntriesByDate = jest.fn();
  const mockDeleteEntry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock implementation for useDispatch
    jest.spyOn(reduxHooks, 'useDispatch').mockReturnValue(mockDispatch);
    
    // Mock the EntryService methods
    require('../../src/store/services/EntryService').EntryService.mockReturnValue({
      getClientEntriesByDate: mockGetEntriesByDate,
      deleteEntry: mockDeleteEntry,
    });

    // Mock Alert.alert
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      // Simulate pressing "Delete" button if present
      const deleteButton = buttons?.find(b => b.text === 'Delete');
      if (deleteButton && deleteButton.onPress) {
        deleteButton.onPress();
      }
    });
  });

  it('renders correctly with calendar and no entries', async () => {
    mockGetEntriesByDate.mockResolvedValue([]);
    
    const { getByText, getByTestId } = render(
      <HomeEntriesComponent navigation={mockNavigation} />
    );
    
    expect(getByTestId('calendar')).toBeTruthy();
    expect(getByText('Recent Entries')).toBeTruthy();
    
    await waitFor(() => {
      expect(getByText('You do not have entries for this day')).toBeTruthy();
      expect(mockGetEntriesByDate).toHaveBeenCalled();
    });
  });

  it('renders entries when available', async () => {
    const mockEntries = [
      { id: '1', title: 'Entry 1', content: 'Content 1' },
      { id: '2', title: 'Entry 2', content: 'Content 2' },
    ];
    
    mockGetEntriesByDate.mockResolvedValue(mockEntries);
    
    const { getByText } = render(
      <HomeEntriesComponent navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      expect(getByText('Entry 1')).toBeTruthy();
      expect(getByText('Entry 2')).toBeTruthy();
    });
  });

  it('navigates to entry screen when add button is pressed', () => {
    mockGetEntriesByDate.mockResolvedValue([]);
    
    const { getByRole } = render(
      <HomeEntriesComponent navigation={mockNavigation} />
    );
    
    // Find the add button (using role since we're mocking IconButton)
    const addButtons = getByRole('button');
    fireEvent.press(addButtons);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Entry', { entry: undefined });
  });

  it('navigates to entry screen with entry when edit is pressed', async () => {
    const mockEntries = [
      { id: '1', title: 'Entry 1', content: 'Content 1' },
    ];
    
    mockGetEntriesByDate.mockResolvedValue(mockEntries);
    
    const { getAllByRole } = render(
      <HomeEntriesComponent navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      const buttons = getAllByRole('button');
      // First button in EntryListItem is the edit button
      fireEvent.press(buttons[0]);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Entry', { 
        entry: mockEntries[0] 
      });
    });
  });

  it('deletes entry when delete is confirmed', async () => {
    const mockEntries = [
      { id: '1', title: 'Entry 1', content: 'Content 1' },
    ];
    
    mockGetEntriesByDate.mockResolvedValue(mockEntries);
    mockDeleteEntry.mockResolvedValue(true);
    
    const { getAllByRole } = render(
      <HomeEntriesComponent navigation={mockNavigation} />
    );
    
    await waitFor(() => {
      const buttons = getAllByRole('button');
      // Second button in EntryListItem is the delete button
      fireEvent.press(buttons[1]);
      
      expect(Alert.alert).toHaveBeenCalled();
      expect(mockDeleteEntry).toHaveBeenCalledWith('1');
      expect(mockGetEntriesByDate).toHaveBeenCalledTimes(2); // Initial + after delete
    });
  });

  it('refreshes entries when date is selected', async () => {
    mockGetEntriesByDate.mockResolvedValue([]);
    
    const { getByTestId } = render(
      <HomeEntriesComponent navigation={mockNavigation} />
    );
    
    const calendar = getByTestId('calendar');
    fireEvent(calendar, 'onDayPress', { dateString: '2023-07-01' });
    
    expect(mockGetEntriesByDate).toHaveBeenCalledWith('2023-07-01');
  });

  it('refreshes entries when refreshTrigger changes', async () => {
    mockGetEntriesByDate.mockResolvedValue([]);
    
    const { rerender } = render(
      <HomeEntriesComponent navigation={mockNavigation} refreshTrigger={false} />
    );
    
    // Reset call count after initial render
    mockGetEntriesByDate.mockClear();
    
    rerender(
      <HomeEntriesComponent navigation={mockNavigation} refreshTrigger={true} />
    );
    
    expect(mockGetEntriesByDate).toHaveBeenCalled();
    expect(mockNavigation.setParams).toHaveBeenCalledWith({ refresh: undefined });
  });
});
