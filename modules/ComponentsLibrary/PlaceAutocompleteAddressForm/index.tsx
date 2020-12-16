// This is the google autocomplete form for address queries
import { Component } from 'react';
import React from 'react';
import { getKeyByKeyName } from '../../../helpers';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { SCHEMA_KALOS_MAP_INPUT_FORM } from '../PerDiem/index';
import { Address, AddressPairInterface, AddressPair } from './Address';

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
  onSave: (addressPair: AddressPair) => void;
}

interface State {
  address: AddressPairInterface;
}

export const SCHEMA_GOOGLE_MAP_INPUT_FORM: Schema<AddressPair.AsObject> = [
  [
    {
      label: 'Origin',
    },
    {
      label: 'Street Address',
      name: 'StreetAddressOrigin',
      type: 'text',
    },
    {
      label: 'City',
      name: 'CityOrigin',
      type: 'text',
    },
    {
      label: 'State',
      name: 'StateOrigin',
      type: 'text',
    },
    {
      label: 'Zip Code',
      name: 'ZipCodeOrigin',
      type: 'text',
    },
    {
      label: 'Country',
      name: 'CountryOrigin',
      type: 'text',
    },
    { label: 'Destination' },
    {
      label: 'Street Address',
      name: 'StreetAddressDestination',
      type: 'text',
    },
    {
      label: 'City',
      name: 'CityDestination',
      type: 'text',
    },
    {
      label: 'State',
      name: 'StateDestination',
      type: 'text',
    },
    {
      label: 'Zip Code',
      name: 'ZipCodeDestination',
      type: 'text',
    },
    {
      label: 'Country',
      name: 'CountryDestination',
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

    let trip = new AddressPair();

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
