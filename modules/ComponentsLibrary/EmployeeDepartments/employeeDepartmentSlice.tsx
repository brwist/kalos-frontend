import { createSlice } from '@reduxjs/toolkit';
import { EmployeeFunction } from '@kalos-core/kalos-rpc/EmployeeFunction';

export const employeeDepartSlice = createSlice({
  name: 'employeeDepartment',
  initialState: {
    employeeDepartments:EmployeeFunction,
},
  reducers: {
    employeeDepart(state, action) {
      state.employeeDepartments = (action.payload)
    },
  },
})

export const { employeeDepart } = employeeDepartSlice.actions;

export const selectEmpDepartments = ((state) => state.employeeDepart);

export default employeeDepartSlice.reducer