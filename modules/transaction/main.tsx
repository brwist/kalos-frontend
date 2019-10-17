import * as React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import {
  TransactionAccount,
  TransactionAccountClient,
} from '@kalos-core/kalos-rpc/TransactionAccount';
import { TransactionUserView } from './components/user';

interface props {
  userId: number;
}

interface state {
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  userDepartmentID: number;
  accountList: TransactionAccount.AsObject[];
}

export class Transaction extends React.PureComponent<props, state> {
  UserClient: UserClient;
  TxnAccountClient: TransactionAccountClient;

  constructor(props: props) {
    super(props);
    this.state = {
      isLoading: false,
      isAdmin: false,
      isManager: false,
      userDepartmentID: 0,
      accountList: [],
    };
    this.UserClient = new UserClient();
    this.TxnAccountClient = new TransactionAccountClient();

    this.getUserData = this.getUserData.bind(this);
    this.addAccount = this.addAccount.bind(this);
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

  addAccount(acc: TransactionAccount.AsObject) {
    this.setState(prevState => ({
      accountList: prevState.accountList.concat(acc),
    }));
  }

  getAccountList() {
    const acc = new TransactionAccount();
    this.TxnAccountClient.List(acc, this.addAccount);
  }

  async componentDidMount() {
    await this.TxnAccountClient.GetToken(
      'robbie_m',
      'stature shortlist scarecrow glove',
    );
    await this.getAccountList();
    await this.getUserData();
  }

  render() {
    return (
      <TransactionUserView
        userId={this.props.userId}
        departmentId={this.state.userDepartmentID}
        accountList={this.state.accountList}
      />
    );
  }
}
