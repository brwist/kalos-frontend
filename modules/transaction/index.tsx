import React from "react";

interface props {}
interface state {}

export class Transaction extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
  }
  render() {
    return <h1>Transaction!</h1>;
  }
}
