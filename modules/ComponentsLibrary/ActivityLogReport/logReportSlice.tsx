import { createSlice } from '@reduxjs/toolkit'

export const logReportSlice = createSlice({
  name: 'logReport',
  initialState: [
    { date: null , user: null, notification: null }
  ],
  reducers: {
    logReport(state, action) {
      state.push(action.payload)
    },
  },
})

// Action creators are generated for each case reducer function
export const { logReport } = logReportSlice.actions;

export default logReportSlice.reducer