import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { EntryScreen } from '../src/screens/EntryScreen';
import { Alert, BackHandler } from 'react-native';
import * as reactRedux from 'react-redux';



jest.mock('../src/store/services/EntryService', () => ({
  EntryService: jest.fn(),
}));

import { EntryService } from '../src/store/services/EntryService';

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
const alertSpy = jest.spyOn(Alert, 'alert');
const backHandlerSpy = jest.spyOn(BackHandler, 'addEventListener');

describe('EntryScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    isFocused: jest.fn(() => true),
  };

  const mockRoute = {
    params: {},
  };

  const mockSaveEntry = jest.fn();

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


    (EntryService as jest.MockedFunction<any>).mockReturnValue({
      saveEntry: mockSaveEntry,
    });

    // Mock Alert.alert
    Alert.alert = jest.fn((title, message, buttons) => {
      return undefined;
    });

    

  });

  it('should render correctly', () => {
    const { getByText } = render(<EntryScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('What are you thinking today?')).toBeTruthy();
  });

  /*it('should show an alert when hardware back button is pressed', () => {
    // Act
    render(<EntryScreen navigation={mockNavigation} route={mockRoute} />);

    // Simulate hardware back button press
    const backHandlerObject = require('react-native').BackHandler;
    const backHandler = backHandlerObject.handlers.hardwareBackPress[0];
    backHandler();

    // Assert
    expect(Alert.alert).toHaveBeenCalledWith(
      'Hold on!',
      'Are you sure you want to go back? Your changes will not be saved.',
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

  /*it('should navigate to Main tab with refresh parameter when exit is confirmed', () => {
    // Mock Alert.alert to capture and execute the YES button callback
    Alert.alert = jest.fn((title, message, buttons) => {
      // Execute the YES button callback
      if (buttons && buttons[1] && buttons[1].onPress) {
        buttons[1].onPress();
      }
      return undefined;
    });

    // Act
    render(<EntryScreen navigation={mockNavigation} route={mockRoute} />);

    // Simulate hardware back button press
    const backHandler = require('react-native').BackHandler.handlers.hardwareBackPress[0];
    backHandler();

    // Assert
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Main', { refresh: true });
  });*/
});