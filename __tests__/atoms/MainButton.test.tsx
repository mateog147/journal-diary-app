import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MainButton } from '../../src/components/atoms/MainButton';

describe('MainButton', () => {
  it('renders with default props', () => {
    const { getByText } = render(<MainButton text="Click Me" />);
    const button = getByText('Click Me');
    expect(button).toBeTruthy();
    expect(button.props.style).toEqual(
      expect.objectContaining({ fontSize: 20, color: 'white', fontWeight: '600' })
    );
  });

  it('renders with custom width, backgroundColor, and color', () => {
    const { getByText } = render(
      <MainButton text="Custom" width={50} backgroundColor="#123456" color="#abcdef" />
    );
    const button = getByText('Custom');
    // Check text color
    expect(button.props.style).toEqual(
      expect.objectContaining({ color: '#abcdef' })
    );
  });

  it('calls action with text when pressed', () => {
    const action = jest.fn();
    const { getByText } = render(<MainButton text="Press" action={action} />);
    fireEvent.press(getByText('Press'));
    expect(action).toHaveBeenCalledWith('Press');
  });

  it('logs to console if no action is provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getByText } = render(<MainButton text="LogTest" />);
    fireEvent.press(getByText('LogTest'));
    expect(consoleSpy).toHaveBeenCalledWith({ text: 'LogTest' });
    consoleSpy.mockRestore();
  });
});
