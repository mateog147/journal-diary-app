import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../src/screens/LoginScreen';
import { Alert } from 'react-native';
import * as reactRedux from 'react-redux';

// Mock modules
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock BackHandler
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

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('LoginScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    isFocused: jest.fn(() => true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Alert.alert
    Alert.alert = jest.fn((title, message, buttons) => {
      return undefined;
    });
  });

  it('should render correctly', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    expect(getByText('Login')).toBeTruthy();
  });

  it('should show an alert when hardware back button is pressed', () => {
    // Act
    render(<LoginScreen navigation={mockNavigation} />);

    // Simulate hardware back button press
    const backHandler = require('react-native').BackHandler.handlers.hardwareBackPress[0];
    backHandler();

    // Assert
    expect(Alert.alert).toHaveBeenCalledWith(
      'Hold on!',
      'Are you sure you want to exit the app?',
      expect.arrayContaining([
        expect.objectContaining({
          text: 'Cancel',
          onPress: expect.any(Function),
          style: 'cancel',
        }),
        expect.objectContaining({ 
          text: 'YES', 
          onPress: expect.any(Function) 
        }),
      ])
    );
  });

  it('should exit app when confirmed', () => {
    // Mock Alert.alert to capture and execute the YES button callback
    Alert.alert = jest.fn((title, message, buttons) => {
      // Execute the YES button callback
      if (buttons && buttons[1] && buttons[1].onPress) {
        buttons[1].onPress();
      }
      return undefined;
    });

    // Act
    render(<LoginScreen navigation={mockNavigation} />);

    // Simulate hardware back button press
    const backHandler = require('react-native').BackHandler.handlers.hardwareBackPress[0];
    backHandler();

    // Assert
    expect(require('react-native').BackHandler.exitApp).toHaveBeenCalled();
  });
});