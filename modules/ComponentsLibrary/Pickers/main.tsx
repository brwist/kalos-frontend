// this files ts-ignore lines have been checked
import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { BaseClient } from '@kalos-core/kalos-rpc/BaseClient';

interface props<T, C> {
  selected: number;
  onSelect?(acc: T): void;
  client: C;
  id: string;
  reqObj: T;
}

interface state<T> {
  list: T[];
}

export class Picker<
  T extends { id: number; description: string },
  C extends BaseClient,
> extends React.PureComponent<props<T, C>, state<T>> {
  Client: C;
  constructor(props: props<T, C>) {
    super(props);
    this.state = {
      list: [],
    };
    //@ts-ignore
    this.Client = new this.props.client();

    this.handleSelect = this.handleSelect.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  handleSelect(e: React.SyntheticEvent<HTMLSelectElement>) {
    const id = parseInt(e.currentTarget.value);
    if (this.props.onSelect) {
      const acc = this.state.list.find(a => a.id === id);
      if (acc) {
        try {
          this.props.onSelect(acc);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  addItem(item: T) {
    this.setState(prevState => ({
      list: prevState.list.concat(item),
    }));
  }

  async fetchItems() {
    //@ts-ignore
    this.Client.List(new T(), this.addItem);
  }

  componentDidMount() {
    this.fetchItems();
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
          {this.state.list.map(item => (
            <option value={item.id} key={`${item.description}-${item.id}`}>
              {item.description}
            </option>
          ))}
        </NativeSelect>
        {/*<FormHelperText>
          Assign a purchase category to your receipt
        </FormHelperText>*/}
      </FormControl>
    );
  }
}
