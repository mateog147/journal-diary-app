import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormSelectPiecker } from '../../src/components/molecules/FormSelectPiecker';

describe('FormSelectPiecker', () => {
  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ];

  it('renders with title and options', () => {
    const { getByText } = render(
      <FormSelectPiecker title="Select an option" value={1} setValue={jest.fn()} options={options} />
    );
    expect(getByText('Select an option')).toBeTruthy();
    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('calls setValue when an option is selected', () => {
    const setValue = jest.fn();
    const { getByText } = render(
      <FormSelectPiecker value={1} setValue={setValue} options={options} />
    );
    fireEvent.press(getByText('Option 2'));
    expect(setValue).toHaveBeenCalled();
  });

  it('shows error message when isInvalid is true', () => {
    const { getByText } = render(
      <FormSelectPiecker isInvalid errorMsg="This is an error" value={1} setValue={jest.fn()} options={options} />
    );
    expect(getByText('This is an error')).toBeTruthy();
  });

  it('shows default error message if errorMsg is not provided', () => {
    const { getByText } = render(
      <FormSelectPiecker isInvalid value={1} setValue={jest.fn()} options={options} />
    );
    expect(getByText('Error')).toBeTruthy();
  });
});
