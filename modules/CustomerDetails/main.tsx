import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { CustomerInformation } from './components/CustomerInformation';

interface Props {
  userID: number;
  propertyId: number;
  loggedUserId: number;
}

export const CustomerDetails = (props: Props) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <CustomerInformation {...props} />
  </ThemeProvider>
);
