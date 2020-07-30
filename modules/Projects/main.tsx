import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import {
  Projects as ProjectsComponent,
  Props,
} from '../ComponentsLibrary/Projects';

export const Projects: FC<Props> = props => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <ProjectsComponent {...props} />
  </ThemeProvider>
);
