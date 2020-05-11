import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { Search, Props } from './components/Search';

export const SearchIndex: FC<Props> = props => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <Search {...props} />
  </ThemeProvider>
);
