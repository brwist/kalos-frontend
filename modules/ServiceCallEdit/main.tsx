import React, { FC, useEffect } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import {UserClient} from '@kalos-core/kalos-rpc/User/index';
import customTheme from '../Theme/main';
import { ServiceCall, Props } from '../ComponentsLibrary/ServiceCall';
import {ENDPOINT} from '../../constants';

const userClient = new UserClient(ENDPOINT);

export const ServiceCallEdit: FC<Props> = props => {
  useEffect(() => {
    userClient.GetToken('test', 'test');
  });

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <ServiceCall {...props} />
    </ThemeProvider>
  );
};
