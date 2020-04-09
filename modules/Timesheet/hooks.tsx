import { useContext } from 'react';
import { EditTimesheetContext } from './main';

export const useEditTimesheet = () => useContext(EditTimesheetContext);
