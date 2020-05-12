import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { AddServiceCall, Props } from './components/AddServiceCall';

export const AddServiceCallGeneral: FC<Props> = props => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <AddServiceCall {...props} />
  </ThemeProvider>
);
