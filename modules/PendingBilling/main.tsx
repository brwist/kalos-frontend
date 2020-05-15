import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { ServiceCallsPending, Props } from './components/ServiceCallsPending';

export const PendingBilling: FC<Props> = props => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <ServiceCallsPending {...props} />
  </ThemeProvider>
);
