import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';

interface Props {
  loggedUserId: number;
}

export const ServiceCallSearch: FC<Props> = props => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <AdvancedSearch
      {...props}
      title="Service Calls"
      kinds={['serviceCalls']}
      deletableEvents
    />
  </ThemeProvider>
);
