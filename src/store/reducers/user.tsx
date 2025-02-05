import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IUser} from '../../interfaces/UserInterface';

export const emptyUser = {
  userName: '',
  contactInfo: {
    email: '',
    name: '',
    lastName: '',
  },
  gender: '',
  birthDay: '',
};
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {...emptyUser},
  },
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
  },
});

export const {setUser} = userSlice.actions;
export default userSlice.reducer;
