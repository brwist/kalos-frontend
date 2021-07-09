import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../../constants';
import { JSONToType } from './../../../helpers';

interface props {
  selected: number;
  disabled?: boolean;
  onSelect?(id: number): void;
  test?(item: User): boolean;
  sort?(a: User, b: User): number;
  showInactive?: boolean;
  label?: string;
  useDevClient?: boolean;
}

interface state {
  list: User[];
}

export class EmployeePicker extends React.PureComponent<props, state> {
  Client: UserClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
    };
    this.Client = new UserClient(ENDPOINT);

    this.handleSelect = this.handleSelect.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  handleSelect(e: React.SyntheticEvent<HTMLSelectElement>) {
    const id = parseInt(e.currentTarget.value);
    if (this.props.onSelect) {
      try {
        this.props.onSelect(id);
      } catch (err) {
        console.log(err);
      }
    }
  }

  addItem(item: User) {
    if (this.props.test) {
      if (this.props.test(item)) {
        this.setState(prevState => ({
          list: prevState.list.concat(item),
        }));
      }
    } else {
      this.setState(prevState => ({
        list: prevState.list.concat(item),
      }));
    }
  }

  async fetchUsers() {
    const user = new User();
    if (!this.props.showInactive) {
      user.setIsActive(1);
    }
    user.setIsEmployee(1);
    this.Client.List(user, this.addItem);
  }

  componentDidUpdate(prevProps: props, prevState: state) {
    if (
      (!prevProps.test && this.props.test) ||
      (prevProps.test && !this.props.test)
    ) {
      this.setState(
        {
          list: [],
        },
        this.fetchUsers,
      );
    }
    if (
      this.state.list.length > 0 &&
      prevState.list.length === this.state.list.length
    ) {
      const cacheList = localStorage.getItem('EMPLOYEE_LIST');
      if (!cacheList) {
        let newList = [];
        for (let i = 0; i < this.state.list.length; i++) {
          newList.push(this.state.list[i].toObject());
        }
        localStorage.setItem('EMPLOYEE_LIST', JSON.stringify(newList));
      }
    }
  }
  createUsers(userList: User[]) {
    let newUserList = [];

    for (let i = 0; i < userList.length; i++) {
      let tempUser = JSONToType(userList[i], new User());

      /*
      tempUser.setId(userList[i].id);
      tempUser.setFirstname(userList[i].firstname);
      tempUser.setLastname(userList[i].lastname);
      */
      newUserList.push(tempUser);
    }
    return newUserList;
  }
  componentDidMount() {
    const cacheListStr = localStorage.getItem('EMPLOYEE_LIST');
    if (cacheListStr) {
      const cacheList = JSON.parse(cacheListStr);

      if (cacheList && cacheList.length !== 0) {
        const tempList = this.createUsers(cacheList);
        this.setState({
          list: tempList,
        });
      } else {
        this.fetchUsers();
      }
    } else {
      this.fetchUsers();
    }
  }

  render() {
    console.log(this.state.list);
    const list = this.state.list.sort((a, b) =>
      `${a.getLastname()} ${a.getFirstname()}`
        .toLowerCase()
        .localeCompare(`${b.getLastname()} ${b.getFirstname()}`.toLowerCase()),
    );
    return (
      <FormControl style={{ marginBottom: 10 }}>
        <InputLabel htmlFor="cost-center-picker">
          {this.props.label || 'Employee'}
        </InputLabel>
        <NativeSelect
          disabled={this.props.disabled}
          value={this.props.selected}
          onChange={this.handleSelect}
          inputProps={{ id: 'cost-center-picker' }}
        >
          <option value={0}>Select Employee</option>
          {list.map(item => (
            <option
              value={item.getId()}
              key={`${item.getLastname()}-${item.getId()}`}
            >
              {item.getLastname()}, {item.getFirstname()}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    );
  }
}
