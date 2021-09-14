import { createSlice } from '@reduxjs/toolkit';

export const PerDiemNeedsAuditingSlice = createSlice({
  name: 'perDiemNeedsAudit',
  initialState: {
    technicians:[
        { 
            label: null , 
            value: null 
        }
    ],
},
  reducers: {
    perDiemNeedsAudit(state, action) {
      state.technicians.push(action.payload)
    },
  },
})

export const { perDiemNeedsAudit } = PerDiemNeedsAuditingSlice.actions;

export const selectperDiemTechnicians = ((state) => state.perDiemNeedsAudit);

export default PerDiemNeedsAuditingSlice.reducer;
