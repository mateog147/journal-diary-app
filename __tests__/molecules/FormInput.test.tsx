import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormInput } from '../../src/components/molecules/FormInput';

describe('FormInput', () => {
  it('renders with default props', () => {
    const { getByPlaceholderText } = render(<FormInput placeholder="Type here" />);
    expect(getByPlaceholderText('Type here')).toBeTruthy();
  });

  it('renders with a title', () => {
    const { getByText } = render(<FormInput title="My Title" />);
    expect(getByText('My Title')).toBeTruthy();
  });

  it('renders with a value', () => {
    const { getByDisplayValue } = render(
      <FormInput value="Hello" placeholder="Input" />
    );
    expect(getByDisplayValue('Hello')).toBeTruthy();
  });

  it('calls onChangeInput when text changes', () => {
    const onChangeInput = jest.fn();
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Change me" onChangeInput={onChangeInput} />
    );
    const input = getByPlaceholderText('Change me');
    fireEvent.changeText(input, 'new value');
    expect(onChangeInput).toHaveBeenCalledWith('new value');
  });

  it('shows error message when isInvalid is true', () => {
    const { getByText } = render(
      <FormInput isInvalid errorMsg="This is an error" />
    );
    expect(getByText('This is an error')).toBeTruthy();
  });

  it('shows default error message if errorMsg is not provided', () => {
    const { getByText } = render(<FormInput isInvalid />);
    expect(getByText('Error')).toBeTruthy();
  });

  it('renders as secure input when isSecureInput is true', () => {
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Password" isSecureInput />
    );
    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('renders as numeric input when isNumeric is true', () => {
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Number" isNumeric />
    );
    const input = getByPlaceholderText('Number');
    expect(input.props.keyboardType).toBe('numeric');
  });

  it('respects maxLength prop', () => {
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Max" maxLength={10} />
    );
    const input = getByPlaceholderText('Max');
    expect(input.props.maxLength).toBe(10);
  });

  it('renders as multiline when multiline is true', () => {
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Multi" multiline />
    );
    const input = getByPlaceholderText('Multi');
    expect(input.props.multiline).toBe(true);
  });
});
