import { createSlice } from '@reduxjs/toolkit';

export const employeeDepartSlice = createSlice({
  name: 'employeeDepartment',
  initialState: [
    { name: null , color: null, status: null, addedDate: null }
  ],
  reducers: {
    employeeDepart(state, action) {
      state.push(action.payload)
    },
  },
})

export const { employeeDepart } = employeeDepartSlice.actions;

export default employeeDepartSlice.reducer