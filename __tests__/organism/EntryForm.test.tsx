import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {EntryForm} from '../../src/components/organism/EntryForm';
import {Alert} from 'react-native';
import * as reduxHooks from 'react-redux';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../../src/store/services/EntryService', () => ({
  EntryService: jest.fn(() => ({
    createEntry: jest.fn(),
    updateEntry: jest.fn(),
  })),
}));

describe('EntryForm', () => {
  const mockDispatch = jest.fn();
  const mockOnCreatedEntry = jest.fn();
  const mockCreateEntry = jest.fn();
  const mockUpdateEntry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(reduxHooks, 'useDispatch').mockReturnValue(mockDispatch);

    require('../../src/store/services/EntryService').EntryService.mockReturnValue(
      {
        createEntry: mockCreateEntry,
        updateEntry: mockUpdateEntry,
      },
    );

    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  it('renders correctly for new entry', () => {
    const {getByText} = render(
      <EntryForm onCreatedEntry={mockOnCreatedEntry} />,
    );

    expect(getByText('What are you thinking today?')).toBeTruthy();
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Story')).toBeTruthy();
    expect(getByText('Submit')).toBeTruthy();
  });

  it('renders correctly for editing an entry', () => {
    const mockEntry = {
      id: '1',
      title: 'Test Entry',
      content: 'Test Content',
    };

    const {getByText, getByDisplayValue} = render(
      <EntryForm onCreatedEntry={mockOnCreatedEntry} entry={mockEntry} />,
    );

    expect(getByText('Edit your entry')).toBeTruthy();
    expect(getByDisplayValue('Test Entry')).toBeTruthy();
    expect(getByDisplayValue('Test Content')).toBeTruthy();
    expect(getByText('Update')).toBeTruthy();
  });

  it('updates title and content inputs correctly', () => {
    const {getByPlaceholderText} = render(
      <EntryForm onCreatedEntry={mockOnCreatedEntry} />,
    );

    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('Story');

    fireEvent.changeText(titleInput, 'My New Title');
    fireEvent.changeText(contentInput, 'My new content for testing');

    expect(titleInput.props.onChangeText).toBeDefined();
    expect(contentInput.props.onChangeText).toBeDefined();
  });

  it('shows alert when submitting with empty fields', async () => {
    const {getByText} = render(
      <EntryForm onCreatedEntry={mockOnCreatedEntry} />,
    );

    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Title and content are required',
    );
    expect(mockCreateEntry).not.toHaveBeenCalled();
  });

  it('calls createEntry when submitting a new entry', async () => {
    mockCreateEntry.mockResolvedValue({
      id: '1',
      title: 'Test',
      content: 'Content',
    });

    const {getByText, getByPlaceholderText} = render(
      <EntryForm onCreatedEntry={mockOnCreatedEntry} />,
    );

    // Fill in the form
    fireEvent.changeText(getByPlaceholderText('Title'), 'Test Title');
    fireEvent.changeText(getByPlaceholderText('Story'), 'Test Content');

    // Submit the form
    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockCreateEntry).toHaveBeenCalledWith({
        title: 'Test Title',
        content: 'Test Content',
      });
      expect(mockOnCreatedEntry).toHaveBeenCalled();
    });
  });

  it('calls updateEntry when updating an existing entry', async () => {
    mockUpdateEntry.mockResolvedValue({
      id: '1',
      title: 'Updated',
      content: 'Updated Content',
    });

    const mockEntry = {
      id: '1',
      title: 'Original Title',
      content: 'Original Content',
    };

    const {getByText, getByDisplayValue} = render(
      <EntryForm onCreatedEntry={mockOnCreatedEntry} entry={mockEntry} />,
    );

    // Update the form
    fireEvent.changeText(getByDisplayValue('Original Title'), 'Updated Title');
    fireEvent.changeText(
      getByDisplayValue('Original Content'),
      'Updated Content',
    );

    // Submit the form
    const updateButton = getByText('Update');
    fireEvent.press(updateButton);

    await waitFor(() => {
      expect(mockUpdateEntry).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
        content: 'Updated Content',
      });
      expect(mockOnCreatedEntry).toHaveBeenCalled();
    });
  });
});
