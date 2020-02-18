import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import {
  ServicesRendered,
  ServicesRenderedClient,
} from '@kalos-core/kalos-rpc/ServicesRendered';
import {
  TimesheetLine,
  TimesheetLineClient,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { ENDPOINT } from '../../constants';

// add any prop types here
interface props {
  userID: number;
}

// map your state here
interface state {
  isLoading: boolean;
}

export class Timesheet extends React.PureComponent<props, state> {
  SRClient: ServicesRenderedClient;
  TimesheetLineClient: TimesheetLineClient;
  constructor(props: props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    this.SRClient = new ServicesRenderedClient(ENDPOINT);
    this.TimesheetLineClient = new TimesheetLineClient(ENDPOINT);
  }

  toggleLoading() {
    return new Promise(resolve => {
      this.setState(
        prevState => ({
          isLoading: !prevState.isLoading,
        }),
        resolve,
      );
    });
  }

  async fetchData() {
    const weekStart = this.getWeek();
    const srArr = weekStart.map(d => {
      const req = new ServicesRendered();
      req.setIsActive(1);
      req.setTechnicianUserId(this.props.userID);
      req.setDatetime(`${d}%`);
      req.setHideFromTimesheet(0);
      return this.SRClient.BatchGet(req);
    });
    const tlArr = weekStart.map(d => {
      const req = new TimesheetLine();
      req.setIsActive(1);
      req.setTechnicianUserId(this.props.userID);
      req.setTimeStarted(`${d}%`);
      return this.TimesheetLineClient.BatchGet(req);
    });
    const tlRes = await (await Promise.all(tlArr)).map((tlList, i) => {
      return tlList.toObject();
    });
    const srRes = (await Promise.all(srArr)).map((srList, i) => {
      const asObject = srList.toObject();
      asObject.resultsList = asObject.resultsList
        .map(sr => {
          const roundedStart = this.roundTime(sr.timeStarted);
          console.log(roundedStart);
          return sr;
        })
        .filter(sr => {
          const ids = tlRes[i].resultsList.map(tl => tl.servicesRenderedId);
          return !ids.includes(sr.id);
        })
        .filter(sr => {
          return sr.hideFromTimesheet === 0;
        });
      asObject.totalCount = asObject.resultsList.length;
      return asObject;
    });
    console.log(srRes, tlRes);
  }

  roundTime(ts: string) {
    const timeArr = ts.split(' ')[1].split(':');
    const min = parseInt(timeArr[1]);
    const roundedMin = (Math.round(min / 15) * 15) % 60;
    let minStr = roundedMin.toString();
    if (minStr.length === 1) {
      minStr = `0${minStr}`;
    }
    timeArr[1] = minStr;
    timeArr[2] = '00';
    const newTime = timeArr.join(':');
    return [ts.split(' ')[0], newTime].join(' ');
  }

  getWeek(arr?: string[], offset = -1): string[] {
    if (!arr) {
      arr = [];
    }
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + offset);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    if (month.length != 2) {
      month = `0${month}`;
    }
    if (day.length != 2) {
      day = `0${day}`;
    }
    arr = arr.concat(`${year}-${month}-${day}`);
    if (arr.length === 7) {
      return arr;
    } else {
      offset = offset + 1;
      return this.getWeek(arr, offset);
    }
  }

  async componentDidMount() {
    await this.SRClient.GetToken('test', 'test');
    await this.fetchData();
  }

  render() {
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        <h1>Timesheet!</h1>
      </ThemeProvider>
    );
  }
}
