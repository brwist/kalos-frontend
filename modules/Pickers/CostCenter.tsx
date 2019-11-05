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
  label?: string;
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
    this.AccClient = new TransactionAccountClient();

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
    this.AccClient.List(new TransactionAccount(), this.addAccount);
  }

  componentDidMount() {
    this.fetchAccounts();
  }

  render() {
    return (
      <FormControl style={{ marginBottom: 10 }}>
        <InputLabel htmlFor="cost-center-picker">
          {this.props.label || 'Purchase Type'}
        </InputLabel>
        <NativeSelect
          disabled={this.props.disabled}
          value={this.props.selected}
          onChange={this.handleSelect}
          inputProps={{ id: 'cost-center-picker' }}
        >
          <option value={0}>Select Purchase Type</option>
          {this.state.accountList.map(acc => (
            <option value={acc.id} key={`${acc.description}-${acc.id}`}>
              {acc.description}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    );
  }
}
