import { configureStore } from '@reduxjs/toolkit';
import logInReducer from '../modules/login/loginSlice';
import logReportReducer from '../modules/ComponentsLibrary/ActivityLogReport/logReportSlice';

export default configureStore({
  reducer: {
    loggedIn: logInReducer,
    logReport:logReportReducer,
  },
})