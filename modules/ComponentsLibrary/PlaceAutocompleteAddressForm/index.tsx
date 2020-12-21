// This is the google autocomplete form for address queries
import React, { createRef } from 'react';
import { getKeyByKeyName } from '../../../helpers';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { Address } from './Address';
import { Field } from '../Field';
import './styles.less';

// Convenience call, will be removed later
export const getApi = async () => {
  const res = await getKeyByKeyName('google_maps');
  return res.apiKey;
};

interface Props {
  onClose: () => void;
  onSave: (addressPair: Address.Address) => void;
  addressFields: number;
  schema: Schema<Address.AsObject>;
}

interface State {
  address: Address.Address;
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
  constructor(props: Props) {
    super(props);

    let trip = new Address.Address();

    this.state = {
      address: trip,
      query: null,
    };
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
      ] = new google.maps.places.Autocomplete(this.inputArray[0], {
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

  getInputFieldByLabelContent = (labelText: string) => {
    let index = 0;

    for (let i = 0; i < this.props.schema.length; i++) {
      for (let j = 0; j < this.props.schema[j].length; j++) {
        if (
          this.props.schema[i][j].label == labelText &&
          this.props.schema[i][j].type == 'text'
        ) {
          console.log(this.props.schema[i][j].label);
          console.log(labelText);
          console.log('Returning value: ', this.inputArray[index]);
          return this.inputArray[index];
        }

        if (this.props.schema[i][j].type == 'text') {
          index++;
        }
      }
    }

    return null;
  };

  handlePlaceSelect = (indexOfForm: any, startIndex: number) => {
    const place = this.autoCompleteSections[indexOfForm].getPlace();
    let index = startIndex,
      street_number = 0;

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

        console.log('Schema: ', this.props.schema);

        if (addressType == 'route') {
          this.getInputFieldByLabelContent('Street Address')!.value =
            street_number + ' ' + val;
          index++;
          continue;
        }

        addressType == 'street_number'
          ? (street_number = val)
          : (this.inputArray[index].value = val);
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
        this.autoCompleteSections.forEach((section: any) => {
          section.setBounds(circle.getBounds());
        });
      });
    }
  }

  render() {
    console.log('Rendering');
    this.loadScript(() => this.handleLoad());
    this.geolocate();
    let forms = [];
    for (let i = 0; i < this.props.addressFields; i++) {
      console.log(i);
      if (i == 0) {
        // Can do this multiple ways
        // Can attempt to add onto the schema based upon something, idk how
        // or I can also make the save function simply find the slots for each and go from there
        //
        forms.push(
          <Form
            title="Enter Location"
            ref={this.fieldRef}
            schema={this.props.schema}
            onClose={this.props.onClose}
            onSave={this.props.onSave}
            data={this.state.address}
            className="LocationForm"
            key={i + 'PlaceAutocompleteAddressForm'}
            inputFieldRefs={this.inputArray}
          ></Form>,
        );
      } else {
        forms.push(
          <Form
            ref={this.fieldRef}
            schema={this.props.schema}
            onClose={this.props.onClose}
            onSave={this.props.onSave}
            data={this.state.address}
            className="LocationForm"
            key={i + 'PlaceAutocompleteAddressForm'}
            inputFieldRefs={this.inputArray}
          ></Form>,
        );
      }
      //array = array.slice(0, 6 * this.props.addressFields);
    }

    console.log('Array: ', this.inputArray);
    console.log(this.inputArray.length);
    for (let i = 0; i < this.inputArray.length; i++) {
      console.log('Iterating: ', i);
      if (this.inputArray[i]) {
        console.log(i);
      }
    }

    return (
      <>
        <Modal open onClose={this.props.onClose}>
          {forms}
        </Modal>
        )
      </>
    );
  }
}
