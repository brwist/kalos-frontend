import React from 'react';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { EventClient } from '@kalos-core/kalos-rpc/Event';
import { ENDPOINT } from '../../constants';
import { PageWrapper } from '../PageWrapper/main';

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
      <PageWrapper userID={this.props.userID} padding={1}>
        <h1>Dispatch!</h1>
      </PageWrapper>
    );
  }
}
