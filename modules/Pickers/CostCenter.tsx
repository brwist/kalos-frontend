import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
  TransactionAccount,
  TransactionAccountClient,
} from '@kalos-core/kalos-rpc/TransactionAccount';

interface props {
  selected: number;
  disabled?: boolean;
  onSelect?(id: number): void;
  test?(item: TransactionAccount.AsObject): boolean;
  sort?(a: TransactionAccount.AsObject, b: TransactionAccount.AsObject): number;
  label?: string;
  hideInactive?: boolean;
}

interface state {
  accountList: TransactionAccount.AsObject[];
}

export class CostCenterPicker extends React.PureComponent<props, state> {
  AccClient: TransactionAccountClient;
  constructor(props: props) {
    super(props);
    this.state = {
      accountList: [],
    };
    this.AccClient = new TransactionAccountClient(
      0,
      'https://core-dev.kalosflorida.com:8443',
    );

    this.handleSelect = this.handleSelect.bind(this);
    this.addAccount = this.addAccount.bind(this);
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

  addAccount(acc: TransactionAccount.AsObject) {
    if (this.props.test) {
      if (this.props.test(acc)) {
        this.setState(prevState => ({
          accountList: prevState.accountList.concat(acc),
        }));
      }
    } else {
      this.setState(prevState => ({
        accountList: prevState.accountList.concat(acc),
      }));
    }
  }

  async fetchAccounts() {
    const req = new TransactionAccount();
    if (this.props.hideInactive) {
      req.setIsActive(1);
    }

    this.AccClient.List(req, this.addAccount);
  }

  async componentDidMount() {
    const cacheListStr = localStorage.getItem('COST_CENTER_LIST_3');
    if (cacheListStr) {
      const cacheList = JSON.parse(cacheListStr);
      if (cacheList && cacheList.length !== 0) {
        this.setState({
          accountList: cacheList,
        });
      } else {
        await this.fetchAccounts();
      }
    } else {
      await this.fetchAccounts();
    }
  }

  componentDidUpdate(prevProps: props, prevState: state) {
    if (
      this.state.accountList.length > 0 &&
      prevState.accountList.length === this.state.accountList.length
    ) {
      const cacheList = localStorage.getItem('COST_CENTER_LIST_3');
      if (!cacheList) {
        localStorage.setItem(
          'COST_CENTER_LIST_3',
          JSON.stringify(this.state.accountList),
        );
      }
    }
  }

  render() {
    let accountList = this.state.accountList;
    if (this.props.sort) {
      accountList = this.state.accountList.sort(this.props.sort);
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
          {accountList.map(acc => (
            <option value={acc.id} key={`${acc.description}-${acc.id}`}>
              {acc.description}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    );
  }
}
