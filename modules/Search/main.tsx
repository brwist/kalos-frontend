import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import { PropertySearch } from './components/PropertySearch';
import { CustomerSearch } from './components/CustomerSearch';
import { EventSearch } from './components/ServiceCallSearch';
import { EventClient } from '@kalos-core/kalos-rpc/Event';
import { ENDPOINT } from '../../constants';
import { PageWrapper } from '../PageWrapper/main';

// add any prop types here
interface props {
  loggedUserId: number;
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

    this.Client = new EventClient(ENDPOINT);
    this.renderSelector = this.renderSelector.bind(this);
    this.setSearchTarget = this.setSearchTarget.bind(this);
  }
  setSearchTarget(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      //@ts-ignore
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
      <PageWrapper userID={this.props.loggedUserId} padding={1}>
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
      </PageWrapper>
    );
  }
}
