// This is the google autocomplete form for address queries
import React from 'react';
import { getKeyByKeyName } from '../../../helpers';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { AddressPairInterface, AddressPair } from './Address';
import './styles.less';

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

const componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name',
};

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

    this.loadScript(() => this.handleLoad());
    this.geolocate();
  }

  getInputFields = () => {
    const group = document.getElementsByClassName('LocationForm');

    const inputs = (group[0] as HTMLElement).getElementsByClassName(
      'FieldInput',
    );

    return inputs;
  };

  loadScriptByUrl = async (url: string, callback: () => void) => {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length; i--; ) {
      if (scripts[i].src == url) return; // Already have that url assigned to a script, don't add again
    }
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

  loadScript = async (callback: () => void) => {
    this.loadScriptByUrl(
      'https://polyfill.io/v3/polyfill.min.js?features=default',
      () => {},
    );
    this.loadScriptByUrl(
      `https://maps.googleapis.com/maps/api/js?key=${await getApi()}&libraries=places`,
      callback,
    );
  };

  getInputFieldByIndex = (index: number): HTMLInputElement => {
    return this.getInputFields()[index].getElementsByTagName(
      'input',
    )[0] as HTMLInputElement;
  };

  handleLoad = () => {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    // @ts-ignore
    this.autoComplete = new google.maps.places.Autocomplete(
      this.getInputFieldByIndex(0),
      { types: ['geocode'] },
    );

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    this.autoComplete.setFields(['address_component']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    this.autoComplete.addListener('place_changed', this.handlePlaceSelect);
  };

  handlePlaceSelect = () => {
    // Get the place details from the autocomplete object.
    const place = this.autoComplete.getPlace();

    for (const component in componentForm) {
      (document.getElementById(component) as HTMLInputElement).value = '';
      (document.getElementById(component) as HTMLInputElement).disabled = false;
    }

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // @ts-ignore
    for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
      const addressType = component.types[0];

      // @ts-ignore
      if (componentForm[addressType]) {
        // @ts-ignore
        const val = component[componentForm[addressType]];
        (document.getElementById(addressType) as HTMLInputElement).value = val;
      }
    }
  };

  geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // @ts-ignore
        const circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy,
        });
        this.autoComplete.setBounds(circle.getBounds());
      });
    }
  }

  render() {
    return (
      <>
        <Modal open onClose={this.props.onClose}>
          <Form
            title="Enter Location"
            schema={SCHEMA_GOOGLE_MAP_INPUT_FORM}
            onClose={this.props.onClose}
            onSave={this.props.onSave}
            data={this.state.address}
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
