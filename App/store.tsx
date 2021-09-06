import { configureStore } from '@reduxjs/toolkit';
import logInReducer from '../modules/login/loginSlice';
import logReportReducer from '../modules/ComponentsLibrary/ActivityLogReport/logReportSlice';
import employeeDepartmentReducer from '../modules/ComponentsLibrary/EmployeeDepartments/employeeDepartmentSlice';
import billingAuditRepotReducer from '../modules/ComponentsLibrary/BillingAuditReport/billingAuditReportSlice';

export default configureStore({
  reducer: {
    loggedIn: logInReducer,
    logReport:logReportReducer,
    employeeDepart:employeeDepartmentReducer,
    billAuditReport:billingAuditRepotReducer,
  },
})