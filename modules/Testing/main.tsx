import React from "react";
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';

// add any prop types here
interface props {
  userID: number;
}

// map your state here
interface state {}

export class Testing extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
  }
  render() {
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        <h1>Testing!</h1>
      </ThemeProvider>
    );
  }
}