import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
  TransactionStatus,
  TransactionStatusClient,
} from '@kalos-core/kalos-rpc/TransactionStatus';
import { ENDPOINT } from '../../../constants';

interface props {
  selected: number;
  disabled?: boolean;
  onSelect?(id: number): void;
  label?: string;
  hideAuditWorkflowFilters?: boolean;
}

interface state {
  list: TransactionStatus[];
}

export class TxnStatusPicker extends React.PureComponent<props, state> {
  Client: TransactionStatusClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
    };
    this.Client = new TransactionStatusClient(ENDPOINT);
    this.handleSelect = this.handleSelect.bind(this);
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

  async fetchList() {
    const status = new TransactionStatus();
    const results = await this.Client.BatchGet(status);
    this.setState({ list: results.getResultsList() });
  }

  componentDidMount() {
    this.fetchList();
  }

  render() {
    return (
      <FormControl style={{ marginBottom: 10 }}>
        <InputLabel htmlFor="txn-status-picker">
          {this.props.label || 'Status'}
        </InputLabel>
        <NativeSelect
          disabled={this.props.disabled}
          value={this.props.selected}
          onChange={this.handleSelect}
          inputProps={{ id: 'txn-status-picker' }}
        >
          <option value={0}>Select Status</option>
          {this.state.list.map(item => (
            <option
              value={item.getId()}
              key={`${item.getDescription()}-${item.getId()}`}
            >
              {item.getDescription()}
            </option>
          ))}
          <option value={7}>Not Audited</option>
          <option value={8}>Not Recorded</option>

          {this.props.hideAuditWorkflowFilters === true ? (
            <option hidden={this.props.hideAuditWorkflowFilters} value={9}>
              Accepted, Not Recorded, Not Audited
            </option>
          ) : undefined}
          {this.props.hideAuditWorkflowFilters === true ? (
            <option hidden={this.props.hideAuditWorkflowFilters} value={10}>
              Accepted, Audited, Not Recorded
            </option>
          ) : undefined}
          {this.props.hideAuditWorkflowFilters === true ? (
            <option hidden={this.props.hideAuditWorkflowFilters} value={11}>
              Audited and Recorded
            </option>
          ) : undefined}
        </NativeSelect>
      </FormControl>
    );
  }
}
