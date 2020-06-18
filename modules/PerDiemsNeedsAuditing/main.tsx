import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { PerDiemsNeedsAuditing as PerDiemsNeedsAuditingComponent } from '../ComponentsLibrary/PerDiemsNeedsAuditing';

export const PerDiemsNeedsAuditing: FC = () => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <PerDiemsNeedsAuditingComponent />
  </ThemeProvider>
);
