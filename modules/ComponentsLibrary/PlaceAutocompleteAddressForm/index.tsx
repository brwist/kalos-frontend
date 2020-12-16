// This is the google autocomplete form for address queries
import { Component } from 'react';
import React from 'react';
import { getKeyByKeyName } from '../../../helpers';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { SCHEMA_KALOS_MAP_INPUT_FORM } from '../PerDiem/index';
import { Address, AddressInterface } from './Address';

export const getApi = async () => {
  console.log('Calling on the maps api');
  const res = await getKeyByKeyName('google_maps');
  console.log('Key ', res);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/js?key=${res.apiKey}&libraries=places`,
  );
  const data = await response.json();
  console.log('Google maps response: ', data);
};

interface Props {
  onClose: () => void;
  onSave: (address: Address) => void;
}

interface State {
  address: AddressInterface;
}

export const SCHEMA_GOOGLE_MAP_INPUT_FORM: Schema<Address.AsObject> = [
  [
    {
      label: 'Street Address',
      name: 'StreetAddress',
      type: 'text',
    },
    {
      label: 'City',
      name: 'City',
      type: 'text',
    },
    {
      label: 'State',
      name: 'State',
      type: 'text',
    },
    {
      label: 'Zip Code',
      name: 'ZipCode',
      type: 'text',
    },
    {
      label: 'Country',
      name: 'Country',
      type: 'text',
    },
  ],
];

export class PlaceAutocompleteAddressForm extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    let trip = new Address();

    this.state = {
      address: trip,
    };
  }

  render() {
    return (
      <>
        (
        <Modal open onClose={this.props.onClose}>
          <Form
            title="Enter Location"
            schema={SCHEMA_GOOGLE_MAP_INPUT_FORM}
            onClose={this.props.onClose}
            onSave={this.props.onSave}
            data={this.state.address}
          ></Form>
        </Modal>
        )
      </>
    );
  }
}

//const placeSearch: google.maps.places.PlacesService;
//const autocomplete: google.maps.places.Autocomplete;
