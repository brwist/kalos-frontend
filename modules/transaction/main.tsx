import * as React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { TransactionAdminView } from './components/admin';
import { Loader } from '../Loader/main';
import { ENDPOINT } from '../../constants';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface props extends PageWrapperProps {
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
    this.UserClient = new UserClient(ENDPOINT);

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
        this.setState((prevState) => ({
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
        <PageWrapper {...this.props}>
          <TransactionAdminView
            userID={this.props.userID}
            userName={this.state.userName}
            departmentId={this.state.userDepartmentID}
            isSU={this.state.isSU}
          />
        </PageWrapper>
      );
    } else {
      return (
        <PageWrapper {...this.props}>
          <Loader />
        </PageWrapper>
      );
    }
  }
}
