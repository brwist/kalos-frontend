import React from "react";
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import {
  ServicesRenderedClient,
  ServicesRendered,
} from '@kalos-core/kalos-rpc/ServicesRendered';
import {
  TimesheetLineClient,
  TimesheetLine
} from '@kalos-core/kalos-rpc/TimesheetLine';
import customTheme from '../Theme/main';
import { ENDPOINT } from '../../constants';

const srClient = new ServicesRenderedClient(ENDPOINT);

type Props = {
  userId: number;
}

type State = {

}

const Timesheet = ({ userId }: Props) => {
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      blah?
    </ThemeProvider>
  );
};

export default Timesheet;
