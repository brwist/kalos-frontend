// This is the google autocomplete form for address queries
import React from 'react';
import { getKeyByKeyName } from '../../../helpers';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { AddressPairInterface, AddressPair } from './Address';
import './styles.less';
import { indexOf } from 'lodash';

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
      label: 'Address',
      type: 'text',
      name: 'StreetAddressOrigin',
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
      label: 'Address',
      type: 'text',
      name: 'StreetAddressDestination',
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
  autoCompleteOrigin: any;
  autoCompleteDestination: any;
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

  getInputElementFromInputField = (inputField: any) => {
    return inputField.lastElementChild?.firstChild;
  };

  getInputFieldByLabelContent = (
    content: string,
    indexOfResult?: number,
  ): HTMLInputElement | null => {
    const inputFields = this.getInputFields();
    let results = [];
    for (let i = 0; i < inputFields.length; i++) {
      if (!inputFields[i].parentNode) {
        console.error(
          'There is no parent node for one of the input fields: ',
          inputFields[i],
        );
        return null;
      }
      const childs = inputFields[i].parentNode!.childNodes;
      const filtered = Array.from(childs).filter(
        child => child.textContent == content,
      );

      if (filtered.length > 0) {
        results.push(inputFields[i]);
      }
    }

    if (indexOfResult) {
      if (results.length < indexOfResult) {
        console.error(
          'The index provided was greater than the results that were received.',
        );
        return null;
      }
    }
    if (results.length > 1) {
      if (indexOfResult) {
        return results[indexOfResult] as HTMLInputElement;
      } else {
        return results[0] as HTMLInputElement;
      }
    }

    if (results.length > 0) {
      return results[0] as HTMLInputElement;
    }

    console.error(
      'Failed to find the desired input element with the label: ',
      content,
    );
    return null;
  };

  handleLoad = () => {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    // @ts-ignore
    this.autoCompleteOrigin = new google.maps.places.Autocomplete(
      this.getInputElementFromInputField(
        this.getInputFieldByLabelContent('Address', 0),
      ),
      { types: ['geocode'] },
    );

    // @ts-ignore
    this.autoCompleteDestination = new google.maps.places.Autocomplete(
      this.getInputElementFromInputField(
        this.getInputFieldByLabelContent('Address', 1),
      ),
      { types: ['geocode'] },
    );

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    this.autoCompleteOrigin.setFields(['address_component']);
    this.autoCompleteDestination.setFields(['address_component']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    this.autoCompleteOrigin.addListener(
      'place_changed',
      this.handleOriginSelect,
    );

    this.autoCompleteDestination.addListener(
      'place_changed',
      this.handleDestinationSelect,
    );
  };

  handleOriginSelect = () => {
    // Get the place details from the autocomplete object.
    const place = this.autoCompleteOrigin.getPlace();
    this.handlePlaceSelect(place, 0);
  };

  handleDestinationSelect = () => {
    // Get the place details from the autocomplete object.
    const place = this.autoCompleteDestination.getPlace();
    this.handlePlaceSelect(place, 6);
  };

  handlePlaceSelect = (place: any, startIndex: number) => {
    let index = startIndex,
      street_number = 0;

    this.getInputFieldByLabelContent('Street Address', 1);

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // @ts-ignore
    for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
      const addressType = component.types[0];

      // @ts-ignore
      if (componentForm[addressType]) {
        // @ts-ignore
        const val = component[componentForm[addressType]];

        if (addressType == 'route') {
          this.getInputFieldByIndex(index).value = street_number + ' ' + val;
          index++;
          continue;
        }
        addressType == 'street_number'
          ? (street_number = val)
          : (this.getInputFieldByIndex(index).value = val);
        index++;
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
        this.autoCompleteOrigin.setBounds(circle.getBounds());
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
