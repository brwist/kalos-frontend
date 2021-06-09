import * as React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { TransactionAdminView } from './components/admin';
import { Loader } from '../Loader/main';
import { ENDPOINT, PERMISSION_DEPARTMENT } from '../../constants';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { PermissionGroup } from '@kalos-core/kalos-rpc/compiled-protos/user_pb';

interface props extends PageWrapperProps {
  userID: number;
  isAdmin: boolean;
}

interface state {
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  userDepartmentID: number;
  userHasMultipleDepartments: boolean;
  userDepartmentList: string;
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
      userDepartmentList: '0',
      userHasMultipleDepartments: false,
      userName: '',
      isSU: false,
    };
    this.UserClient = new UserClient(ENDPOINT);
    this.getUserData = this.getUserData.bind(this);
    this.getDepartmentList = this.getDepartmentList.bind(this);
  }

  async getUserData() {
    let userHasMultipleDepartments = false;
    const user = new User();
    user.setId(this.props.userID);
    const userData = await this.UserClient.Get(user);
    const deptList = this.getDepartmentList(userData.permissionGroupsList);
    if (deptList.includes(',')) {
      console.log('setting multi dpt to true!');
      userHasMultipleDepartments = true;
    }
    this.setState({
      isAdmin: userData.isAdmin === 1,
      isSU: userData.isSu === 1,
      userDepartmentID: userData.employeeDepartmentId,
      userName: `${userData.firstname} ${userData.lastname}`,
      isLoading: false,
      userDepartmentList: deptList,
      userHasMultipleDepartments,
    });
  }

  getDepartmentList(pgList: PermissionGroup.AsObject[]) {
    let departmentList: string[] = [];
    const dpts = pgList.filter(pg => pg.type === PERMISSION_DEPARTMENT);
    console.log({ pgList, dpts });
    if (dpts.length > 1) {
      console.log('dpts is long!');
      for (const d of dpts) {
        try {
          const filter: { key: string; value: string } = JSON.parse(
            d.filterData,
          );
          console.log(filter);
          departmentList = departmentList.concat(filter.value);
        } catch (e) {
          console.log('failed to parse filter data', e);
        }
      }
    }
    return departmentList.join(',');
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
    return (
      <PageWrapper {...this.props}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <TransactionAdminView
            userID={this.props.userID}
            userName={this.state.userName}
            departmentID={this.state.userDepartmentID}
            isSU={this.state.isSU}
            showMultipleDepartments={this.state.userHasMultipleDepartments}
            departmentIDList={this.state.userDepartmentList}
          />
        )}
      </PageWrapper>
    );
  }
}
