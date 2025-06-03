import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../src/screens/HomeScreen';
import { Alert } from 'react-native';
import * as reactRedux from 'react-redux';


// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('react-native-calendars', () => ({
  Calendar: () => <div data-testid="mock-calendar">Mock Calendar</div>,
}));

jest.mock('../src/store/services/EntryService', () => ({
  EntryService: jest.fn(),
}));

import { EntryService } from '../src/store/services/EntryService';
const mockGetEntries = jest.fn(() => Promise.resolve([]));
describe('HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    isFocused: jest.fn(() => true),
  };

  const mockRoute = {
    params: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Configure mocks for each test
    (reactRedux.useSelector as jest.MockedFunction<any>).mockReturnValue({
      user: {
        userName: 'testuser',
        contactInfo: {
          email: 'test@example.com',
          name: 'Test',
          lastName: 'User',
        },
        gender: 'Male',
        birthDay: '1990-01-01',
      }
    });


    // Mock Alert.alert
    Alert.alert = jest.fn((title, message, buttons) => {
      return undefined;
    });

    (EntryService as unknown as jest.Mock).mockImplementation(() => ({
      getClientEntriesByDate: mockGetEntries,
    }));
  });

  it('should render correctly', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Recent Entries')).toBeTruthy();
  });


});