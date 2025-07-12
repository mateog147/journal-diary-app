import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {LoginForm} from '../../src/components/organism/LoginForm';
import {Alert} from 'react-native';
import * as reduxHooks from 'react-redux';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../src/store/services/AuthService', () => ({
  AuthService: jest.fn(() => ({
    login: jest.fn(),
  })),
}));

describe('LoginForm', () => {
  const mockDispatch = jest.fn();
  const mockLoginAction = jest.fn();
  const mockSingupAction = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(reduxHooks, 'useDispatch').mockReturnValue(mockDispatch);
    jest
      .spyOn(reduxHooks, 'useSelector')
      .mockReturnValue({token: 'mock-token'});

    require('../../src/store/services/AuthService').AuthService.mockReturnValue(
      {
        login: mockLogin,
      },
    );

    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  it('renders correctly', () => {
    const {getByText, getAllByText} = render(
      <LoginForm
        loginAction={mockLoginAction}
        singupAction={mockSingupAction}
      />,
    );

    expect(getByText('Welcome Back!')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Don´t have an account?')).toBeTruthy();
    expect(getByText('Sing up')).toBeTruthy();
  });

  it('calls login service with correct data when login button is pressed', async () => {
    mockLogin.mockResolvedValue('token123');

    const {getByText} = render(
      <LoginForm
        loginAction={mockLoginAction}
        singupAction={mockSingupAction}
      />,
    );

    const loginButton = getByText('Login');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockLoginAction).toHaveBeenCalled();
    });
  });

  it('shows alert when login fails', async () => {
    mockLogin.mockResolvedValue(null);

    const {getByText} = render(
      <LoginForm
        loginAction={mockLoginAction}
        singupAction={mockSingupAction}
      />,
    );

    const loginButton = getByText('Login');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Invalid user or password');
      expect(mockLoginAction).not.toHaveBeenCalled();
    });
  });

  it('navigates to signup when signup link is pressed', () => {
    const {getByText} = render(
      <LoginForm
        loginAction={mockLoginAction}
        singupAction={mockSingupAction}
      />,
    );

    const signupLink = getByText('Sing up');
    fireEvent.press(signupLink);

    expect(mockSingupAction).toHaveBeenCalled();
  });
});
