import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { EventClient } from '@kalos-core/kalos-rpc/Event';
import { ENDPOINT } from '../../constants';
// add any prop types here
interface props {
  userID: number;
}

// map your state here
interface state {}

export class Dispatch extends React.PureComponent<props, state> {
  UserClient: UserClient;
  EventClient: EventClient;

  constructor(props: props) {
    super(props);
    this.EventClient = new EventClient(ENDPOINT);
    this.UserClient = new UserClient(ENDPOINT);
  }

  render() {
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        <h1>Dispatch!</h1>
      </ThemeProvider>
    );
  }
}
