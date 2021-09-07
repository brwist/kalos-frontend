import { createSlice } from '@reduxjs/toolkit';

export const spiffToolLogEditSlice = createSlice({
  name: 'spiffToolLogEdit',
  initialState: {
    spiffTypes:[{ 
        label: null , value: null 
    },]
},
  reducers: {
    spiffToolType(state, action) {
      state.spiffTypes.push(action.payload)
    },
  },
})

export const { spiffToolType } = spiffToolLogEditSlice.actions;

export const selectspiffToolTypes = ((state) => state.spiffTypes);

export default spiffToolLogEditSlice.reducer;
