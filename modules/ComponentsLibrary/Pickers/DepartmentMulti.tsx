import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import { ENDPOINT } from '../../../constants';

import { Field } from '../Field';
import {
  TimesheetDepartment,
  TimesheetDepartmentClient,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
interface props {
  selected: string;
  disabled?: boolean;
  onSelect?(departmentIds: string): void;
  test?(item: TimesheetDepartment): boolean;
  useDevClient?: boolean;
}

interface state {
  list: TimesheetDepartment[];
}

export class DepartmentMulti extends React.PureComponent<props, state> {
  Client: TimesheetDepartmentClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
    };
    this.Client = new TimesheetDepartmentClient(ENDPOINT);
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

  addItem(item: TimesheetDepartment) {
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
    let timesheetDepartmentReq = new TimesheetDepartment();
    timesheetDepartmentReq.setIsActive(1);
    const results = (
      await this.Client.BatchGet(timesheetDepartmentReq)
    ).getResultsList();
    this.setState({ list: results });
    console.log('results', results);
  }

  async componentDidMount() {
    await this.fetchAccounts();
  }

  render() {
    if (this.state.list.length > 0) {
      return (
        <div key="departmentMulti">
          <InputLabel htmlFor="department-id-picker">Department</InputLabel>
          <Field
            name="departmentIds"
            key="departmentIdMulti"
            value={
              this.props.selected
                .split(',')
                .filter(value => value != '0' && value != '') || []
            }
            type="multiselect"
            options={this.state.list.map(acc => ({
              label: `${acc.getValue()}-${acc.getDescription()}`,
              value: acc.getId().toString(),
            }))}
            //@ts-ignore
            onChange={e => this.handleSelect(e)}
            label="Select Department(s) "
          />
        </div>
      );
    } else {
      return <div>No Departments found</div>;
    }
  }
}
