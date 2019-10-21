import * as React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { TransactionUserView } from './components/user';
import { LoginHelper } from '../LoginHelper/main';

interface props {
  userId: number;
}

interface state {
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  userDepartmentID: number;
}

export class Transaction extends React.PureComponent<props, state> {
  UserClient: UserClient;

  constructor(props: props) {
    super(props);
    this.state = {
      isLoading: false,
      isAdmin: false,
      isManager: false,
      userDepartmentID: 0,
    };
    this.UserClient = new UserClient();

    this.getUserData = this.getUserData.bind(this);
  }

  async getUserData() {
    const user = new User();
    user.setId(this.props.userId);
    const userData = await this.UserClient.Get(user);
    this.setState({
      isAdmin: userData.isSu === 1,
      userDepartmentID: userData.employeeDepartmentId,
    });
  }

  async componentDidMount() {
    await this.UserClient.GetToken(
      'robbie_m',
      'stature shortlist scarecrow glove',
    );
    await this.getUserData();
  }

  render() {
    return (
      <>
        <LoginHelper />
        <TransactionUserView
          userId={this.props.userId}
          departmentId={this.state.userDepartmentID}
        />
      </>
    );
  }
}
