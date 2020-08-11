import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import StylesProvider from '@material-ui/styles/StylesProvider';
import customTheme from '../Theme/main';
import {
  CustomerAccountDashboard,
  Props,
} from '../ComponentsLibrary/CustomerAccountDashboard';

export const CustomerDirectory: FC<Props> = props => (
  <StylesProvider injectFirst>
    <ThemeProvider theme={customTheme.lightTheme}>
      <CustomerAccountDashboard {...props} />
    </ThemeProvider>
  </StylesProvider>
);
