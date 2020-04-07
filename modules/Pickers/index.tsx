import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
  TransactionAccount,
  TransactionAccountClient,
} from '@kalos-core/kalos-rpc/TransactionAccount';
import {
  TimesheetDepartment,
  TimesheetDepartmentClient,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
import {
  TimesheetClassCode,
  TimesheetClassCodeClient,
} from '@kalos-core/kalos-rpc/ClassCode';
import { ENDPOINT } from '../../constants';

interface props<R, T> {
  selected: T[keyof T] | number;
  disabled?: boolean;
  withinForm?: boolean;
  hideInactive?: boolean;
  reqObj?: {
    new (): R;
  };
  client?: {
    new (endpoint: string): Client<R, T>;
  };
  onSelect?(id: number): void;
  onSelect?(e: React.SyntheticEvent<HTMLSelectElement>): void;
  test?(item: T): boolean;
  sort?(a: T, b: T): number;
  filter?(a: T): boolean;
  renderItem(item: T): JSX.Element;
}

interface Client<R, T> {
  BatchGet(req: R): Promise<BatchRes<T>>;
  Get(req: R): Promise<T>;
  Delete(req: R): Promise<T>;
  Create(req: R): Promise<T>;
  Update(req: R): Promise<T>;
}

type BatchRes<T> = {
  toObject(): { resultsList: T[]; totalCount: number };
};

interface state<T> {
  list: T[];
}

class Picker<R, T> extends React.PureComponent<props<R, T>, state<T>> {
  Client?: Client<R, T>;
  req?: R;
  key: string;
  ver: number;
  label: string;
  constructor(props: props<R, T>, label: string, key: string, ver: number) {
    super(props);
    this.state = {
      list: [],
    };
    this.label = label;
    this.key = key;
    this.ver = ver;
    this.handleSelect = this.handleSelect.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  handleSelect(e: React.SyntheticEvent<HTMLSelectElement>) {
    const id = parseInt(e.currentTarget.value);
    if (this.props.onSelect) {
      try {
        if (this.props.withinForm) {
          this.props.onSelect(e);
        } else if (!this.props.withinForm) {
          this.props.onSelect(id);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async fetchData() {
    const res = await this.Client?.BatchGet(this.req!);
    return res!.toObject().resultsList;
  }

  async componentDidMount() {
    await this.handleCache();
  }

  async handleCache() {
    const cache = new Cache<T[]>(this.key, this.ver, this.fetchData);
    console.log('checking cache');
    const data = cache.getItem();
    if (!data) {
      console.log('no data found, busting and updating');
      const freshData = await cache.update();
      if (freshData) {
        console.log('fresh data found! adding to state');
        this.setState({ list: freshData });
      } else {
        console.log('no data found?');
      }
    } else {
      console.log('data found! adding to state');
      this.setState({ list: data });
    }
  }

  render() {
    let list = this.state.list;
    if (this.props.sort) {
      list = this.state.list.sort(this.props.sort);
    }

    if (this.props.filter) {
      list = list.filter(this.props.filter);
    }

    return (
      <FormControl style={{ marginBottom: 10 }}>
        <InputLabel htmlFor={`${this.label}-picker`}>{this.label}</InputLabel>
        <NativeSelect
          disabled={this.props.disabled}
          value={this.props.selected}
          onChange={this.handleSelect}
          IconComponent={undefined}
          inputProps={{ id: `${this.label}-picker` }}
        >
          <option value={0}>Select {this.label}</option>
          {list.map(this.props.renderItem)}
        </NativeSelect>
      </FormControl>
    );
  }
}

class Cache<T> {
  key: string;
  version: number;
  fetchData: () => Promise<T>;
  constructor(key: string, version: number, fetchFn: () => Promise<T>) {
    this.key = `${key}_${version}`;
    this.version = version;
    this.fetchData = fetchFn;
  }

  getItem = () => {
    const dataAsStr = localStorage.getItem(`${this.key}_${this.version}`);
    if (!dataAsStr || dataAsStr === '') {
      return;
    } else {
      try {
        const data: T = JSON.parse(dataAsStr);
        return data;
      } catch (err) {
        console.log(err);
        return;
      }
    }
  };

  setItem = (data: T) => {
    try {
      const dataAsStr = JSON.stringify(data);
      localStorage.setItem(`${this.key}_${this.version}`, dataAsStr);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  clearHistory = () => {
    let version = this.version - 1;
    while (version > 0) {
      try {
        localStorage.removeItem(`${this.key}_${version}`);
      } catch (err) {
        console.log(err);
      }
      version = version - 1;
    }
  };

  update = async () => {
    this.clearHistory();
    const freshData = await this.fetchData();
    try {
      const strData = JSON.stringify(freshData);
      localStorage.setItem(`${this.key}_${this.version}`, strData);
      return freshData;
    } catch (err) {
      console.log(err);
    }
  };
}

export class AccountPicker extends Picker<
  TransactionAccount,
  TransactionAccount.AsObject
> {
  constructor(props: props<TransactionAccount, TransactionAccount.AsObject>) {
    super(props, 'Purchase Type', 'COST_CENTER_LIST', 5);
    this.Client = new TransactionAccountClient(ENDPOINT);
    this.req = new TransactionAccount();
  }
}

export class DepartmentPicker extends Picker<
  TimesheetDepartment,
  TimesheetDepartment.AsObject
> {
  constructor(props: props<TimesheetDepartment, TimesheetDepartment.AsObject>) {
    super(props, 'Department', 'DEPARTMENT_LIST', 3);
    this.Client = new TimesheetDepartmentClient(ENDPOINT);
    this.req = new TimesheetDepartment();
  }
}

export class ClassCodePicker extends Picker<
  TimesheetClassCode,
  TimesheetClassCode.AsObject
> {
  constructor(props: props<TimesheetClassCode, TimesheetClassCode.AsObject>) {
    super(props, 'Class Code', 'CLASS_CODE_LIST', 1);
    this.Client = new TimesheetClassCodeClient(ENDPOINT);
    this.req = new TimesheetClassCode();
  }
}
