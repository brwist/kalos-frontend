import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import {
  Reports as ReportsComponent,
  Props,
} from '../ComponentsLibrary/Reports';

export const Reports: FC<Props> = props => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <ReportsComponent {...props} />
  </ThemeProvider>
);
