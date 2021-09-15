import { createSlice } from '@reduxjs/toolkit';
import { Event } from '@kalos-core/kalos-rpc/Event';

export const eventsReportSlice = createSlice({
  name: 'eventsReport',
  initialState: {
    eventsReport:Event,
},
  reducers: {
    eventReport(state, action) {
      state.eventsReport = (action.payload)
    },
  },
})

export const { eventReport } = eventsReportSlice.actions;

export const selectEventsReport = ((state) => state.eventsReport);

export default eventsReportSlice.reducer;
