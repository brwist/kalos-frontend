import { createSlice } from '@reduxjs/toolkit'
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';

export const logReportSlice = createSlice({
  name: 'logReport',
  initialState: {
    logReports:ActivityLog,
  },
  reducers: {
    logReport(state, action) {
      state.logReports = (action.payload)
    },
  },
})

export const { logReport } = logReportSlice.actions;

export const selectLogReport = ((state) => state.logReport);

export default logReportSlice.reducer