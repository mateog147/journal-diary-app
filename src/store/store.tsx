import {configureStore} from '@reduxjs/toolkit';
import tokenReducer from './reducers/token';
import userReducer from './reducers/user';

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
