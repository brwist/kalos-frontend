import { useContext } from 'react';
import { EmployeesContext, CalendarDataContext } from './main';

export const useEmployees = () => useContext(EmployeesContext);
export const useCalendarData = () => useContext(CalendarDataContext);
