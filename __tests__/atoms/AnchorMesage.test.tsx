import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnchorMessage } from '../../src/components/atoms/AnchorMesage';
import { Text, TouchableOpacity } from 'react-native';

describe('AnchorMessage', () => {
  it('renders initial and bold text', () => {
    const { getByText } = render(
      <AnchorMessage initialText="Initial" boldText="Bold" />
    );
    expect(getByText('Initial')).toBeTruthy();
    expect(getByText('Bold')).toBeTruthy();
  });

  it('calls action when bold text is pressed', () => {
    const action = jest.fn();
    const { getByText } = render(
      <AnchorMessage initialText="Initial" boldText="Bold" action={action} />
    );
    const bold = getByText('Bold');
    fireEvent.press(bold);
    expect(action).toHaveBeenCalled();
  });

  it('logs to console if no action is provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getByText } = render(
      <AnchorMessage initialText="Initial" boldText="Bold" />
    );
    fireEvent.press(getByText('Bold'));
    expect(consoleSpy).toHaveBeenCalledWith({ boldText: 'Bold' });
    consoleSpy.mockRestore();
  });

  it('applies correct styles to texts', () => {
    const { getByText } = render(
      <AnchorMessage initialText="Initial" boldText="Bold" />
    );
    const initial = getByText('Initial');
    const bold = getByText('Bold');
    expect(initial.props.style).toEqual(
      expect.objectContaining({ fontSize: 17 })
    );
    expect(bold.props.style).toEqual(
      expect.objectContaining({ fontWeight: 'bold', fontSize: 17 })
    );
  });
});
