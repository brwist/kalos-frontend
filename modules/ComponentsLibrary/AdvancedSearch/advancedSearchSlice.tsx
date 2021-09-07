
import { createSlice } from '@reduxjs/toolkit';

export const AdvancedSearchSlice = createSlice({
  name: 'advancedSearch',
  initialState: {
    AdvancedEmployeeDepartment:[
        { 
            label: null , 
            value: null 
        }
    ],
    AdvancedJobType:[
        { 
            label: null , 
            value: null 
        }
    ],
    AdvancedJobSubType:[
        { 
            label: null , 
            value: null 
        }
    ],
},
  reducers: {
        advanceEmpDepart(state, action) {
            state.AdvancedEmployeeDepartment.push(action.payload)
        },
        advanceJobType(state, action) {
            state.AdvancedJobType.push(action.payload)
        },
        advanceJobSubType(state, action) {
            state.AdvancedJobSubType.push(action.payload)
        },
    },
})

export const { advanceEmpDepart, advanceJobType,advanceJobSubType } = AdvancedSearchSlice.actions;

export const selectAdvanceEmpDepart = ((state) => state.AdvancedEmployeeDepartment);
export const selectAdvanceJobType = ((state) => state.AdvancedJobType);
export const selectAdvanceJobSubType = ((state) => state.AdvancedJobSubType);

export default AdvancedSearchSlice.reducer;
