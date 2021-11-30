import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { JobSubtype, JobSubtypeClient } from '@kalos-core/kalos-rpc/JobSubtype';
import {
  JobTypeSubtype,
  JobTypeSubtypeClient,
} from '@kalos-core/kalos-rpc/JobTypeSubtype';
import Divider from '@material-ui/core/Divider';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { ENDPOINT } from '../../../constants';

interface props {
  selected: number;
  disabled?: boolean;
  onSelect?(id: number): void;
  useDevClient?: boolean;
}

interface state {
  list: JobSubtype[];
  allowed: number[];
}

export class JobSubtypePicker extends React.PureComponent<props, state> {
  Client: JobSubtypeClient;
  JobTypeSubtypeClient: JobTypeSubtypeClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
      allowed: [],
    };
    this.Client = new JobSubtypeClient(ENDPOINT);
    this.JobTypeSubtypeClient = new JobTypeSubtypeClient(ENDPOINT);
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

  addItem(item: JobSubtype) {
    if (this.state.allowed.includes(item.getId())) {
      this.setState(prevState => ({
        list: prevState.list.concat(item),
      }));
    }
  }

  fetchSubtypeList() {
    return new Promise(async resolve => {
      const jtst = new JobTypeSubtype();
      const res = await this.JobTypeSubtypeClient.BatchGet(jtst);
      const allowed = res.getResultsList().map(st => st.getJobSubtypeId());
      this.setState({ allowed }, () => resolve(true));
    });
  }

  async fetchAccounts() {
    await this.fetchSubtypeList();
    this.Client.List(new JobSubtype(), this.addItem);
  }

  componentDidMount() {
    this.fetchAccounts();
  }

  render() {
    return (
      <FormControl style={{ marginTop: 10 }}>
        <InputLabel htmlFor="job-type-picker">Subtype</InputLabel>
        <NativeSelect
          disabled={this.props.disabled}
          value={this.props.selected}
          onChange={this.handleSelect}
          inputProps={{ id: 'job-type-picker' }}
          variant="outlined"
          fullWidth
        >
          <option value={0}>Select Job Type</option>
          {this.state.list.map(item => (
            <option
              value={item.getId()}
              key={`${item.getName()}-${item.getId()}`}
            >
              {item.getName()}
            </option>
          ))}
        </NativeSelect>
        <Divider />
      </FormControl>
    );
  }
}
