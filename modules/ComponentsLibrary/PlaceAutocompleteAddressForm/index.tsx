// This is the google autocomplete form for address queries
import React, { createRef } from 'react';
import { getKeyByKeyName } from '../../../helpers';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { AddressPair } from './Address';
import './styles.less';
import { indexOf } from 'lodash';
import { TextField } from '@material-ui/core';

// Convenience call, will be removed later
export const getApi = async () => {
  const res = await getKeyByKeyName('google_maps');
  return res.apiKey;
};

interface Props {
  onClose: () => void;
  onSave: (addressPair: AddressPair.AddressPair) => void;
  addressFields: number;
  schema: Schema<AddressPair.AsObject>;
}

interface State {
  address: AddressPair.AddressPair;
  query: any;
}

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
  // @ts-ignore
  autoCompleteSections: google.maps.places.Autocomplete[2] = [];
  fieldRef: any = React.createRef();
  inputArray: any[] = [];
  numInputs: number = 0;
  data: any;
  constructor(props: Props) {
    super(props);

    this.state = {
      address: new AddressPair.AddressPair(),
      query: null,
    };

    this.data = this.state.address;
  }

  getInputFields = () => {
    let inputs: any[] = [];

    this.inputArray.forEach(element => {
      inputs.push(element);
    });

    return inputs;
  };

  loadScriptByUrl = async (url: string, callback: () => void) => {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length; i--; ) {
      if (scripts[i].src == url) {
        callback(); // Already have that url assigned to a script, don't add again. Instead just
        // call the callback and have it go on about its business in wherever it was called from
        return;
      }
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

  handleLoad = () => {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.

    for (let i = 0; i < this.props.addressFields; i++) {
      // @ts-ignore
      this.autoCompleteSections[
        i
        // @ts-ignore
      ] = new google.maps.places.Autocomplete(this.inputArray[i * 6], {
        types: ['geocode'],
      });

      // Avoid paying for data that you don't need by restricting the set of
      // place fields that are returned to just the address components.
      this.autoCompleteSections[i].setFields(['address_component']);

      // When the user selects an address from the drop-down, populate the
      // address fields in the form.

      this.autoCompleteSections[i].addListener('place_changed', () => {
        this.handlePlaceSelect(i, 0);
      });
    }
  };

  getInputFieldByLabelContent = (labelText: string, occurence?: number) => {
    let index = 0,
      occurences = 0;

    for (
      let i = 0;
      i < this.props.schema.length * this.props.addressFields;
      i++
    ) {
      let div = i % this.props.schema.length;
      for (let j = 0; j < this.props.schema[div].length; j++) {
        if (
          this.props.schema[div][j].label == labelText &&
          this.props.schema[div][j].type == 'text'
        ) {
          if (occurence) {
            if (occurences == occurence) {
              return this.inputArray[index];
            }
            occurences++;
          } else {
            return this.inputArray[index];
          }
        }

        if (this.props.schema[div][j].type == 'text') {
          this.numInputs++;
          index++;
        }
      }
    }

    return null;
  };

  handlePlaceSelect = (indexOfForm: any, startIndex: number) => {
    const place = this.autoCompleteSections[indexOfForm].getPlace();
    let street_number = 0;

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.

    // ts-ignores because this code does, in fact, work - the google maps library just
    // isn't imported beforehand, it has to be loaded when ran

    // @ts-ignore
    for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
      const addressType = component.types[0];

      // @ts-ignore
      if (componentForm[addressType]) {
        // @ts-ignore
        const val = component[componentForm[addressType]];

        let labelName: string = '';

        if (addressType == 'route') {
          if (indexOfForm == 0) {
            this.state.address.StreetAddressOrigin = street_number + ' ' + val;
          } else {
            this.state.address.StreetAddressDestination =
              street_number + ' ' + val;
          }
          labelName = 'Street Address';
          continue;
        }

        switch (addressType) {
          case 'locality':
            if (indexOfForm == 0) {
              this.state.address.CityOrigin = val;
            } else {
              this.state.address.CityDestination = val;
            }
            labelName = 'City';
            break;
          case 'administrative_area_level_1':
            if (indexOfForm == 0) {
              this.state.address.StateOrigin = val;
            } else {
              this.state.address.StateDestination = val;
            }

            labelName = 'State';
            break;
          case 'country':
            if (indexOfForm == 0) {
              this.state.address.CountryOrigin = val;
            } else {
              this.state.address.CountryDestination = val;
            }

            labelName = 'Country';
            break;
          case 'postal_code':
            if (indexOfForm == 0) {
              this.state.address.ZipCodeOrigin = val;
            } else {
              this.state.address.ZipCodeDestination = val;
            }
            labelName = 'Zip Code';
            break;
        }

        if (indexOfForm == 0) {
          this.state.address.FullAddressOrigin =
            this.state.address.StreetAddressOrigin +
            ', ' +
            this.state.address.CityOrigin +
            ', ' +
            this.state.address.StateOrigin +
            ', ' +
            this.state.address.CountryOrigin +
            ', ';
        } else {
          this.state.address.FullAddressDestination =
            this.state.address.StreetAddressDestination +
            ', ' +
            this.state.address.CityDestination +
            ', ' +
            this.state.address.StateDestination +
            ', ' +
            this.state.address.CountryDestination +
            ', ';
        }

        this.data = this.state.address;

        addressType == 'street_number'
          ? (street_number = val)
          : (this.getInputFieldByLabelContent(
              labelName,
              indexOfForm,
            ).value = val);
      }
    }
  };

  componentDidUpdate() {}

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
        this.autoCompleteSections.forEach((section: any) => {
          section.setBounds(circle.getBounds());
        });
      });
    }
  }

  render() {
    this.loadScript(() => this.handleLoad());
    this.geolocate();

    return (
      <>
        <Modal open onClose={this.props.onClose}>
          <Form
            title="Enter Trip Origin and Destination"
            ref={this.fieldRef}
            schema={this.props.schema}
            onClose={this.props.onClose}
            onSave={this.props.onSave}
            data={this.data}
            className="LocationForm"
            key={'PlaceAutocompleteAddressForm'}
            inputFieldRefs={this.inputArray}
          ></Form>
        </Modal>
        )
      </>
    );
  }
}
