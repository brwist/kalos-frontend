import * as React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { TransactionUserView } from './components/user';
import { LoginHelper } from '../LoginHelper/main';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

interface props {
  userID: number;
}

interface state {
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  userDepartmentID: number;
  userName: string;
}

export default class Transaction extends React.PureComponent<props, state> {
  UserClient: UserClient;

  constructor(props: props) {
    super(props);
    this.state = {
      isLoading: false,
      isAdmin: false,
      isManager: false,
      userDepartmentID: 0,
      userName: '',
    };
    this.UserClient = new UserClient();

    this.getUserData = this.getUserData.bind(this);
  }

  async getUserData() {
    const user = new User();
    user.setId(this.props.userID);
    const userData = await this.UserClient.Get(user);
    this.setState({
      isAdmin: userData.isSu === 1,
      userDepartmentID: userData.employeeDepartmentId,
      userName: `${userData.firstname} ${userData.lastname}`,
    });
  }

  async componentDidMount() {
    await this.getUserData();
  }

  render() {
    if (this.state.userName) {
      return (
        <>
          <CssBaseline />
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
          >
            <TransactionUserView
              userID={this.props.userID}
              userName={this.state.userName}
              departmentId={this.state.userDepartmentID}
            />
          </Grid>
        </>
      );
    } else {
      return (
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
        >
          <LoginHelper />
        </Grid>
      );
    }
  }
}
