import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import {
  EditProject as EditProjectComponent,
  Props,
} from '../ComponentsLibrary/EditProject';

export const EditProject = (props: Props) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <EditProjectComponent {...props} />
  </ThemeProvider>
);
