import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
  name: 'logedinUser',
  initialState: {
    loggedUser: { id: null , userName: '', password: '' },
  },
  reducers: {
    loggedIn(state, action) {
      state.loggedUser = (action.payload)
    },
  },
});

export const { loggedIn } = loginSlice.actions;

export const selectLoggedUser = ((state) => state.loggedIn);

export default loginSlice.reducer;