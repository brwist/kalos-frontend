import { createSlice } from '@reduxjs/toolkit';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { User } from '@kalos-core/kalos-rpc/User';

export const payrollSlice = createSlice({
  name: 'payrollSlice',
  initialState: {
    payrolDeparts:TimesheetDepartment,
    payrolEmployees:User,
  },
  reducers: {
    addPayrolDeparts(state, action) {
      state.payrolDeparts = (action.payload)
    },
    addPayrolEmployees(state, action) {
      state.payrolEmployees = (action.payload)
    },
  },
})

export const { addPayrolDeparts, addPayrolEmployees } = payrollSlice.actions;

export const selectPayrollData = ((state) => state.payrollSlicer);

export default payrollSlice.reducer;
