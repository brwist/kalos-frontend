import React, { FC } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { Tasks } from '../ComponentsLibrary/Tasks';

interface Props {
  propertyId: number;
}

export const PropertyTasks: FC<Props> = ({ propertyId }) => (
  <ThemeProvider theme={customTheme.lightTheme}>
    <Tasks externalCode="properties" externalId={propertyId} />
  </ThemeProvider>
);
