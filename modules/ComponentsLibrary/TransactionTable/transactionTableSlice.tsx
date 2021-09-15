import { createSlice } from '@reduxjs/toolkit';
import { User } from '@kalos-core/kalos-rpc/User';
export const transactionTableSlice = createSlice({
  name: 'transactionTable',
  initialState: {
    employeesList:User,
},
  reducers: {
    employeeList(state, action) {
      state.employeesList = (action.payload)
    },
  },
})

export const { employeeList } = transactionTableSlice.actions;

export const selectEmployeesList = ((state) => state.transactionTable);

export default transactionTableSlice.reducer;
