import React from 'react';
import {
  TimesheetDepartment,
  TimesheetDepartmentClient,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
import {
  TransactionAccount,
  TransactionAccountClient,
} from '@kalos-core/kalos-rpc/TransactionAccount';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

interface props {
  onSelect?(id: number): void;
  selected?: number;
  isPrivileged?: boolean;
  isDisabled?: boolean;
  className?: string;
}

interface state<T> {
  list: T[];
  map: Map<number, T>;
  isOpen: boolean;
  anchorElement?: HTMLButtonElement;
}

export class DepartmentDropdown extends React.PureComponent<
  props,
  state<TimesheetDepartment.AsObject>
> {
  Client: TimesheetDepartmentClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
      map: new Map(),
      isOpen: false,
    };
    this.Client = new TimesheetDepartmentClient();

    this.addDepartment = this.addDepartment.bind(this);
    this.getText = this.getText.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  addDepartment(dpt: TimesheetDepartment.AsObject) {
    const map = this.state.map;
    map.set(dpt.id, dpt);
    this.setState(prevState => ({
      map: map,
      list: prevState.list.concat(dpt),
    }));
  }

  getDepartmentList() {
    const dpt = new TimesheetDepartment();
    dpt.setIsActive(1);
    this.Client.List(dpt, this.addDepartment);
  }

  handleSelect(e: React.SyntheticEvent) {
    if (this.props.onSelect) {
      try {
        const id = parseInt(e.currentTarget.id);
        if (!isNaN(id) && this.state.map.has(id)) {
          this.props.onSelect(id);
          this.setState({ anchorElement: undefined });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  getText() {
    if (this.props.selected) {
      if (this.state.map.has(this.props.selected)) {
        return this.state.map.get(this.props.selected)!.description;
      }
    }
    if (this.state.list.length > 0) {
      return this.state.list[0].description;
    }
    return 'Loading...';
  }

  componentDidMount() {
    this.getDepartmentList();
  }

  openMenu(e: React.SyntheticEvent<HTMLButtonElement>) {
    this.setState({ anchorElement: e.currentTarget });
  }

  closeMenu() {
    this.setState({ anchorElement: undefined });
  }

  renderItem(dpt: TimesheetDepartment.AsObject) {
    return (
      <MenuItem
        key={`${dpt.id}-${dpt.description}`}
        onClick={this.handleSelect}
        id={`${dpt.id}`}
      >
        {dpt.description}
      </MenuItem>
    );
  }

  render() {
    return (
      <>
        <Button
          style={{ height: 44, marginBottom: 5 }}
          disabled={this.props.isDisabled}
          onClick={this.openMenu}
          variant="contained"
          size="large"
          className={this.props.className}
        >
          {`Department: ${this.getText()}`}
        </Button>
        <Menu open={this.state.isOpen} onClose={this.closeMenu}>
          {this.state.list.map(this.renderItem)}
        </Menu>
      </>
    );
  }
}

export class AccountDropdown extends React.PureComponent<
  props,
  state<TransactionAccount.AsObject>
> {
  Client: TransactionAccountClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
      map: new Map(),
      isOpen: false,
    };
    this.Client = new TransactionAccountClient();

    this.addItem = this.addItem.bind(this);
    this.getText = this.getText.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  addItem(acc: TransactionAccount.AsObject) {
    const map = this.state.map;
    map.set(acc.id, acc);
    this.setState(prevState => ({
      map: map,
      list: prevState.list.concat(acc),
    }));
  }

  getList() {
    const acc = new TransactionAccount();
    acc.setIsActive(1);
    this.Client.List(acc, this.addItem);
  }

  handleSelect(e: React.SyntheticEvent) {
    if (this.props.onSelect) {
      try {
        const id = parseInt(e.currentTarget.id);
        if (!isNaN(id) && this.state.map.has(id)) {
          this.props.onSelect(id);
          this.setState({ anchorElement: undefined });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  getText() {
    if (this.props.selected) {
      if (this.state.map.has(this.props.selected)) {
        return this.state.map.get(this.props.selected)!.description;
      }
    }
    if (this.state.list.length > 0) {
      return this.state.list[0].description;
    }
    return 'Loading...';
  }

  componentDidMount() {
    this.getList();
  }

  openMenu(e: React.SyntheticEvent<HTMLButtonElement>) {
    this.setState({ anchorElement: e.currentTarget });
  }

  closeMenu() {
    this.setState({ anchorElement: undefined });
  }

  renderItem(dpt: TransactionAccount.AsObject) {
    return (
      <MenuItem
        key={`${dpt.id}-${dpt.description}`}
        onClick={this.handleSelect}
        id={`${dpt.id}`}
        style={{ height: 44 }}
      >
        {dpt.description}
      </MenuItem>
    );
  }

  render() {
    return (
      <>
        <Button
          style={{ height: 44, marginBottom: 5 }}
          disabled={this.props.isDisabled}
          onClick={this.openMenu}
          variant="contained"
          size="large"
        >
          {`Cost Center: ${this.getText()}`}
        </Button>
        <Menu
          open={Boolean(this.state.anchorElement)}
          anchorEl={this.state.anchorElement}
          onClose={this.closeMenu}
        >
          {this.state.list.map(this.renderItem)}
        </Menu>
      </>
    );
  }
}
