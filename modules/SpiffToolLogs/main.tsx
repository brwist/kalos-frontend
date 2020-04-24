import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { SpiffTool, Props } from './components/SpiffTool';

export const SpiffToolLogs: FC<Props> = props => {
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <SpiffTool {...props} />
    </ThemeProvider>
  );
};
