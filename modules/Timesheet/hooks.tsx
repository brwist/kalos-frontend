import { useContext } from 'react';
import { EditTimesheetContext } from './main';
import { EmployeesContext } from '../ServiceCalendar/main';

export const useEmployees = () => useContext(EmployeesContext);
export const useEditTimesheet = () => useContext(EditTimesheetContext);
