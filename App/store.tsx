import { configureStore } from '@reduxjs/toolkit';
import logInReducer from '../modules/login/loginSlice';
import logReportReducer from '../modules/ComponentsLibrary/ActivityLogReport/logReportSlice';
import employeeDepartmentReducer from '../modules/ComponentsLibrary/EmployeeDepartments/employeeDepartmentSlice';
import billingAuditRepotReducer from '../modules/ComponentsLibrary/BillingAuditReport/billingAuditReportSlice';
import charityRepotReducer from '../modules/ComponentsLibrary/CharityReport/charityReportSlice';
import AdvancedSearchReducer from '../modules/ComponentsLibrary/AdvancedSearch/advancedSearchSlice';
import deletedServiceCallsReportReducer from '../modules/ComponentsLibrary/DeletedServiceCallsReport/deletedServicecallsReportSlice';
import eventsReportReducer from '../modules/ComponentsLibrary/EventsReport/eventsReportSlice';

export default configureStore({
  reducer: {
    loggedIn: logInReducer,
    logReport:logReportReducer,
    employeeDepart:employeeDepartmentReducer,
    billAuditReport:billingAuditRepotReducer,
    charityReport:charityRepotReducer,
    advancedSearch:AdvancedSearchReducer,
    deletedServiceCallsReport:deletedServiceCallsReportReducer,
    eventsReport:eventsReportReducer,
  },
})