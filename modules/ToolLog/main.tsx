import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { SpiffTool } from '../SpiffToolLogs/components/SpiffTool';

interface Props {
  loggedUserId: number;
}

export const ToolLog: FC<Props> = props => {
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <SpiffTool type="Tool" {...props} />
    </ThemeProvider>
  );
};
