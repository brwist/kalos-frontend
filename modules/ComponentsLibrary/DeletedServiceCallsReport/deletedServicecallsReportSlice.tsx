import { createSlice } from '@reduxjs/toolkit';

export const deletedServiceCallsReportSlice = createSlice({
  name: 'deletedServiceCallsReport',
  initialState: {
    deletedServiceCalls:[{ 
        property: null , customerName: null, job: null, date: null, jobStatus: null 
    },]
},
  reducers: {
    deletedServiceCallsReport(state, action) {
      state.deletedServiceCalls.push(action.payload)
    },
  },
})

export const { deletedServiceCallsReport } = deletedServiceCallsReportSlice.actions;

export const selectdeletedServiceCallsReport = ((state) => state.deletedServiceCalls);

export default deletedServiceCallsReportSlice.reducer;
