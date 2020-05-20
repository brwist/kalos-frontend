import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';

interface Props {
  loggedUserId: number;
}

export const SearchIndex: FC<Props> = ({ loggedUserId }) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <AdvancedSearch
      loggedUserId={loggedUserId}
      title="Search"
      kinds={['serviceCalls', 'customers', 'properties']}
      editableCustomers
      editableProperties
    />
  </ThemeProvider>
);
