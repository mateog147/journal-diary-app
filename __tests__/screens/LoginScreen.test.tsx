import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {LoginScreen} from '../../src/screens/LoginScreen';
import {Alert, BackHandler} from 'react-native';
import * as reactRedux from 'react-redux';

jest.mock('../../src/store/services/AuthService', () => ({
  AuthService: jest.fn(),
}));

import {AuthService} from '../../src/store/services/AuthService';

// Mock BackHandler
jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native');
  reactNative.BackHandler = {
    addEventListener: jest.fn(() => ({remove: jest.fn()})),
    removeEventListener: jest.fn(),
    exitApp: jest.fn(),
    handlers: {
      hardwareBackPress: [jest.fn()],
    },
  };
  return reactNative;
});

// Mock Alert
const alertSpy = jest.spyOn(Alert, 'alert');
const backHandlerSpy = jest.spyOn(BackHandler, 'addEventListener');

const mockDispatch = jest.fn();
const mockGetClient = jest.fn();
const mockNavigation = {
  navigate: jest.fn(),
  isFocused: jest.fn(() => true),
};

const mockAuthService = {
  login: jest.fn(),
};

describe('LoginScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    isFocused: jest.fn(() => true),
  };

  const mockRoute = {
    params: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Alert.alert
    Alert.alert = jest.fn((title, message, buttons) => {
      // If the buttons array is provided, execute each button's onPress handler
      if (buttons && Array.isArray(buttons)) {
        buttons.forEach(button => {
          if (button.onPress) {
            // Don't automatically call onPress, we'll call it in the tests
          }
        });
      }
      return undefined;
    });

    (AuthService as jest.MockedFunction<any>).mockReturnValue(mockAuthService);
  });

  it('should render correctly', () => {
    jest
      .spyOn(reactRedux, 'useDispatch')
      .mockImplementation(() => mockDispatch);
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => ({
      token: '',
    }));
    const {getByText} = render(<LoginScreen navigation={mockNavigation} />);
    expect(getByText('Login')).toBeTruthy();
  });

  it('should navigate to Home screen after successful login', async () => {
    jest
      .spyOn(reactRedux, 'useDispatch')
      .mockImplementation(() => mockDispatch);
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(
      () => ({
        token: '',
      }),
    );
    const {getByText, getByPlaceholderText} = render(
      <LoginScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Fill form and submit
    const emailInput = getByPlaceholderText('email@email.com');
    const passwordInput = getByPlaceholderText('********');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(passwordInput, 'password123');

    mockAuthService.login.mockResolvedValue('token-123');

    const submitButton = getByText('Login');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('should navigate to Singup screen when singup button is pressed', () => {
    jest
      .spyOn(reactRedux, 'useDispatch')
      .mockImplementation(() => mockDispatch);
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(
      () => ({
        token: '',
      }),
    );
    const {getByText} = render(
      <LoginScreen navigation={mockNavigation} route={mockRoute} />,
    );

    const singupButton = getByText('Sing up');
    fireEvent.press(singupButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Singup');
  });

  it('should handle hardware back press when screen is focused', () => {
    // Mock the BackHandler and Alert for this test
    const mockExitApp = jest.fn();
    let storedCallback: any = null;
    
    // Save original implementations
    const originalBackHandler = BackHandler.addEventListener;
    const originalExitApp = BackHandler.exitApp;
    const originalAlert = Alert.alert;
    
    // Override with mocks
    BackHandler.addEventListener = jest.fn((event, callback) => {
      // Store the callback so we can trigger it
      storedCallback = callback;
      return { remove: jest.fn() };
    });
    BackHandler.exitApp = mockExitApp;
    
    Alert.alert = jest.fn((title, message, buttons) => {
      // Simulate pressing the YES button
      if (buttons && buttons.length > 1 && buttons[1] && typeof buttons[1].onPress === 'function') {
        buttons[1].onPress();
      }
      return undefined;
    });
    
    // Create a navigation mock with isFocused returning true
    const focusedNavigation = { ...mockNavigation, isFocused: jest.fn(() => true) };
    
    // Render component with our mocked navigation
    render(<LoginScreen navigation={focusedNavigation} />);
    
    // Verify addEventListener was called
    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function)
    );
    
    // Call the back button handler if it was stored
    let result;
    if (typeof storedCallback === 'function') {
      result = storedCallback();
    }
    
    // Verify Alert.alert was called with correct parameters
    expect(Alert.alert).toHaveBeenCalledWith(
      'Hold on!',
      'Are you sure you want to go back?',
      expect.any(Array)
    );
    
    // Verify exitApp was called (by the YES button handler)
    expect(mockExitApp).toHaveBeenCalled();
    
    // Verify the handler returns true to prevent default back behavior
    expect(result).toBe(true);
    
    // Restore original implementations
    BackHandler.addEventListener = originalBackHandler;
    BackHandler.exitApp = originalExitApp;
    Alert.alert = originalAlert;
  });
  
  it('should handle hardware back press when screen is not focused', () => {
    // Mock the BackHandler
    let storedCallback: any = null;
    
    // Save original implementation
    const originalBackHandler = BackHandler.addEventListener;
    
    // Override with mock
    BackHandler.addEventListener = jest.fn((event, callback) => {
      // Store the callback so we can trigger it
      storedCallback = callback;
      return { remove: jest.fn() };
    });
    
    // Create a navigation mock with isFocused returning false
    const unfocusedNavigation = { ...mockNavigation, isFocused: jest.fn(() => false) };
    
    // Render component with our mocked navigation
    render(<LoginScreen navigation={unfocusedNavigation} />);
    
    // Verify addEventListener was called
    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function)
    );
    
    // Call the back button handler if it was stored
    let result;
    if (typeof storedCallback === 'function') {
      result = storedCallback();
    }
    
    // Alert should not be called when screen is not focused
    expect(Alert.alert).not.toHaveBeenCalled();
    
    // Handler should return false to allow default back behavior
    expect(result).toBe(false);
    
    // Restore original implementation
    BackHandler.addEventListener = originalBackHandler;
  });
  
  it('should handle cancel button press in the alert dialog', () => {
    // Mock the BackHandler and Alert for this test
    const mockExitApp = jest.fn();
    let storedCallback: any = null;
    
    // Save original implementations
    const originalBackHandler = BackHandler.addEventListener;
    const originalExitApp = BackHandler.exitApp;
    const originalAlert = Alert.alert;
    
    // Override with mocks
    BackHandler.addEventListener = jest.fn((event, callback) => {
      // Store the callback so we can trigger it
      storedCallback = callback;
      return { remove: jest.fn() };
    });
    BackHandler.exitApp = mockExitApp;
    
    Alert.alert = jest.fn((title, message, buttons) => {
      // Simulate pressing the Cancel button
      if (buttons && buttons.length > 0 && buttons[0] && typeof buttons[0].onPress === 'function') {
        buttons[0].onPress();
      }
      return undefined;
    });
    
    // Create a navigation mock with isFocused returning true
    const focusedNavigation = { ...mockNavigation, isFocused: jest.fn(() => true) };
    
    // Render component with our mocked navigation
    render(<LoginScreen navigation={focusedNavigation} />);
    
    // Call the back button handler if it was stored
    if (typeof storedCallback === 'function') {
      storedCallback();
    }
    
    // Verify Alert.alert was called
    expect(Alert.alert).toHaveBeenCalled();
    
    // Verify exitApp was NOT called (Cancel was pressed)
    expect(mockExitApp).not.toHaveBeenCalled();
    
    // Restore original implementations
    BackHandler.addEventListener = originalBackHandler;
    BackHandler.exitApp = originalExitApp;
    Alert.alert = originalAlert;
  });
  
  it('should handle hardware back press when screen is not focused', () => {
    // Mock the BackHandler
    let storedCallback: any = null;
    
    // Save original implementation
    const originalBackHandler = BackHandler.addEventListener;
    
    // Override with mock
    BackHandler.addEventListener = jest.fn((event, callback) => {
      // Store the callback so we can trigger it
      storedCallback = callback;
      return { remove: jest.fn() };
    });
    
    // Create a navigation mock with isFocused returning false
    const unfocusedNavigation = { ...mockNavigation, isFocused: jest.fn(() => false) };
    
    // Render component with our mocked navigation
    render(<LoginScreen navigation={unfocusedNavigation} />);
    
    // Verify addEventListener was called
    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function)
    );
    
    // Call the back button handler if it was stored
    let result;
    if (typeof storedCallback === 'function') {
      result = storedCallback();
    }
    
    // Alert should not be called when screen is not focused
    expect(Alert.alert).not.toHaveBeenCalled();
    
    // Handler should return false to allow default back behavior
    expect(result).toBe(false);
    
    // Restore original implementation
    BackHandler.addEventListener = originalBackHandler;
  });
  
  it('should handle cancel button press in the alert dialog', () => {
    // Mock the BackHandler and Alert for this test
    const mockExitApp = jest.fn();
    let storedCallback: any = null;
    
    // Save original implementations
    const originalBackHandler = BackHandler.addEventListener;
    const originalExitApp = BackHandler.exitApp;
    const originalAlert = Alert.alert;
    
    // Override with mocks
    BackHandler.addEventListener = jest.fn((event, callback) => {
      // Store the callback so we can trigger it
      storedCallback = callback;
      return { remove: jest.fn() };
    });
    BackHandler.exitApp = mockExitApp;
    
    Alert.alert = jest.fn((title, message, buttons) => {
      // Simulate pressing the Cancel button
      if (buttons && buttons.length > 0 && buttons[0] && typeof buttons[0].onPress === 'function') {
        buttons[0].onPress();
      }
      return undefined;
    });
    
    // Create a navigation mock with isFocused returning true
    const focusedNavigation = { ...mockNavigation, isFocused: jest.fn(() => true) };
    
    // Render component with our mocked navigation
    render(<LoginScreen navigation={focusedNavigation} />);
    
    // Call the back button handler if it was stored
    if (typeof storedCallback === 'function') {
      storedCallback();
    }
    
    // Verify Alert.alert was called
    expect(Alert.alert).toHaveBeenCalled();
    
    // Verify exitApp was NOT called (Cancel was pressed)
    expect(mockExitApp).not.toHaveBeenCalled();
    
    // Restore original implementations
    BackHandler.addEventListener = originalBackHandler;
    BackHandler.exitApp = originalExitApp;
    Alert.alert = originalAlert;
  });
});
