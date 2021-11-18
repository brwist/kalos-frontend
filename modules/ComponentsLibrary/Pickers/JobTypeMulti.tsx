import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { JobType, JobTypeClient } from '@kalos-core/kalos-rpc/JobType';
import Divider from '@material-ui/core/Divider';
import { ENDPOINT } from '../../../constants';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { Form } from '../../ComponentsLibrary/Form';
import { Field } from '../../ComponentsLibrary/Field';
interface props {
  selected: string;
  disabled?: boolean;
  onSelect?(jobTypeIds: string): void;
  test?(item: JobType): boolean;
  useDevClient?: boolean;
}

interface state {
  list: JobType[];
}

export class JobTypePickerMulti extends React.PureComponent<props, state> {
  Client: JobTypeClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
    };
    this.Client = new JobTypeClient(ENDPOINT);
    console.log('selected givne from props', this.props.selected);
    this.handleSelect = this.handleSelect.bind(this);
    this.addItem = this.addItem.bind(this);
  }
  handleSelect(e: string[]) {
    if (this.props.onSelect) {
      try {
        this.props.onSelect(e.join(','));
      } catch (err) {
        console.log(err);
      }
    }
  }

  addItem(item: JobType) {
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
    let jobTypeReq = new JobType();
    const results = (await this.Client.BatchGet(jobTypeReq)).getResultsList();
    this.setState({ list: results });
    console.log('results', results);
  }

  async componentDidMount() {
    await this.fetchAccounts();
  }

  render() {
    if (this.state.list.length > 0) {
      return (
        <div key="jobTypeMulti">
          <InputLabel htmlFor="job-type-picker">Job Type</InputLabel>
          <Field
            name="jobTypeIds"
            key="JobTypeMultiField"
            value={
              this.props.selected.split(',').filter(value => value != '0') || []
            }
            type="multiselect"
            options={this.state.list.map(acc => ({
              label: acc.getName(),
              value: acc.getId().toString(),
            }))}
            //@ts-ignore
            onChange={e => this.handleSelect(e)}
            label="Select Job Type "
          />
        </div>
      );
    } else {
      return <div>No JobTypes found</div>;
    }
  }
}
