import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { ServiceCallDetails } from './components/ServiceCallDetails';

interface Props {
  userID: number;
}

export const ServiceCallEdit: FC<Props> = props => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <ServiceCallDetails {...props} />
  </ThemeProvider>
);
