import { createSlice } from '@reduxjs/toolkit';
import { SpiffType } from '@kalos-core/kalos-rpc/Task';

export const spiffToolLogEditSlice = createSlice({
  name: 'spiffToolLogEdit',
  initialState: {
    spiffTypes: SpiffType,
},
  reducers: {
    spiffToolType(state, action) {
      state.spiffTypes = (action.payload)
    },
  },
})

export const { spiffToolType } = spiffToolLogEditSlice.actions;

export const selectspiffToolTypes = ((state) => state.spiffToolLogEdit);

export default spiffToolLogEditSlice.reducer;
