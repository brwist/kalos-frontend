import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
  TransactionAccount,
  TransactionAccountClient,
} from '@kalos-core/kalos-rpc/TransactionAccount';

interface props {
  selected: number;
  onSelect?(acc: TransactionAccount.AsObject): void;
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
      const acc = this.state.accountList.find(a => a.id === id);
      if (acc) {
        try {
          this.props.onSelect(acc);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  addAccount(acc: TransactionAccount.AsObject) {
    this.setState(prevState => ({
      accountList: prevState.accountList.concat(acc),
    }));
  }

  async fetchAccounts() {
    this.AccClient.List(new TransactionAccount(), this.addAccount);
  }

  componentDidMount() {
    this.fetchAccounts();
  }

  render() {
    return (
      <FormControl
        style={{
          margin: 5,
          minWidth: 120,
        }}
      >
        <InputLabel htmlFor="cost-center-picker">Cost Center</InputLabel>
        <NativeSelect
          value={this.props.selected}
          onChange={this.handleSelect}
          inputProps={{ id: 'cost-center-picker' }}
        >
          <option value={0}>Select Cost Center</option>
          {this.state.accountList.map(acc => (
            <option value={acc.id} key={`${acc.description}-${acc.id}`}>
              {acc.description}
            </option>
          ))}
        </NativeSelect>
        <FormHelperText>
          Assign a purchase category to your receipt
        </FormHelperText>
      </FormControl>
    );
  }
}
