import React from "react";
import { User, UserClient } from '@kalos-core/kalos-rpc/User';

import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import {ENDPOINT} from "../../constants";

// add any prop types here
interface props {
  userId: number;
}

// map your state here
interface state {
  user: User.AsObject;
}

export class ServiceCalendar extends React.PureComponent<props, state> {
  UserClient: UserClient;

  constructor(props: props) {
    super(props);
    this.state = {
      user: new User().toObject(),
    };
    this.UserClient = new UserClient(ENDPOINT);
  }

  async fetchUser() {
    const req = new User();
    req.setId(this.props.userId);

    const result = await this.UserClient.Get(req);
    this.setState({
      user: result,
    });
  }

  async componentDidMount() {
    await this.UserClient.GetToken('gavinorr', 'G@vin123');
    await this.fetchUser();
  }

  render() {
    console.log(this.state.user);
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        <h1>Service Calendar!</h1>
      </ThemeProvider>
    );
  }
}