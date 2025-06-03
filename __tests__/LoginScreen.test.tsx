import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../src/screens/LoginScreen';
import { Alert } from 'react-native';
import * as reactRedux from 'react-redux';



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

const mockDispatch = jest.fn();
const mockGetClient = jest.fn();
const mockNavigation = {
  navigate: jest.fn(),
  isFocused: jest.fn(() => true),
};

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
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => mockDispatch);
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => ({ token: '' }));
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    expect(getByText('Login')).toBeTruthy();
  });


});