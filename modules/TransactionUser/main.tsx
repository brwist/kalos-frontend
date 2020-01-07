import * as React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { TransactionUserView } from '../Transaction/components/user';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ThemeProvider } from '@material-ui/core';
import customTheme from '../Theme/main';

interface props {
  userID: number;
  isProd?: boolean;
}

interface state {
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  userDepartmentID: number;
  userName: string;
  isSU: boolean;
}

export default class Transaction extends React.PureComponent<props, state> {
  UserClient: UserClient;

  constructor(props: props) {
    super(props);
    this.state = {
      isLoading: true,
      isAdmin: false,
      isManager: false,
      userDepartmentID: 0,
      userName: '',
      isSU: false,
    };
    this.UserClient = new UserClient('https://core-dev.kalosflorida.com:8443');

    this.getUserData = this.getUserData.bind(this);
  }

  async getUserData() {
    const user = new User();
    user.setId(this.props.userID);
    const userData = await this.UserClient.Get(user);
    this.setState({
      isAdmin: userData.isAdmin === 1,
      isSU: userData.isSu === 1,
      userDepartmentID: userData.employeeDepartmentId,
      userName: `${userData.firstname} ${userData.lastname}`,
      isLoading: false,
    });
  }

  async componentDidMount() {
    await this.UserClient.GetToken('test', 'test');
    await this.getUserData();
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <ThemeProvider theme={customTheme}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="flex-start"
          >
            <CssBaseline />
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="center"
              style={{ maxHeight: '100%' }}
            >
              <TransactionUserView
                userID={this.props.userID}
                userName={this.state.userName}
                departmentId={this.state.userDepartmentID}
                isProd={this.props.isProd}
              />
            </Grid>
          </Grid>
        </ThemeProvider>
      );
    } else {
      return (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ height: '100%' }}
        >
          <CircularProgress />
        </Grid>
      );
    }
  }
}
