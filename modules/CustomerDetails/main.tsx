import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { CustomerInformation } from '../ComponentsLibrary/CustomerInformation';
import { Properties } from './components/Properties';
import { ContractInfo } from './components/ContractInfo';

interface Props {
  userID: number;
  propertyId: number;
  loggedUserId: number;
}

export const CustomerDetails = (props: Props) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <CustomerInformation {...props} />
    <ContractInfo {...props} />
    <Properties {...props} />
  </ThemeProvider>
);
