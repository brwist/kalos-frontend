import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';

interface props {
  selected: number;
  disabled?: boolean;
  onSelect?(id: number): void;
  test?(item: User.AsObject): boolean;
  sort?(a: User.AsObject, b: User.AsObject): number;
  showInactive?: boolean;
  label?: string;
}

interface state {
  list: User.AsObject[];
}

export class EmployeePicker extends React.PureComponent<props, state> {
  Client: UserClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
    };
    this.Client = new UserClient();

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

  addItem(item: User.AsObject) {
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

  componentDidMount() {
    this.fetchUsers();
  }

  render() {
    const list = this.state.list.sort((a, b) =>
      `${a.lastname} ${a.firstname}`
        .toLowerCase()
        .localeCompare(`${b.lastname} ${b.firstname}`.toLowerCase()),
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
            <option value={item.id} key={`${item.lastname}-${item.id}`}>
              {item.lastname}, {item.firstname}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    );
  }
}
