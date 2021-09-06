import { configureStore } from '@reduxjs/toolkit';
import logInReducer from '../modules/login/loginSlice';
import logReportReducer from '../modules/ComponentsLibrary/ActivityLogReport/logReportSlice';
import employeeDepartmentReducer from '../modules/ComponentsLibrary/EmployeeDepartments/employeeDepartmentSlice';

export default configureStore({
  reducer: {
    loggedIn: logInReducer,
    logReport:logReportReducer,
    employeeDepart:employeeDepartmentReducer,
  },
})