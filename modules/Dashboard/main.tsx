import React from "react";

interface props {
  userId: number;
}

interface state {}

export class Dashboard extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
  }
  render() {
    return <h1>Dashboard!</h1>;
  }
}