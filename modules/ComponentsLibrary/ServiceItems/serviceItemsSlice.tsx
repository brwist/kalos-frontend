import { createSlice } from '@reduxjs/toolkit';

export const serviceItemsSlice = createSlice({
  name: 'serviceItems',
  initialState: {
    serviceItems:[{ 
        id:null,
        type:null,
    },]
},
  reducers: {
    serviceItem(state, action) {
      state.serviceItems.push(action.payload)
    },
  },
})

export const { serviceItem } = serviceItemsSlice.actions;

export const selectServiceItems = ((state) => state.serviceItems);

export default serviceItemsSlice.reducer;
