import React, { useEffect } from 'react';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Container from '@material-ui/core/Container';
import customTheme from '../Theme/main';
import {ENDPOINT} from '../../constants';
import { timestamp } from '../../helpers';
import Column from './components/Column';

type Props = {
  userId: number;
}

const userClient = new UserClient(ENDPOINT);

const ServiceCalendar = ({ userId }: Props) => {
  useEffect(() => {
    userClient.GetToken('test', 'test');
  }, []);

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      {/*<Filter></Filter>*/}
      <Container>
        <Column date={`${timestamp(true)} 00:00:00%`} />
      </Container>
    </ThemeProvider>
  );
};

export default ServiceCalendar;
