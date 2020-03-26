import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { ServiceCallDetails, Props } from './components/ServiceCallDetails';

export const ServiceCallEdit: FC<Props> = props => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <ServiceCallDetails {...props} />
  </ThemeProvider>
);
