import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { InternalDocuments } from '../ComponentsLibrary/InternalDocuments';

export const Documents: FC = () => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <InternalDocuments />
  </ThemeProvider>
);
