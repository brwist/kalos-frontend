import { createSlice } from '@reduxjs/toolkit';

export const transactionTableSlice = createSlice({
  name: 'transactionTable',
  initialState: {
    employeesList:[{ 
        date: null , name: null, businessName: null, jobNumber: null, payable: null 
    },]
},
  reducers: {
    employeeList(state, action) {
      state.employeesList.push(action.payload)
    },
  },
})

export const { employeeList } = transactionTableSlice.actions;

export const selectEmployeesList = ((state) => state.employeesList);

export default transactionTableSlice.reducer;
