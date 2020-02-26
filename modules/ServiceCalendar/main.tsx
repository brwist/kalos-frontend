import React from 'react';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
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
  isLoading: boolean;
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
      calls: [{
        id: 97379,
        propertyId: 8790,
        description: 'Replace 8 split - 11 Pine Lakes Pkwy N #0501, Palm Coast 32137',
        customer: {
          id: 90,
          firstname: 'Cube',
          lastname: 'Smart',
          businessname: 'CubeSmart',
        },
        property: {
          address: 'Address',
          city: 'City',
          zip: 10001,
          phone: '',
        },
        logTechnicianAssigned: 'Unassigned',
        name: 'name',
        timeStarted: '8:00 A',
        timeEnded: '6:00 P',
        jobType: 'jobType',
        jobSubtype: 'jobSubtype',
        logJobStatus: 'logJobStatus',
      }],
      isLoading: false,
    };
    this.EventClient = new EventClient(ENDPOINT);
    this.UserClient = new UserClient(ENDPOINT);

    this.fetchCalls = this.fetchCalls.bind(this);
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
    reqObj.setDateStarted(timestamp(true));
    reqObj.setPageNumber(page);
    const res = (await this.EventClient.BatchGet(reqObj)).toObject();
    this.setState(
      prevState => ({
        calls: prevState.calls.concat(res.resultsList),
      }),
      async () => {
        if (this.state.calls.length !== res.totalCount) {
          /* page = page + 1;
          await this.fetchCalls(page);*/
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

  render() {
    console.log(this.state.calls);
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        {this.state.calls.map(call => (
          <CallCard key={call.id} card={call} />
        ))}
      </ThemeProvider>
    );
  }
}