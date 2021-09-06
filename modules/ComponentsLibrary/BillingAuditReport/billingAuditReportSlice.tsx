
import { createSlice } from '@reduxjs/toolkit';

export const billingAuditSlice = createSlice({
  name: 'billingAuditReport',
  initialState: {
    billReport:[{ 
        date: null , name: null, businessName: null, jobNumber: null, payable: null 
    },]
},
  reducers: {
    billAuditReport(state, action) {
      state.billReport.push(action.payload)
    },
  },
})

export const { billAuditReport } = billingAuditSlice.actions;

export const selectBillingReport = ((state) => state.billReport);

export default billingAuditSlice.reducer