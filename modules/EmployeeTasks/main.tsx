import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { Tasks } from '../ComponentsLibrary/Tasks';

interface Props {
  loggedUserId: number;
  employeeId: number;
}

export const EmployeeTasks: FC<Props> = ({ employeeId, loggedUserId }) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <Tasks
      externalCode="employee"
      externalId={employeeId}
      loggedUserId={loggedUserId}
    />
  </ThemeProvider>
);
