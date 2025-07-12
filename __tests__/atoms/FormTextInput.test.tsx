import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {FormTextInput} from '../../src/components/atoms/FormTextInput';

describe('FormTextInput', () => {
  it('renders with default props', () => {
    const {getByPlaceholderText} = render(
      <FormTextInput placeholder="Type here" />,
    );
    expect(getByPlaceholderText('Type here')).toBeTruthy();
  });

  it('renders with a value', () => {
    const {getByDisplayValue} = render(
      <FormTextInput value="Hello" placeholder="Input" />,
    );
    expect(getByDisplayValue('Hello')).toBeTruthy();
  });

  it('calls onChangeAction when text changes', () => {
    const onChangeAction = jest.fn();
    const {getByPlaceholderText} = render(
      <FormTextInput placeholder="Change me" onChangeAction={onChangeAction} />,
    );
    const input = getByPlaceholderText('Change me');
    fireEvent.changeText(input, 'new value');
    expect(onChangeAction).toHaveBeenCalledWith('new value');
  });

  it('renders as secure input when isSecureInput is true', () => {
    const {getByPlaceholderText} = render(
      <FormTextInput placeholder="Password" isSecureInput />,
    );
    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('renders as numeric input when isNumeric is true', () => {
    const {getByPlaceholderText} = render(
      <FormTextInput placeholder="Number" isNumeric />,
    );
    const input = getByPlaceholderText('Number');
    expect(input.props.keyboardType).toBe('numeric');
  });

  it('respects maxLength prop', () => {
    const {getByPlaceholderText} = render(
      <FormTextInput placeholder="Max" maxLength={10} />,
    );
    const input = getByPlaceholderText('Max');
    expect(input.props.maxLength).toBe(10);
  });

  it('renders as multiline when multiline is true', () => {
    const {getByPlaceholderText} = render(
      <FormTextInput placeholder="Multi" multiline />,
    );
    const input = getByPlaceholderText('Multi');
    expect(input.props.multiline).toBe(true);
  });
});
