import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { Tasks } from '../ComponentsLibrary/Tasks';

interface Props {
  loggedUserId: number;
  customerId: number;
}

export const CustomerTasks: FC<Props> = ({ customerId, loggedUserId }) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <Tasks
      externalCode="customers"
      externalId={customerId}
      loggedUserId={loggedUserId}
    />
  </ThemeProvider>
);
