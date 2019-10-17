import React, { SyntheticEvent } from 'react';
import {
  TransactionAccount,
  TransactionAccountClient,
} from '@kalos-core/kalos-rpc/TransactionAccount';
import {
  TimesheetDepartment,
  TimesheetDepartmentClient,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { Select } from '@blueprintjs/select';
import { Button, MenuItem } from '@blueprintjs/core';

const AccSelect = Select.ofType<TransactionAccount.AsObject>();

interface props<T> {
  onSelect?(item: T): void;
  selected?: number;
  isPrivileged?: boolean;
}

interface state<T> {
  list: T[];
  map: Map<number, T>;
  selected?: T;
}

export class TxnAccountSelect extends React.PureComponent<
  props<TransactionAccount.AsObject>,
  state<TransactionAccount.AsObject>
> {
  Client: TransactionAccountClient;
  constructor(props: props<TransactionAccount.AsObject>) {
    super(props);
    this.state = {
      list: [],
      map: new Map(),
      selected: undefined,
    };
    this.Client = new TransactionAccountClient();

    this.addAccount = this.addAccount.bind(this);
    this.getText = this.getText.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  addAccount(acc: TransactionAccount.AsObject) {
    const map = this.state.map;
    map.set(acc.id, acc);
    this.setState(prevState => ({
      map: map,
      list: prevState.list.concat(acc),
    }));
  }

  getAccountList() {
    const acc = new TransactionAccount();
    this.Client.List(acc, this.addAccount);
  }

  filter(query: string, acc: TransactionAccount.AsObject) {
    if (query.length === 0) {
      return false;
    }
    if (!isNaN(parseInt(query))) {
      return acc.id.toString().includes(query);
    }
    if (query.length === 1) {
      return acc.description[0].toLowerCase() === query.toLowerCase();
    }
    if (query.toLowerCase() === 'gas') {
      return acc.description.toLowerCase().includes('fuel');
    }
    return acc.description.toLowerCase().includes(query.toLowerCase());
  }

  //@ts-ignore
  renderItem(acc: TransactionAccount.AsObject, { handleClick, modifiers }) {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        label={`${acc.id}`}
        key={`${acc.id}-${acc.description}`}
        text={acc.description}
        onClick={handleClick}
      />
    );
  }

  handleSelect(acc: TransactionAccount.AsObject, e?: SyntheticEvent) {
    if (this.props.onSelect) {
      try {
        this.props.onSelect(acc);
      } catch (err) {
        console.log(err);
      }
    }
    this.setState({ selected: acc });
  }

  getText() {
    if (this.props.selected) {
      if (this.state.map.has(this.props.selected)) {
        return this.state.map.get(this.props.selected)!.description;
      }
    }
    if (this.state.selected) {
      return this.state.selected.description;
    }
    if (this.state.list.length > 0) {
      return this.state.list[0].description;
    }
    return 'Loading...';
  }

  componentDidMount() {
    this.getAccountList();
  }

  render() {
    return (
      <AccSelect
        items={this.state.list}
        itemRenderer={this.renderItem}
        itemPredicate={this.filter}
        onItemSelect={this.handleSelect}
      >
        <Button text={`Cost Center: ${this.getText()}`} fill />
      </AccSelect>
    );
  }
}

const DeptSelect = Select.ofType<TimesheetDepartment.AsObject>();

export class DepartmentSelect extends React.PureComponent<
  props<TimesheetDepartment.AsObject>,
  state<TimesheetDepartment.AsObject>
> {
  Client: TimesheetDepartmentClient;
  constructor(props: props<TimesheetDepartment.AsObject>) {
    super(props);
    this.state = {
      list: [],
      map: new Map(),
      selected: undefined,
    };
    this.Client = new TimesheetDepartmentClient();

    this.addDepartment = this.addDepartment.bind(this);
    this.getText = this.getText.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.render = this.render.bind(this);
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
    this.Client.List(dpt, this.addDepartment);
  }

  filter(query: string, dpt: TimesheetDepartment.AsObject) {
    if (!isNaN(parseInt(query))) {
      return dpt.id.toString().includes(query);
    }
    if (query.length === 1) {
      return dpt.description[0].toLowerCase() === query.toLowerCase();
    }
    if (query.toLowerCase() === 'gas') {
      return dpt.description.toLowerCase().includes('fuel');
    }
    return dpt.description.toLowerCase().includes(query.toLowerCase());
  }

  //@ts-ignore
  renderItem(dpt: TimesheetDepartment.AsObject, { handleClick, modifiers }) {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        label={`${dpt.id}`}
        key={`${dpt.id}-${dpt.description}`}
        text={dpt.description}
        onClick={handleClick}
      />
    );
  }

  handleSelect(dpt: TimesheetDepartment.AsObject, e?: SyntheticEvent) {
    if (this.props.onSelect) {
      try {
        this.props.onSelect(dpt);
      } catch (err) {
        console.log(err);
      }
    }
    this.setState({ selected: dpt });
  }

  getText() {
    if (this.props.selected) {
      if (this.state.map.has(this.props.selected)) {
        return this.state.map.get(this.props.selected)!.description;
      }
    }
    if (this.state.selected) {
      return this.state.selected.description;
    }
    if (this.state.list.length > 0) {
      return this.state.list[0].description;
    }
    return 'Loading...';
  }

  componentDidMount() {
    this.getDepartmentList();
  }

  render() {
    console.log(this);
    return (
      <DeptSelect
        items={this.state.list}
        itemRenderer={this.renderItem}
        itemPredicate={this.filter}
        onItemSelect={this.handleSelect}
      >
        <Button text={`Department: ${this.getText()}`} fill />
      </DeptSelect>
    );
  }
}
