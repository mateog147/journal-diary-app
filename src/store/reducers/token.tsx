import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    token: '',
  },
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase('LOGOUT', (state) => {
      state.token = '';
    });
  },
});

export const {setToken} = tokenSlice.actions;
export default tokenSlice.reducer;
