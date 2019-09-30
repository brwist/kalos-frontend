import React from "react";

interface props {}
interface state {}

export class Proposal extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
  }
  render() {
    return <h1>Proposal!</h1>;
  }
}
