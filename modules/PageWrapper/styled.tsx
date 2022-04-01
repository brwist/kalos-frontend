import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import StylesProvider from '@material-ui/styles/StylesProvider';
import customTheme from '../Theme/main';

export const StyledPage: FC = ({ children }) => (
  <StylesProvider>
    <ThemeProvider theme={customTheme.lightTheme}>{children}</ThemeProvider>
  </StylesProvider>
);
