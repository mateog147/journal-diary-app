import tokenReducer, { setToken } from '../../../src/store/reducers/token';

describe('token reducer', () => {
  it('should return the initial state', () => {
    expect(tokenReducer(undefined, { type: '@@INIT' })).toEqual({ token: '' });
  });

  it('should handle setToken', () => {
    const action = setToken('my-token');
    expect(tokenReducer({ token: '' }, action)).toEqual({ token: 'my-token' });
  });

  it('should clear token on LOGOUT action', () => {
    // Simulate a LOGOUT action
    const action = { type: 'LOGOUT', payload: '' };
    expect(tokenReducer({ token: 'my-token' }, action)).toEqual({ token: '' });
  });

  it('should not change token for unknown action', () => {
    const action = { type: 'UNKNOWN', payload: 'something' };
    expect(tokenReducer({ token: 'my-token' }, action)).toEqual({ token: 'my-token' });
  });
});
