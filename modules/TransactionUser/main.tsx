import * as React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { TransactionUserView } from './components/view';
import Grid from '@material-ui/core/Grid';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { Loader } from '../Loader/main';
import { TimesheetDepartmentClient } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { ENDPOINT } from '../../constants';

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
  DepartmentClient: TimesheetDepartmentClient;

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
    this.UserClient = new UserClient(ENDPOINT);

    this.DepartmentClient = new TimesheetDepartmentClient(ENDPOINT);

    this.getUserData = this.getUserData.bind(this);
    this.managerCheck = this.managerCheck.bind(this);
  }

  async getUserData() {
    const user = new User();
    user.setId(this.props.userID);
    const userData = await this.UserClient.Get(user);
    const isManager = await this.managerCheck();
    this.setState({
      isAdmin: userData.isAdmin === 1,
      isSU: userData.isSu === 1,
      userDepartmentID: userData.employeeDepartmentId,
      userName: `${userData.firstname} ${userData.lastname}`,
      isLoading: false,
      isManager,
    });
  }

  async managerCheck() {
    try {
      await this.DepartmentClient.getDepartmentByManagerID(this.props.userID);
      return true;
    } catch (err) {
      return false;
    }
  }

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
              <TransactionUserView
                userID={this.props.userID}
                userName={this.state.userName}
                departmentId={this.state.userDepartmentID}
                isManager={this.state.isManager}
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
