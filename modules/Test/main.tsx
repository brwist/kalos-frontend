import React from 'react';

interface props {
  userId: number;
}

interface state {
  customers: any[];
}

export class Test extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      customers: [],
    };
  }

  render() {
    return <div>Test 2!</div>;
  }
}
