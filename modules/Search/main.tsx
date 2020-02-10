import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import { PropertySearch } from './components/PropertySearch';
import { CustomerSearch } from './components/CustomerSearch';
import { ContractSearch } from './components/ContractSearch';
import { EventSearch } from './components/ServiceCallSearch';
import { EventClient } from '@kalos-core/kalos-rpc/Event';

// add any prop types here
interface props {
  containerStyle?: React.CSSProperties;
}

// map your state here
interface state {
  target: 'Service Call' | 'Customer' | 'Property';
}

export class Search extends React.PureComponent<props, state> {
  Client: EventClient;
  constructor(props: props) {
    super(props);
    this.state = {
      target: 'Service Call',
    };

    this.Client = new EventClient(0, 'https://core-dev.kalosflorida.com:8443');
    this.renderSelector = this.renderSelector.bind(this);
    this.setSearchTarget = this.setSearchTarget.bind(this);
  }
  setSearchTarget(e: React.ChangeEvent<HTMLSelectElement>) {
    //@ts-ignore
    this.setState({
      target: e.currentTarget.value,
    });
  }
  renderSelector() {
    return (
      <>
        <InputLabel htmlFor="search-target-selector">Search</InputLabel>
        <NativeSelect
          onChange={this.setSearchTarget}
          inputProps={{ id: 'search-target-selector' }}
          value={this.state.target}
        >
          <option value="Service Call">Service Calls</option>
          <option value="Property">Properties</option>
          <option value="Customer">Customers</option>
          {/*<option value="Contract">Contracts</option>*/}
        </NativeSelect>
      </>
    );
  }

  async componentDidMount() {
    await this.Client.GetToken('test', 'test');
  }

  render() {
    const { target } = this.state;
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        {target === 'Property' && (
          <PropertySearch
            selector={this.renderSelector()}
            containerStyle={this.props.containerStyle}
          />
        )}
        {target === 'Service Call' && (
          <EventSearch
            selector={this.renderSelector()}
            containerStyle={this.props.containerStyle}
          />
        )}
        {target === 'Customer' && (
          <CustomerSearch
            selector={this.renderSelector()}
            containerStyle={this.props.containerStyle}
          />
        )}
        {/*target === 'Contract' && (
          <ContractSearch
            selector={this.renderSelector()}
            containerStyle={this.props.containerStyle}
          />
        )*/}
      </ThemeProvider>
    );
  }
}
