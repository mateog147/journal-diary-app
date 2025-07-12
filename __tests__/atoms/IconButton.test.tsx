import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { IconButton } from '../../src/components/atoms/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

describe('IconButton', () => {
  it('renders with default props', () => {
    const { getByTestId } = render(<IconButton iconName="add" />);
    const icon = getByTestId('icon-button-icon');
    expect(icon).toBeTruthy();
  });

  it('renders with custom size, color, and borderRadius', () => {
    const { getByTestId } = render(
      <IconButton iconName="star" size={60} color="#123456" borderRadius={30} />
    );
    const icon = getByTestId('icon-button-icon');
    expect(icon.props.size).toBe(54); // size-6
    expect(icon.props.name).toBe('star');
  });

  it('calls action when pressed', () => {
    const action = jest.fn();
    const { getByRole } = render(
      <IconButton iconName="heart" action={action} />
    );
    const button = getByRole('button');
    fireEvent.press(button);
    expect(action).toHaveBeenCalledWith('');
  });

  it('logs to console if no action is provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getByRole } = render(
      <IconButton iconName="alert" />
    );
    const button = getByRole('button');
    fireEvent.press(button);
    expect(consoleSpy).toHaveBeenCalledWith('icon buton press');
    consoleSpy.mockRestore();
  });
});
