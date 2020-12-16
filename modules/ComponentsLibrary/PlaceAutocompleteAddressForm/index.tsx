// This is the google autocomplete form for address queries
import { Component } from 'react';
import React from 'react';
import { getKeyByKeyName } from '../../../helpers';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { SCHEMA_KALOS_MAP_INPUT_FORM } from '../PerDiem/index';
import { Address, AddressPairInterface, AddressPair } from './Address';

// Convenience call, will be removed later
export const getApi = async () => {
  const res = await getKeyByKeyName('google_maps');
  return res.apiKey;
};

interface Props {
  onClose: () => void;
  onSave: (addressPair: AddressPair) => void;
}

interface State {
  address: AddressPairInterface;
  query: any;
}

// Schema will be adjusted down the line to include as many addresses as it can
export const SCHEMA_GOOGLE_MAP_INPUT_FORM: Schema<AddressPair.AsObject> = [
  [
    {
      label: 'Origin',
      headline: true,
    },
  ],
  [
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
  ],
  [
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
  ],
  [
    {
      label: 'Destination',
      headline: true,
    },
  ],
  [
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
  ],
  [
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
  autoComplete: any;
  constructor(props: Props) {
    super(props);

    let trip = new AddressPair();

    this.state = {
      address: trip,
      query: null,
    };
  }

  getInputFields = () => {
    const group = document.getElementsByClassName('LocationForm');

    const inputs = (group[0] as HTMLElement).getElementsByClassName(
      'FieldInput',
    );

    return inputs;
  };

  handleChange = () => {
    const fields = this.getInputFields();

    this.getAddressesFromGoogle();
  };

  getAddressesFromGoogle = async () => {
    // @ts-ignore
    let placeSearch: window.google.maps.places.PlacesService;
    // @ts-ignore
    let autocomplete: window.google.maps.places.Autocomplete;
  };

  loadScript = async (callback: () => void) => {
    const url = `https://maps.googleapis.com/maps/api/js?key=${await getApi()}&libraries=places`;
    let script = document.createElement('script') as any;
    script.type = 'text/javascript';

    if (script.readyState) {
      script.onreadystatechange = () => {
        if (
          script.readyState === 'loaded' ||
          script.readyState === 'complete'
        ) {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = () => callback();
    }

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  handleLoad = () => {
    // @ts-ignore
    console.log('Loading', window.google);
    // @ts-ignore
    this.autoComplete = new window.google.maps.places.Autocomplete(
      this.getInputFields()[0].getElementsByTagName(
        // For now, I'm just testing it on the first input
        // element
        'input',
      )[0] as HTMLInputElement,
      { types: ['cities'], componentRestrictions: { country: 'us' } },
    );

    this.autoComplete.setFields(['address_components', 'formatted_address']);
    this.autoComplete.addListener('place_changed', () =>
      this.handlePlaceSelect(),
    );
  };

  handlePlaceSelect = () => {
    const addr = this.autoComplete.getPlace();
    const query = addr.formatted_address;
    this.setState({ query: query });
  };
  render() {
    this.loadScript(() => this.handleLoad());
    return (
      <>
        <Modal open onClose={this.props.onClose}>
          <Form
            title="Enter Location"
            schema={SCHEMA_GOOGLE_MAP_INPUT_FORM}
            onClose={this.props.onClose}
            onSave={this.props.onSave}
            data={this.state.address}
            onChange={this.handleChange}
            className="LocationForm"
          ></Form>
        </Modal>
        )
      </>
    );
  }
}

//const placeSearch: google.maps.places.PlacesService;
//const autocomplete: google.maps.places.Autocomplete;
