import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { CustomerInformation } from '../ComponentsLibrary/CustomerInformation';
import { Properties } from './components/Properties';
import { ContractInfo } from './components/ContractInfo';

interface Props {
  userID: number;
  loggedUserId: number;
}

export const CustomerDetails = (props: Props) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <CustomerInformation
      {...props}
      renderChildren={customer => (
        <ContractInfo customer={customer} {...props}>
          <Properties {...props} />
        </ContractInfo>
      )}
    ></CustomerInformation>
  </ThemeProvider>
);
