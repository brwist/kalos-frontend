import * as React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { TransactionAdminView } from './components/admin';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Loader } from '../Loader/main';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';

interface props {
  userID: number;
  isAdmin: boolean;
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
    this.UserClient = new UserClient(
      this.props.userID,
      'https://core-dev.kalosflorida.com:8443',
    );

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

  toggleFlag(flag: keyof state) {
    return () => {
      if (typeof this.state[flag] === 'boolean') {
        //@ts-ignore
        this.setState(prevState => ({
          [flag]: !prevState[flag],
        }));
      }
    };
  }
  toggleAdmin = this.toggleFlag('isAdmin');
  toggleManager = this.toggleFlag('isManager');
  toggleSU = this.toggleFlag('isSU');
  toggleLoading = this.toggleFlag('isLoading');

  async componentDidMount() {
    await this.UserClient.GetToken('test', 'test');
    await this.getUserData();
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <ThemeProvider theme={customTheme.lightTheme}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="flex-start"
          >
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="center"
              style={{ maxHeight: '100%' }}
            >
              <TransactionAdminView
                userID={this.props.userID}
                userName={this.state.userName}
                departmentId={this.state.userDepartmentID}
                isSU={this.state.isSU}
              />
            </Grid>
          </Grid>
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={customTheme.lightTheme}>
          <Loader />
        </ThemeProvider>
      );
    }
  }
}
