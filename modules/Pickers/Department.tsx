import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
  TimesheetDepartment,
  TimesheetDepartmentClient,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
import Divider from '@material-ui/core/Divider';

interface props {
  selected: number;
  disabled?: boolean;
  onSelect?(id: number): void;
  test?(item: TimesheetDepartment.AsObject): boolean;
}

interface state {
  list: TimesheetDepartment.AsObject[];
}

export class DepartmentPicker extends React.PureComponent<props, state> {
  Client: TimesheetDepartmentClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
    };
    this.Client = new TimesheetDepartmentClient();

    this.handleSelect = this.handleSelect.bind(this);
    this.addToList = this.addToList.bind(this);
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

  addToList(item: TimesheetDepartment.AsObject) {
    this.setState(prevState => ({
      list: prevState.list.concat(item),
    }));
  }

  async fetchList() {
    const dpt = new TimesheetDepartment();
    dpt.setIsActive(1);
    this.Client.List(dpt, this.addToList);
  }

  componentDidMount() {
    this.fetchList();
  }

  render() {
    return (
      <FormControl style={{ marginBottom: 10 }}>
        <InputLabel htmlFor="cost-center-picker">Department</InputLabel>
        <NativeSelect
          disabled={this.props.disabled}
          value={this.props.selected}
          onChange={this.handleSelect}
          inputProps={{ id: 'cost-center-picker' }}
        >
          <option value={0}>Select Department</option>
          {this.state.list.map(item => (
            <option value={item.id} key={`${item.description}-${item.id}`}>
              {item.description}
            </option>
          ))}
        </NativeSelect>
        {/*<FormHelperText>
          Select the department responsible for this receipt
        </FormHelperText>*/}
        <Divider />
      </FormControl>
    );
  }
}
