import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
  TransactionAccount,
  TransactionAccountClient,
} from '@kalos-core/kalos-rpc/TransactionAccount';
import { ENDPOINT } from '../../../constants';

interface props {
  selected: number;
  disabled?: boolean;
  onSelect?(id: number): void;
  test?(item: TransactionAccount.AsObject): boolean;
  sort?(a: TransactionAccount.AsObject, b: TransactionAccount.AsObject): number;
  filter?(a: TransactionAccount.AsObject): boolean;
  label?: string;
  hideInactive?: boolean;
}

interface state {
  accountList: TransactionAccount.AsObject[];
}

const CACHE_KEY = 'COST_CENTER_LIST';
const CACHE_VERSION = 5;

export class CostCenterPicker extends React.PureComponent<props, state> {
  Client: TransactionAccountClient;
  constructor(props: props) {
    super(props);
    this.state = {
      accountList: [],
    };
    this.Client = new TransactionAccountClient(ENDPOINT);
    this.handleSelect = this.handleSelect.bind(this);
    this.fetchData = this.fetchData.bind(this);
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

  async fetchData() {
    const req = new TransactionAccount();
    const res = await this.Client.BatchGet(req);
    return res.toObject().resultsList;
  }

  async componentDidMount() {
    await this.handleCache();
  }

  async handleCache() {
    const cache = new Cache<TransactionAccount.AsObject[]>(
      CACHE_KEY,
      CACHE_VERSION,
      this.fetchData,
    );
    const data = cache.getItem();
    if (!data) {
      const freshData = await cache.update();
      if (freshData) {
        this.setState({ accountList: freshData });
      }
    } else {
      this.setState({ accountList: data });
    }
  }

  render() {
    let accountList = this.state.accountList;
    if (this.props.sort) {
      accountList = this.state.accountList.sort(this.props.sort);
    }

    if (this.props.filter) {
      accountList = accountList.filter(this.props.filter);
    }

    return (
      <FormControl style={{ marginBottom: 10 }}>
        <InputLabel htmlFor="cost-center-picker">
          {this.props.label || 'Purchase Type'}
        </InputLabel>
        <NativeSelect
          disabled={this.props.disabled}
          value={this.props.selected}
          onChange={this.handleSelect}
          IconComponent={undefined}
          inputProps={{ id: 'cost-center-picker' }}
        >
          <option value={0}>Select Purchase Type</option>
          {accountList.map((acc) => (
            <option value={acc.id} key={`${acc.description}-${acc.id}`}>
              {acc.description}
            </option>
          ))}
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
