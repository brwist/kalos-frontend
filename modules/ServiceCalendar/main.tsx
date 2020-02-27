import React from 'react';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Collapse from '@material-ui/core/Collapse';
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import customTheme from '../Theme/main';
import {ENDPOINT} from '../../constants';
import { timestamp } from '../../helpers';
import CallCard from './components/CallCard';

// add any prop types here
interface props {
  userId: number;
}

// map your state here
interface state {
  user: User.AsObject;
  date: string;
  defaultDate: string;
  calls: Event.AsObject[];
  completedCalls: Event.AsObject[];
  reminders: Event.AsObject[];
  isLoading: boolean;
  showCompleted: boolean;
}

export class ServiceCalendar extends React.PureComponent<props, state> {
  EventClient: EventClient;
  UserClient: UserClient;

  constructor(props: props) {
    super(props);
    this.state = {
      user: new User().toObject(),
      date: '',
      defaultDate: new Date().toISOString(),
      calls: [],
      completedCalls: [],
      reminders: [],
      isLoading: false,
      showCompleted: false,
    };
    this.EventClient = new EventClient(ENDPOINT);
    this.UserClient = new UserClient(ENDPOINT);

    this.fetchCalls = this.fetchCalls.bind(this);
    this.toggleShowCompletedClick = this.toggleShowCompletedClick.bind(this);
    // this.getDateString = this.getDateString.bind(this);
  }

  toggleLoading(): Promise<boolean> {
    return new Promise(resolve => {
      this.setState(
        prevState => ({
          isLoading: !prevState.isLoading,
        }),
        () => resolve(true),
      );
    });
  }

  async fetchCalls(page = 0) {
    if (page === 0) {
      await this.toggleLoading();
    }
    const reqObj = new Event();
    reqObj.setDateStarted(`${timestamp(true)} 00:00:00%`);
    reqObj.setPageNumber(page);
    const res = (await this.EventClient.BatchGet(reqObj)).toObject();
    const completedCalls = res.resultsList.filter(call => call.logJobStatus === 'Completed');
    const calls = res.resultsList.filter(call => call.logJobStatus !== 'Completed' && call.color !== 'ffbfbf');
    const reminders = res.resultsList.filter(call => call.color === 'ffbfbf');
    this.setState(
      prevState => ({
        completedCalls: prevState.completedCalls.concat(completedCalls),
        calls: prevState.calls.concat(calls),
        reminders: prevState.reminders.concat(reminders),
      }),
      async () => {
        if ((this.state.calls.length + this.state.completedCalls.length + this.state.reminders.length) !== res.totalCount) {
           page = page + 1;
          await this.fetchCalls(page);
        } else {
          await this.toggleLoading();
        }
      },
    );
  }

  async componentDidMount() {
    await this.UserClient.GetToken('test', 'test');
    await this.fetchCalls();
  }

  toggleShowCompletedClick(): void {
    this.setState(prevState => ({
      showCompleted: !prevState.showCompleted,
    }))
  };

  render() {
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        {!!this.state.completedCalls.length && (
          <IconButton
            // className={clsx(classes.expand, {
            //   [classes.expandOpen]: expanded,
            // })}
            onClick={this.toggleShowCompletedClick}
            aria-expanded={this.state.showCompleted}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
        <Collapse in={this.state.showCompleted}>
          {this.state.completedCalls
            .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
            .map(call => (
              <CallCard key={call.id} card={call} />
            ))}
        </Collapse>
        {this.state.reminders
          .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
          .map(call => (
            <CallCard key={call.id} card={call} reminder />
          ))}
        {this.state.calls
          .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
          .map(call => (
            <CallCard key={call.id} card={call} />
        ))}
      </ThemeProvider>
    );
  }
}