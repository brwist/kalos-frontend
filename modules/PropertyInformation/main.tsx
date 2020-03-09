import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { CustomerInformation } from '../ComponentsLibrary/CustomerInformation';
import { PropertyInfo } from './components/PropertyInfo';

interface Props {
  userID: number;
  propertyId: number;
  loggedUserId: number;
}

export const PropertyInformation = (props: Props) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <CustomerInformation {...props} />
    <PropertyInfo {...props} />
  </ThemeProvider>
);
