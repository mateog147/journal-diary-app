import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SingupForm } from '../../src/components/organism/SingupForm';
import { Alert } from 'react-native';
import * as reduxHooks from 'react-redux';

// Mock the redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock the AuthService and UserService
jest.mock('../../src/store/services/AuthService', () => ({
  AuthService: jest.fn(() => ({
    login: jest.fn(),
  })),
}));

jest.mock('../../src/store/services/UserService', () => ({
  UserService: jest.fn(() => ({
    singUp: jest.fn(),
  })),
}));

describe('SingupForm', () => {
  // Setup for common mocks
  const mockDispatch = jest.fn();
  const mockSingupAction = jest.fn();
  const mockGoToLoginAction = jest.fn();
  const mockLogin = jest.fn();
  const mockSingUp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock implementation for useDispatch
    jest.spyOn(reduxHooks, 'useDispatch').mockReturnValue(mockDispatch);
    
    // Mock implementation for useSelector
    jest.spyOn(reduxHooks, 'useSelector').mockReturnValue({ token: 'mock-token' });
    
    // Mock the service methods
    require('../../src/store/services/AuthService').AuthService.mockReturnValue({
      login: mockLogin,
    });
    
    require('../../src/store/services/UserService').UserService.mockReturnValue({
      singUp: mockSingUp,
    });

    // Mock Alert.alert
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <SingupForm singupAction={mockSingupAction} goToLoginAction={mockGoToLoginAction} />
    );
    
    expect(getByText('Create a new account')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('First name')).toBeTruthy();
    expect(getByText('Last name')).toBeTruthy();
    expect(getByText('Bith date')).toBeTruthy();
    expect(getByText('Gender')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Already have an account?')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('calls singUp service and login when form is submitted', async () => {
    // Mock successful signup and login
    mockSingUp.mockResolvedValue({ id: '1', name: 'Test User' });
    mockLogin.mockResolvedValue('token123');
    
    const { getByText } = render(
      <SingupForm singupAction={mockSingupAction} goToLoginAction={mockGoToLoginAction} />
    );
    
    const signupButton = getByText('Sign Up');
    fireEvent.press(signupButton);
    
    await waitFor(() => {
      expect(mockSingUp).toHaveBeenCalled();
      expect(mockLogin).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockSingupAction).toHaveBeenCalled();
    });
  });

  it('shows alert when signup fails', async () => {
    // Mock failed signup
    mockSingUp.mockResolvedValue(null);
    
    const { getByText } = render(
      <SingupForm singupAction={mockSingupAction} goToLoginAction={mockGoToLoginAction} />
    );
    
    const signupButton = getByText('Sign Up');
    fireEvent.press(signupButton);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error, please try again later');
      expect(mockSingupAction).not.toHaveBeenCalled();
    });
  });

  it('navigates to login when login link is pressed', () => {
    const { getByText } = render(
      <SingupForm singupAction={mockSingupAction} goToLoginAction={mockGoToLoginAction} />
    );
    
    const loginLink = getByText('Login');
    fireEvent.press(loginLink);
    
    expect(mockGoToLoginAction).toHaveBeenCalled();
  });
});
