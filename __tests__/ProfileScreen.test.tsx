import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { ProfileScreen } from '../src/screens/ProfileScreen';
import * as reactRedux from 'react-redux';
import { COLORS } from '../src/themes/constants/styles-constants';

const alertSpy = jest.spyOn(Alert, 'alert');


jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native');
  reactNative.BackHandler = {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
    exitApp: jest.fn(),
    handlers: {
      hardwareBackPress: [jest.fn()],
    },
  };
  return reactNative;
});



jest.mock('../src/store/services/UserService', () => ({
  UserService: jest.fn(),
}));

import { UserService } from '../src/store/services/UserService';



describe('ProfileScreen', () => {
  // Setup mocks
  const mockDispatch = jest.fn();
  const mockGetClient = jest.fn();
  const mockNavigation = {
    navigate: jest.fn(),
    isFocused: jest.fn(() => true),
  };



  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Configure mocks for each test
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => mockDispatch);
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      // This allows us to use the actual selector function in tests
      return selector({
        user: {
          user: {
            userName: '',
            contactInfo: {
              email: '',
              name: '',
              lastName: '',
            },
            gender: '',
            birthDay: '',
          }
        }
      });
    });


    (UserService as unknown as jest.Mock).mockImplementation(() => ({
      getClient: mockGetClient,
    }));


  });

  it('should show loading indicator when user data is not available', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => ({
      user: {
        userName: '',
        contactInfo: {
          email: '',
          name: '',
          lastName: '',
        },
        gender: '',
        birthDay: '',
      }
    }));
    mockGetClient.mockImplementation(() => Promise.resolve(null));

    // Act
    const { getByTestId } = await render(<ProfileScreen navigation={mockNavigation} />);

    // Assert
    expect(getByTestId('loading-indicator')).toBeTruthy();
    expect(getByTestId('loading-indicator')).toHaveProp('color', COLORS.mainColor);
  });

  it('should display user information when data is available', async () => {
    // Arrange
    const mockUser = {
      userName: 'testuser',
      contactInfo: {
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
      },
      gender: 'Male',
      birthDay: '1990-01-01',
    };

    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => ({ user: mockUser }));

    // Act
    const { getByText, queryByTestId } = render(<ProfileScreen navigation={mockNavigation} />);

    // Assert
    expect(queryByTestId('loading-indicator')).toBeNull();
    expect(getByText('Test')).toBeTruthy();
    expect(getByText('User')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
  });

  it('should load user data if not available', async () => {

    // Arrange
    const mockUserResponse = {
      userName: 'testuser',
      contactInfo: {
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
      },
      gender: 'Male',
      birthDay: '1990-01-01',
    };

    const mockGetClient = jest.fn(() => Promise.resolve({ ...mockUserResponse }));

    // Cuando se llame UserService(), retorna este objeto
    (UserService as unknown as jest.Mock).mockImplementation(() => ({
      getClient: mockGetClient,
    }));
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => ({
      user: {
        userName: '',
        contactInfo: {
          email: '',
          name: '',
          lastName: '',
        },
        gender: '',
        birthDay: '',
      }
    }));

    // Act
    render(<ProfileScreen navigation={mockNavigation} />);

    // Assert
    await waitFor(() => {
      expect(mockGetClient).toHaveBeenCalled();
    });
  });

});