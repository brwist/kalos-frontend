import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
  TimesheetClassCode,
  TimesheetClassCodeClient,
} from '@kalos-core/kalos-rpc/TimesheetClassCode';
import { ENDPOINT } from '../../constants';

interface props {
  selected: number;
  disabled?: boolean;
  onSelect?(id: number): void;
  test?(item: TimesheetClassCode.AsObject): boolean;
  label?: string;
  useDevClient?: boolean;
}

interface state {
  list: TimesheetClassCode.AsObject[];
}

export class DepartmentPicker extends React.PureComponent<props, state> {
  Client: TimesheetClassCodeClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
    };
    this.Client = new TimesheetClassCodeClient(ENDPOINT);

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
    const dpt = new TimesheetClassCode();
    dpt.setIsActive(1);
    this.Client.List(dpt, this.addToList);
  }

  componentDidMount() {
    const cacheListStr = localStorage.getItem('DEPARTMENT_LIST_2');
    if (cacheListStr) {
      const cacheList = JSON.parse(cacheListStr);
      if (cacheList && cacheList.length !== 0) {
        this.setState({
          list: cacheList,
        });
      } else {
        this.fetchList();
      }
    } else {
      this.fetchList();
    }
  }

  componentDidUpdate(prevProps: props, prevState: state) {
    if (
      this.state.list.length > 0 &&
      prevState.list.length === this.state.list.length
    ) {
      const cacheList = localStorage.getItem('DEPARTMENT_LIST_2');
      if (!cacheList) {
        localStorage.setItem(
          'DEPARTMENT_LIST_2',
          JSON.stringify(this.state.list),
        );
      }
    }
  }

  render() {
    return (
      <FormControl style={{ marginBottom: 10 }}>
        <InputLabel htmlFor="cost-center-picker">
          {this.props.label || 'Department'}
        </InputLabel>
        <NativeSelect
          disabled={this.props.disabled}
          value={this.props.selected}
          onChange={this.handleSelect}
          IconComponent={undefined}
          inputProps={{ id: 'cost-center-picker' }}
        >
          <option value={0}>Select Department</option>
          {this.state.list.map(item => (
            <option value={item.id} key={`${item.description}-${item.id}`}>
              {item.value} - {item.description}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    );
  }
}
