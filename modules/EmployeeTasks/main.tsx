import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { Tasks } from '../ComponentsLibrary/Tasks';

interface Props {
  employeeId: number;
}

export const EmployeeTasks: FC<Props> = ({ employeeId }) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <Tasks externalCode="employee" externalId={employeeId} />
  </ThemeProvider>
);
