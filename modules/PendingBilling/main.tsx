import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { ServiceCallsPending } from './components/ServiceCallsPending';

export const PendingBilling: FC = props => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <ServiceCallsPending {...props} />
  </ThemeProvider>
);
