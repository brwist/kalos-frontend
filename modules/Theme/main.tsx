import React from 'react';
import createMuiTheme, {
  ThemeOptions,
} from '@material-ui/core/styles/createMuiTheme';
import {
  green,
  red,
  blue,
  purple,
  deepOrange,
  orange,
} from '@material-ui/core/colors';

const { COLORS, ELEVATION } = require('../../constants');

interface props {
  userId: number;
}

interface state {}

export class Theme extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
  }
  render() {
    return <h1>Theme!</h1>;
  }
}

const customTheme = createMuiTheme({
  shape: {
    borderRadius: 4,
  },
  direction: 'rtl',
  palette: {
    primary: {
      light: '#FF908A',
      main: '#FF453A',
      dark: '#F20E00',
    },
    secondary: purple,
    background: {
      default: '#555770',
      paper: '#28293D',
    },
    text: {
      primary: '#FAFAFC',
      secondary: '#F2F2F5',
      hint: '#EBEBF0',
    },
    error: deepOrange,
    warning: orange,
    success: green,
    type: 'dark',
    info: blue,
  },
});

export default customTheme;
