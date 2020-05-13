import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { ServiceCall, Props } from '../ComponentsLibrary/ServiceCall';

export const ServiceCallEdit: FC<Props> = props => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <ServiceCall {...props} />
  </ThemeProvider>
);
