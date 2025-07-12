import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '../../src/screens/HomeScreen';
import { Alert, BackHandler } from 'react-native';
import * as reactRedux from 'react-redux';


// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('react-native-calendars', () => ({
  Calendar: () => <div data-testid="mock-calendar">Mock Calendar</div>,
}));

jest.mock('../../src/store/services/EntryService', () => ({
  EntryService: jest.fn(),
}));
jest.mock('../../src/store/services/UserService', () => ({
  UserService: jest.fn(),
}));
import { EntryService } from '../../src/store/services/EntryService';
import { UserService } from '../../src/store/services/UserService';
import { setUser, emptyUser } from '../../src/store/reducers/user';
const mockGetEntries = jest.fn(() => Promise.resolve([]));
const mockGetClient = jest.fn();

describe('HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    isFocused: jest.fn(() => true),
  };

  const mockRoute = {
    params: {},
  };

  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (reactRedux.useDispatch as jest.MockedFunction<any>).mockReturnValue(mockDispatch);
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


    Alert.alert = jest.fn((title, message, buttons) => undefined);

    (EntryService as unknown as jest.Mock).mockImplementation(() => ({
      getClientEntriesByDate: mockGetEntries,
    }));
    (UserService as unknown as jest.Mock).mockImplementation(() => ({
      getClient: mockGetClient,
    }));
  });

  it('should render correctly', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Recent Entries')).toBeTruthy();
  });

  it('should fetch and dispatch user when missing', async () => {
    (reactRedux.useSelector as jest.MockedFunction<any>).mockReturnValue({ user: {} });
    const fetched = { userName: 'newuser', contactInfo: { email: 'a@b.com', name: 'A', lastName: 'B' }, gender: 'Other', birthDay: '2000-01-01' };
    mockGetClient.mockResolvedValue(fetched);
    render(<HomeScreen navigation={mockNavigation} route={mockRoute} />);
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setUser(fetched));
    });
  });

  it('should handle back button when focused', () => {
    let backCallback: any;
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_, cb) => {
      backCallback = cb;
      return { remove: jest.fn() };
    });
    render(<HomeScreen navigation={mockNavigation} route={mockRoute} />);
    const result = backCallback();
    expect(Alert.alert).toHaveBeenCalledWith(
      'Hold on!',
      'Are you sure you want exit',
      expect.any(Array)
    );
    const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
    const yes = buttons.find((b: any) => b.text === 'YES');
    yes.onPress();
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    expect(result).toBe(true);
  });

  it('should return false when not focused', () => {
    const nf = { ...mockNavigation, isFocused: jest.fn(() => false) };
    let backCallback: any;
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_, cb) => {
      backCallback = cb;
      return { remove: jest.fn() };
    });
    render(<HomeScreen navigation={nf} route={mockRoute} />);
    const res = backCallback();
    expect(res).toBe(false);
  });
});