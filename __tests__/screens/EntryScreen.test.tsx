import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {EntryScreen} from '../../src/screens/EntryScreen';
import {Alert, BackHandler} from 'react-native';
import * as reactRedux from 'react-redux';

// Mock all required services and components
jest.mock('../../src/store/services/EntryService', () => ({
  EntryService: jest.fn(),
}));

jest.mock('../../src/store/services/UserService', () => ({
  UserService: jest.fn(),
}));

jest.mock('../../src/store/reducers/user', () => ({
  setUser: jest.fn((user) => ({ type: 'SET_USER', payload: user })),
  emptyUser: { userName: '', contactInfo: { email: '', name: '', lastName: '' } },
}));

import {EntryService} from '../../src/store/services/EntryService';
import {UserService} from '../../src/store/services/UserService';
import {setUser, emptyUser} from '../../src/store/reducers/user';

// Mock BackHandler
jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native');
  reactNative.BackHandler = {
    addEventListener: jest.fn(() => ({remove: jest.fn()})),
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

  const mockDispatch = jest.fn();
  const mockGetClient = jest.fn();
  const mockEntryService = {
    createEntry: jest.fn(),
    updateEntry: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useDispatch and useSelector
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(reactRedux, 'useSelector').mockImplementation((selector) => 
      selector({
        user: {
          user: {
            userName: 'testuser',
            contactInfo: {
              email: 'test@example.com',
              name: 'Test',
              lastName: 'User',
            },
            gender: 'Male',
            birthDay: '1990-01-01',
          },
        },
      })
    );


    (UserService as jest.MockedFunction<any>).mockReturnValue({
      getClient: mockGetClient,
    });

    (EntryService as jest.MockedFunction<any>).mockReturnValue(mockEntryService);


    Alert.alert = jest.fn();
  });


  it('should render correctly when user exists', () => {
    const {getByText} = render(
      <EntryScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('What are you thinking today?')).toBeTruthy();
  });


  it('should fetch user when no user exists', async () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation((selector) => 
      selector({
        user: {
          user: null, 
        },
      })
    );

    const mockFetchedUser = {
      userName: 'fetchedUser',
      contactInfo: {
        email: 'fetched@example.com',
        name: 'Fetched',
        lastName: 'User',
      },
      gender: 'Male',
      birthDay: '1990-01-01',
    };

    mockGetClient.mockResolvedValue(mockFetchedUser);

    render(<EntryScreen navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(mockGetClient).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(setUser(mockFetchedUser));
    });
  });

  // Test 3: User initialization when user exists but no userName
  it('should fetch user when user exists but has no userName', async () => {
    // Mock user without userName
    jest.spyOn(reactRedux, 'useSelector').mockImplementation((selector) => 
      selector({
        user: {
          user: {
            userName: '', // Empty username
            contactInfo: { email: '', name: '', lastName: '' },
          },
        },
      })
    );

    const mockFetchedUser = {
      userName: 'fetchedUser',
      contactInfo: {
        email: 'fetched@example.com',
        name: 'Fetched',
        lastName: 'User',
      },
      gender: 'Male',
      birthDay: '1990-01-01',
    };

    mockGetClient.mockResolvedValue(mockFetchedUser);

    render(<EntryScreen navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(mockGetClient).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(setUser(mockFetchedUser));
    });
  });

  // Test 4: Handle case when getClient returns null
  it('should handle when getClient returns null', async () => {
    // Mock no user in state
    jest.spyOn(reactRedux, 'useSelector').mockImplementation((selector) => 
      selector({
        user: {
          user: null,
        },
      })
    );

    mockGetClient.mockResolvedValue(null);

    render(<EntryScreen navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(mockGetClient).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(setUser(emptyUser));
    });
  });

  // Test 5: Handle case when getClient returns undefined
  it('should handle when getClient returns undefined', async () => {
    // Mock no user in state
    jest.spyOn(reactRedux, 'useSelector').mockImplementation((selector) => 
      selector({
        user: {
          user: null,
        },
      })
    );

    mockGetClient.mockResolvedValue(undefined);

    render(<EntryScreen navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(mockGetClient).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(setUser(emptyUser));
    });
  });

  // Test 6: Render with entry in route params (edit mode)
  it('should render in edit mode when route has entry param', () => {
    const entryMock = {
      id: '123',
      title: 'Test Entry',
      content: 'Test Content',
      userId: 'user123',
    };

    const routeWithEntry = {
      params: {
        entry: entryMock,
      },
    };

    const {getByText} = render(
      <EntryScreen navigation={mockNavigation} route={routeWithEntry} />,
    );

    // The component should render the EntryForm with the entry
    expect(getByText('Edit your entry')).toBeTruthy();
  });

  // Test 7: Handle route params change - entry added
  it('should update selectedEntry when route params change to include entry', () => {
    const entryMock = {
      id: '123',
      title: 'Test Entry',
      content: 'Test Content',
      userId: 'user123',
    };

    const {rerender, getByText} = render(
      <EntryScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Re-render with entry in route params
    const routeWithEntry = {
      params: {
        entry: entryMock,
      },
    };

    rerender(
      <EntryScreen navigation={mockNavigation} route={routeWithEntry} />,
    );

    // The component should now be in edit mode
    expect(getByText('Edit your entry')).toBeTruthy();
  });

  // Test 8: Handle route params change - entry removed
  it('should update selectedEntry when route params change to remove entry', () => {
    const entryMock = {
      id: '123',
      title: 'Test Entry',
      content: 'Test Content',
      userId: 'user123',
    };

    const routeWithEntry = {
      params: {
        entry: entryMock,
      },
    };

    const {rerender, getByText} = render(
      <EntryScreen navigation={mockNavigation} route={routeWithEntry} />,
    );

    // Initially should be in edit mode
    expect(getByText('Edit your entry')).toBeTruthy();

    // Re-render without entry in route params
    rerender(
      <EntryScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Should now be in create mode
    expect(getByText('What are you thinking today?')).toBeTruthy();
  });

  // Test 9: Handle route params change - entry updated
  it('should update selectedEntry when route params entry changes', () => {
    const entryMock1 = {
      id: '123',
      title: 'Test Entry 1',
      content: 'Test Content 1',
      userId: 'user123',
    };

    const entryMock2 = {
      id: '456',
      title: 'Test Entry 2',
      content: 'Test Content 2',
      userId: 'user123',
    };

    const routeWithEntry1 = {
      params: {
        entry: entryMock1,
      },
    };

    const routeWithEntry2 = {
      params: {
        entry: entryMock2,
      },
    };

    const {rerender, getByDisplayValue} = render(
      <EntryScreen navigation={mockNavigation} route={routeWithEntry1} />,
    );

    // Should show first entry
    expect(getByDisplayValue('Test Entry 1')).toBeTruthy();

    // Re-render with different entry
    rerender(
      <EntryScreen navigation={mockNavigation} route={routeWithEntry2} />,
    );

    // Should show second entry
    expect(getByDisplayValue('Test Entry 2')).toBeTruthy();
  });

  // Test 10: Handle entry creation success
  it('should navigate to Home screen after successful entry creation', async () => {
    const {getByText, getByPlaceholderText} = render(
      <EntryScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Fill form and submit
    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('Story');
    
    fireEvent.changeText(titleInput, 'New Entry');
    fireEvent.changeText(contentInput, 'New Content');

    mockEntryService.createEntry.mockResolvedValue({
      id: '123',
      title: 'New Entry',
      content: 'New Content',
    });

    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Main', {refresh: true});
    });
  });

  // Test 11: Handle entry update success
  it('should navigate to Main screen after successful entry update', async () => {
    const entryMock = {
      id: '123',
      title: 'Original Title',
      content: 'Original Content',
      userId: 'user123',
    };

    const routeWithEntry = {
      params: {
        entry: entryMock,
      },
    };

    const {getByText, getByDisplayValue} = render(
      <EntryScreen navigation={mockNavigation} route={routeWithEntry} />,
    );

    // Update form and submit
    const titleInput = getByDisplayValue('Original Title');
    const contentInput = getByDisplayValue('Original Content');
    
    fireEvent.changeText(titleInput, 'Updated Title');
    fireEvent.changeText(contentInput, 'Updated Content');

    mockEntryService.updateEntry.mockResolvedValue({
      id: '123',
      title: 'Updated Title',
      content: 'Updated Content',
    });

    const updateButton = getByText('Update');
    fireEvent.press(updateButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Main', {refresh: true});
    });
  });

  // Test 12: Handle empty form submission
  it('should show error when trying to submit empty form', async () => {
    const {getByText} = render(
      <EntryScreen navigation={mockNavigation} route={mockRoute} />,
    );

    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Title and content are required'
      );
    });
  });

  // Test 13: Handle API error during entry creation
  it('should show error when entry creation fails', async () => {
    const {getByText, getByPlaceholderText} = render(
      <EntryScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Fill form
    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('Story');
    
    fireEvent.changeText(titleInput, 'New Entry');
    fireEvent.changeText(contentInput, 'New Content');

    mockEntryService.createEntry.mockRejectedValue(new Error('API Error'));

    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'An error occurred while saving the entry'
      );
    });
  });

  // Test 14: Handle API returning null/undefined
  it('should show error when API returns null', async () => {
    const {getByText, getByPlaceholderText} = render(
      <EntryScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Fill form
    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('Story');
    
    fireEvent.changeText(titleInput, 'New Entry');
    fireEvent.changeText(contentInput, 'New Content');

    mockEntryService.createEntry.mockResolvedValue(null);

    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Failed to save entry. Please try again.'
      );
    });
  });

  // Test 15: Test component unmounting
  it('should handle component unmounting properly', () => {
    const {unmount} = render(
      <EntryScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // This should not throw any errors
    expect(() => unmount()).not.toThrow();
  });

  // Test 16: Test console.log calls (for code coverage)
  it('should log appropriate messages during initialization', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<EntryScreen navigation={mockNavigation} route={mockRoute} />);

    expect(consoleSpy).toHaveBeenCalledWith('usando efecto  :>> ');
    expect(consoleSpy).toHaveBeenCalledWith('user que ya esta :>> ', expect.any(Object));

    consoleSpy.mockRestore();
  });

  // Test 17: Test handleEntryCreated function
  it('should call handleEntryCreated and log message', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    const {getByText, getByPlaceholderText} = render(
      <EntryScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Fill form
    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('Story');
    
    fireEvent.changeText(titleInput, 'New Entry');
    fireEvent.changeText(contentInput, 'New Content');

    mockEntryService.createEntry.mockResolvedValue({
      id: '123',
      title: 'New Entry',
      content: 'New Content',
    });

    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);

    waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('handleEntryCreated');
    });

    consoleSpy.mockRestore();
  });

  // Test 18: Test loading state
  it('should show loading indicator during form submission', async () => {
    const {getByText, getByPlaceholderText, queryByText} = render(
      <EntryScreen navigation={mockNavigation} route={mockRoute} />,
    );

    // Fill form
    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('Story');
    
    fireEvent.changeText(titleInput, 'New Entry');
    fireEvent.changeText(contentInput, 'New Content');

    // Mock a delayed response
    let resolvePromise: ((value: any) => void) | undefined;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    mockEntryService.createEntry.mockReturnValue(delayedPromise);

    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);

    // During loading, Submit button should be hidden and loading should be shown
    await waitFor(() => {
      expect(queryByText('Submit')).toBeNull();
      // ActivityIndicator should be visible
    });

    // Resolve the promise
    if (resolvePromise) {
      resolvePromise({
        id: '123',
        title: 'New Entry',
        content: 'New Content',
      });
    }

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Main', {refresh: true});
    });
  });
});
