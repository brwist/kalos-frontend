import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { PerDiemComponent, Props } from '../ComponentsLibrary/PerDiem';

export const PerDiem: FC<Props> = props => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <PerDiemComponent {...props} />
  </ThemeProvider>
);
