import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { AddServiceCall } from './components/AddServiceCall';

export const AddServiceCallGeneral: FC = () => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <AddServiceCall />
  </ThemeProvider>
);
