import { createSlice } from '@reduxjs/toolkit';

export const eventsReportSlice = createSlice({
  name: 'eventsReport',
  initialState: {
    eventsReport:[{ 
        property: null , customerName: null, job: null, date: null, jobStatus: null, paymentStatus: null,
    },]
},
  reducers: {
    eventReport(state, action) {
      state.eventsReport.push(action.payload)
    },
  },
})

export const { eventReport } = eventsReportSlice.actions;

export const selectEventsReport = ((state) => state.eventsReport);

export default eventsReportSlice.reducer;
