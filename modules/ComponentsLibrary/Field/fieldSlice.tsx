import { createSlice } from '@reduxjs/toolkit';
import { User } from '@kalos-core/kalos-rpc/User';

export const fieldSlice = createSlice({
  name: 'fieldSlice',
  initialState: {
    technicianList: User,
},
  reducers: {
    addTechnicians(state, action) {
      state.technicianList = (action.payload)
    },
  },
})

export const { addTechnicians } = fieldSlice.actions;

export const selectTechnicains = ((state) => state.fieldSlicer);

export default fieldSlice.reducer;
