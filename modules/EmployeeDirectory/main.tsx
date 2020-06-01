import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';

interface Props {
  loggedUserId: number;
}

export const EmployeeDirectory: FC<Props> = ({ loggedUserId }) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <AdvancedSearch
      title="Employee Directory"
      kinds={['employees']}
      loggedUserId={loggedUserId}
      editableEmployees
      deletableEmployees
      printableEmployees
    />
  </ThemeProvider>
);
