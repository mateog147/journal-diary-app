import userReducer, { setUser, emptyUser } from '../../../src/store/reducers/user';
import { IUser } from '../../../src/interfaces/UserInterface';

describe('user reducer', () => {
  const mockUser: IUser = {
    userName: 'testUser',
    contactInfo: {
      email: 'test@example.com',
      name: 'Test',
      lastName: 'User',
    },
    gender: 'Male',
    birthDay: '1990-01-01',
  };

  it('should return the initial state', () => {
    expect(userReducer(undefined, { type: '@@INIT' })).toEqual({
      user: emptyUser,
    });
  });

  it('should handle setUser with valid user data', () => {
    const action = setUser(mockUser);
    const initialState = { user: emptyUser };
    expect(userReducer(initialState, action)).toEqual({
      user: mockUser,
    });
  });

  it('should handle setUser with partial user data', () => {
    const partialUser: IUser = {
      userName: 'partialUser',
      contactInfo: {
        email: 'partial@test.com',
        name: 'Partial',
        lastName: '',
      },
      gender: '',
      birthDay: '',
    };

    const action = setUser(partialUser);
    const initialState = { user: emptyUser };
    expect(userReducer(initialState, action)).toEqual({
      user: partialUser,
    });
  });

  it('should handle setUser with empty user', () => {
    const action = setUser(emptyUser);
    const initialState = { user: mockUser };
    expect(userReducer(initialState, action)).toEqual({
      user: emptyUser,
    });
  });

  it('should not change state for unknown action', () => {
    const action = { type: 'UNKNOWN', payload: mockUser };
    const initialState = { user: mockUser };
    expect(userReducer(initialState, action)).toEqual(initialState);
  });

  it('should handle LOGOUT action and reset user to empty state', () => {
    const initialState = { user: mockUser };
    expect(userReducer(initialState, { type: 'LOGOUT' })).toEqual({
      user: emptyUser,
    });
  });
});
