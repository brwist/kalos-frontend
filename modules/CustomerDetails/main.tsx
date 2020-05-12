import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import {
  CustomerDetails as CustomerDetailsComponent,
  Props,
} from './components/CustomerDetails';

export const CustomerDetails = (props: Props) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <CustomerDetailsComponent {...props} />
  </ThemeProvider>
);
