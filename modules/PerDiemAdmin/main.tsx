import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { PerDiem, PerDiemClient } from '@kalos-core/kalos-rpc/PerDiem';
import customTheme from '../Theme/main';

// add any prop types here
interface props {
  userID: number;
}

// map your state here
interface state {
  departmentID: number;
  entries: PerDiem[];
}

export class PerDiemAdmin extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
  }
  render() {
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        <h1>PerDiem!</h1>
      </ThemeProvider>
    );
  }
}
