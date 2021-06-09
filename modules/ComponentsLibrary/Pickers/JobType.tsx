import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { JobType, JobTypeClient } from '@kalos-core/kalos-rpc/JobType';
import Divider from '@material-ui/core/Divider';
import { ENDPOINT } from '../../../constants';

interface props {
  selected: number;
  disabled?: boolean;
  onSelect?(id: number): void;
  test?(item: JobType.AsObject): boolean;
  useDevClient?: boolean;
}

interface state {
  list: JobType.AsObject[];
}

export class JobTypePicker extends React.PureComponent<props, state> {
  Client: JobTypeClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
    };
    this.Client = new JobTypeClient(ENDPOINT);

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

  addItem(item: JobType.AsObject) {
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

  async fetchAccounts() {
    this.Client.List(new JobType(), this.addItem);
  }

  componentDidMount() {
    this.fetchAccounts();
  }

  render() {
    return (
      <FormControl style={{ marginTop: 10 }}>
        <InputLabel htmlFor="job-type-picker">Job Type</InputLabel>
        <NativeSelect
          disabled={this.props.disabled}
          value={this.props.selected}
          onChange={this.handleSelect}
          inputProps={{ id: 'job-type-picker' }}
          variant="outlined"
          fullWidth
        >
          <option value={0}>Select Job Type</option>
          {this.state.list.map(acc => (
            <option value={acc.id} key={`${acc.name}-${acc.id}`}>
              {acc.name}
            </option>
          ))}
        </NativeSelect>
        <Divider />
      </FormControl>
    );
  }
}
