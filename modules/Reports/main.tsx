import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { Reports as ReportsComponent } from '../ComponentsLibrary/Reports';

export const Reports: FC = () => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <ReportsComponent />
  </ThemeProvider>
);
