import React from 'react';

interface props {}
interface state {}

export class SideMenu extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
  }
  render() {
    return <h1>Side-menu!</h1>;
  }
}
