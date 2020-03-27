import React from "react";
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';

type props {
  userId: number;
}

// map your state here
interface state {}

const Timesheet = ({ userId }) => {
  return (
    <ThemeProvider theme={customTheme.lightTheme}>

    </ThemeProvider>
  );
};

export default Timesheet;
