import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { Alert, BackHandler } from 'react-native';
import { ProfileScreen } from '../../src/screens/ProfileScreen';
import * as reactRedux from 'react-redux';
import { COLORS } from '../../src/themes/constants/styles-constants';
import { setUser, emptyUser } from '../../src/store/reducers/user';

const alertSpy = jest.spyOn(Alert, 'alert');

// Mock BackHandler
jest.mock('react-native/Libraries/Utilities/BackHandler', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
}));

// Get the mocked BackHandler
const mockBackHandler = BackHandler as jest.Mocked<typeof BackHandler>;



jest.mock('../../src/store/services/UserService', () => ({
  UserService: jest.fn(),
}));

import { UserService } from '../../src/store/services/UserService';



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
    
    // Reset BackHandler mocks
    mockBackHandler.addEventListener.mockReturnValue({ remove: jest.fn() });

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

    const mockGetClientLocal = jest.fn(() => Promise.resolve({ ...mockUserResponse }));

    // Cuando se llame UserService(), retorna este objeto
    (UserService as unknown as jest.Mock).mockImplementation(() => ({
      getClient: mockGetClientLocal,
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
      expect(mockGetClientLocal).toHaveBeenCalled();
    });
  });

  it('should dispatch setUser action when user data is fetched successfully', async () => {
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

    mockGetClient.mockResolvedValue(mockUserResponse);
    
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
      expect(mockDispatch).toHaveBeenCalledWith(setUser(mockUserResponse));
    });
  });

  it('should dispatch emptyUser when getClient returns null', async () => {
    // Arrange
    mockGetClient.mockResolvedValue(null);
    
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
      expect(mockDispatch).toHaveBeenCalledWith(setUser(emptyUser));
    });
  });

  it('should handle back button press when screen is focused', () => {
    let backHandler: any;
    
    // Mock BackHandler.addEventListener to capture the callback
    mockBackHandler.addEventListener.mockImplementation((event: any, callback: any) => {
      backHandler = callback;
      return { remove: jest.fn() };
    });

    // Act
    render(<ProfileScreen navigation={mockNavigation} />);
    
    // Simulate back button press
    const result = backHandler();

    // Assert
    expect(Alert.alert).toHaveBeenCalledWith(
      'Hold on!',
      'Are you sure you want exit',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel' }),
        expect.objectContaining({ text: 'YES' })
      ])
    );
    expect(result).toBe(true);
  });

  it('should navigate to Login when YES is pressed in alert', () => {
    let backHandler: any;
    
    // Mock BackHandler.addEventListener to capture the callback
    mockBackHandler.addEventListener.mockImplementation((event: any, callback: any) => {
      backHandler = callback;
      return { remove: jest.fn() };
    });

    // Act
    render(<ProfileScreen navigation={mockNavigation} />);
    
    // Simulate back button press
    backHandler();

    // Get the buttons from the Alert.alert call
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertCall[2];
    const yesButton = buttons.find((button: any) => button.text === 'YES');
    
    // Simulate YES button press
    yesButton.onPress();

    // Assert
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('should handle Cancel button press in alert', () => {
    let backHandler: any;
    
    // Mock BackHandler.addEventListener to capture the callback
    mockBackHandler.addEventListener.mockImplementation((event: any, callback: any) => {
      backHandler = callback;
      return { remove: jest.fn() };
    });

    // Act
    render(<ProfileScreen navigation={mockNavigation} />);
    
    // Simulate back button press
    backHandler();

    // Get the buttons from the Alert.alert call
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertCall[2];
    const cancelButton = buttons.find((button: any) => button.text === 'Cancel');
    
    // Simulate Cancel button press
    const result = cancelButton.onPress();

    // Assert - should return null (do nothing)
    expect(result).toBeNull();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('should not fetch user data when user already exists', () => {
    // Arrange
    const mockUser = {
      userName: 'existinguser',
      contactInfo: {
        email: 'existing@example.com',
        name: 'Existing',
        lastName: 'User',
      },
      gender: 'Female',
      birthDay: '1985-05-15',
    };

    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => ({ user: mockUser }));

    // Act
    render(<ProfileScreen navigation={mockNavigation} />);

    // Assert
    expect(mockGetClient).not.toHaveBeenCalled();
  });

  it('should return false when back button is pressed and screen is not focused', () => {
    let backHandler: any;
    const mockUnfocusedNavigation = {
      ...mockNavigation,
      isFocused: jest.fn(() => false),
    };
    
    // Mock BackHandler.addEventListener to capture the callback
    mockBackHandler.addEventListener.mockImplementation((event: any, callback: any) => {
      backHandler = callback;
      return { remove: jest.fn() };
    });

    // Act
    render(<ProfileScreen navigation={mockUnfocusedNavigation} />);
    
    // Simulate back button press when not focused
    const result = backHandler();

    // Assert
    expect(result).toBe(false);
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('should display default values when user info is missing', () => {
    // Arrange
    const mockUser = {
      userName: 'testuser',
      contactInfo: {
        email: null,
        name: null,
        lastName: null,
      },
      gender: 'Male',
      birthDay: '1990-01-01',
    };

    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => ({ user: mockUser }));

    // Act
    const { getAllByText } = render(<ProfileScreen navigation={mockNavigation} />);

    // Assert - should display '-' for missing values
    const dashElements = getAllByText('-');
    expect(dashElements).toHaveLength(3); // name, lastName, and email should all show '-'
  });
});