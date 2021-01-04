// This is the google autocomplete form for address queries
import React, { createRef } from 'react';
import { getKeyByKeyName } from '../../../helpers';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { AddressPair } from './Address';
import { Alert } from '../Alert';
import Typography from '@material-ui/core/Typography';

import './styles.less';
import { Loader } from '../../Loader/main';
interface Props {
  onClose: () => void;
  onSave: (addressPair: AddressPair.AddressPair) => void;
  addressFields: number;
  schema: Schema<AddressPair.AsObject>;
}

interface State {
  address: AddressPair.AddressPair;
  formKey: number;
  validationPopupOpen: boolean;
  noteLengthPopupOpen: boolean;
  saving: boolean;
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
  inputArray: any[] = [];
  constructor(props: Props) {
    super(props);
    this.state = {
      address: new AddressPair.AddressPair(),
      formKey: 0,
      validationPopupOpen: false,
      noteLengthPopupOpen: false,
      saving: false,
    };
  }

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

  loadScripts = async (callback: () => void) => {
    this.loadScriptByUrl(
      'https://polyfill.io/v3/polyfill.min.js?features=default',
      () => {},
    );
    this.loadScriptByUrl(
      `https://maps.googleapis.com/maps/api/js?key=${
        (await getKeyByKeyName('google_maps')).apiKey
      }&libraries=places`,
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
        this.handlePlaceSelect(i);
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
          index++;
        }
      }
    }
    return null;
  };

  handlePlaceSelect = (indexOfForm: any) => {
    const place = this.autoCompleteSections[indexOfForm].getPlace();
    let street_number = 0;

    // ts-ignores because this code does, in fact, work - the google maps library just
    // isn't imported beforehand, it has to be loaded when ran

    // @ts-ignore
    for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
      const addressType = component.types[0];

      // @ts-ignore
      if (componentForm[addressType]) {
        // @ts-ignore
        const val = component[componentForm[addressType]];

        if (addressType == 'route') {
          this.getInputFieldByLabelContent(
            'Street Address',
            indexOfForm,
          ).value = street_number + ' ' + val;
          if (indexOfForm == 0) {
            this.state.address.StreetAddressOrigin = street_number + ' ' + val;
          } else {
            this.state.address.StreetAddressDestination =
              street_number + ' ' + val;
          }
          continue;
        }

        switch (addressType) {
          case 'locality':
            if (indexOfForm == 0) {
              this.state.address.CityOrigin = val;
            } else {
              this.state.address.CityDestination = val;
            }
            break;
          case 'administrative_area_level_1':
            if (indexOfForm == 0) {
              this.state.address.StateOrigin = val;
            } else {
              this.state.address.StateDestination = val;
            }
            break;
          case 'country':
            if (indexOfForm == 0) {
              this.state.address.CountryOrigin = val;
            } else {
              this.state.address.CountryDestination = val;
            }
            break;
          case 'postal_code':
            if (indexOfForm == 0) {
              this.state.address.ZipCodeOrigin = val;
            } else {
              this.state.address.ZipCodeDestination = val;
            }
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
            this.state.address.CountryOrigin;
        } else {
          this.state.address.FullAddressDestination =
            this.state.address.StreetAddressDestination +
            ', ' +
            this.state.address.CityDestination +
            ', ' +
            this.state.address.StateDestination +
            ', ' +
            this.state.address.CountryDestination;
        }

        // Sets the input field text to the value given by val
        if (addressType == 'street_number') street_number = val;
      }
    }
    this.setState({ formKey: this.state.formKey + 1 });
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

  componentDidUpdate() {
    this.handleLoad();
  }

  componentDidMount() {
    this.geolocate();
  }

  save = (addressPair: AddressPair.AddressPair) => {
    for (const [key, value] of Object.entries(addressPair)) {
      if (value == '' && key != 'Notes') {
        this.setState({ validationPopupOpen: true });
        return;
      }

      if (key == 'Notes' && value.length >= 1000) {
        this.setState({ noteLengthPopupOpen: true });
        return;
      }
    }
    addressPair.FullAddressOrigin = `${addressPair.StreetAddressOrigin}, ${addressPair.CityOrigin}, ${addressPair.StateOrigin}, ${addressPair.CountryOrigin}`;
    addressPair.FullAddressDestination = `${addressPair.StreetAddressDestination}, ${addressPair.CityDestination}, ${addressPair.StateDestination}, ${addressPair.CountryDestination}`;

    this.props.onSave(addressPair);
    this.setState({ saving: true });
  };

  render() {
    this.loadScripts(() => this.handleLoad());

    return (
      <>
        {this.state.validationPopupOpen && (
          <Alert
            open={this.state.validationPopupOpen}
            onClose={() => this.setState({ validationPopupOpen: false })}
            label="Close"
            title="Notice"
          >
            <Typography component="p">
              Please ensure all of the fields are filled out prior to saving.
            </Typography>
          </Alert>
        )}
        {this.state.noteLengthPopupOpen && (
          <Alert
            open={this.state.noteLengthPopupOpen}
            onClose={() => this.setState({ noteLengthPopupOpen: false })}
            label="Close"
            title="Notice"
          >
            <Typography component="p">
              Your notes exceed the length of 1000 characters. Please ensure
              that your notes are less than 1000 characters.
            </Typography>
          </Alert>
        )}
        <Modal open onClose={this.props.onClose}>
          <>
            {this.state.saving && <Loader />}
            <Form
              title="Enter Trip Origin and Destination"
              schema={this.props.schema}
              onClose={this.props.onClose}
              onSave={this.save}
              data={this.state.address}
              className="LocationForm"
              key={this.state.formKey}
              inputFieldRefs={this.inputArray}
            />
          </>
        </Modal>
        )
      </>
    );
  }
}
