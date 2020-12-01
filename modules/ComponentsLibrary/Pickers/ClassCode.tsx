import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { ClassCode, ClassCodeClient } from '@kalos-core/kalos-rpc/ClassCode';
import { ENDPOINT } from '../../../constants';

interface props {
  selected: any;
  disabled?: boolean;
  onSelect?(id: number | React.SyntheticEvent<HTMLSelectElement>): void;
  test?(item: ClassCode.AsObject): boolean;
  label?: string;
  useDevClient?: boolean;
  withinForm?: boolean;
}

interface state {
  list: ClassCode.AsObject[];
}

export class ClassCodePicker extends React.PureComponent<props, state> {
  Client: ClassCodeClient;
  constructor(props: props) {
    super(props);
    this.state = {
      list: [],
    };
    this.Client = new ClassCodeClient(ENDPOINT);

    this.handleSelect = this.handleSelect.bind(this);
    this.addToList = this.addToList.bind(this);
  }

  handleSelect(e: React.SyntheticEvent<HTMLSelectElement>) {
    const id = parseInt(e.currentTarget.value);
    if (this.props.onSelect) {
      try {
        this.props.onSelect(this.props.withinForm ? e : id);
      } catch (err) {
        console.log(err);
      }
    }
  }

  addToList(item: ClassCode.AsObject) {
    this.setState(prevState => ({
      list: prevState.list.concat(item),
    }));
  }

  async fetchList() {
    const req = new ClassCode();
    const list = (await this.Client.BatchGet(req)).toObject();
    // this.setState({
    //   list,
    // ))
    // console.log(data);
  }

  componentDidMount() {
    const cacheListStr = localStorage.getItem('CLASSCODE_LIST');
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
      const cacheList = localStorage.getItem('CLASSCODE_LIST');
      if (!cacheList) {
        localStorage.setItem('CLASSCODE_LIST', JSON.stringify(this.state.list));
      }
    }
  }

  render() {
    return (
      <FormControl style={{ marginBottom: 10 }}>
        <InputLabel htmlFor="cost-center-picker">
          {this.props.label || 'Class Code'}
        </InputLabel>
        <NativeSelect
          disabled={this.props.disabled}
          value={this.props.selected}
          onChange={this.handleSelect}
          IconComponent={undefined}
          inputProps={{ id: 'cost-center-picker' }}
        >
          <option value={0}>Select Class Code</option>
          {this.state.list.map(item => (
            <option value={item.id} key={`${item.description}-${item.id}`}>
              {item.description}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    );
  }
}
