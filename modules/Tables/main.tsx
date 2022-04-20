import React from 'react';
import { Event, EventClient } from '../../@kalos-core/kalos-rpc/Event';

interface props {
  userId: number;
}

interface state {}

export class Table extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
  }
  render() {
    return <h1>Table!</h1>;
  }
}
