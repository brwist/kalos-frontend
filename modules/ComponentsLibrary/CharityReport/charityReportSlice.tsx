
import { createSlice } from '@reduxjs/toolkit';

export const charitReportSlice = createSlice({
  name: 'charityReport',
  initialState: [{ 
        technician: null , contribution: null, averageHourly: null 
    }
  ],
  reducers: {
    charityReport(state, action) {
      state.push(action.payload)
    },
  },
})

export const { charityReport } = charitReportSlice.actions;

export const selectCharityReport = ((state) => state.charityReport);

export default charitReportSlice.reducer