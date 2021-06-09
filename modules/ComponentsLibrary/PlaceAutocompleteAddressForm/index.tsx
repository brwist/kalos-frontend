// This is the google autocomplete form for address queries
import React, { createRef } from 'react';
import { ApiKeyClientService, PerDiemClientService } from '../../../helpers';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { AddressPair } from './Address';
import { Alert } from '../Alert';
import Typography from '@material-ui/core/Typography';

import './styles.less';
import { Loader } from '../../Loader/main';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import { PerDiem } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { SectionBar } from '../SectionBar';
interface Props {
  onClose: () => void;
  onSave: (addressPair: AddressPair.AddressPair) => void;
  addressFields: number;
  schema: Schema<AddressPair.AsObject>;
  perDiemRowIds: number[];
}

interface State {
  address: AddressPair.AddressPair;
  formKey: number;
  validationPopupOpen: boolean;
  noteLengthPopupOpen: boolean;
  saving: boolean;
  perDiemDropDownSelected: any;
  perDiems: PerDiem.AsObject[] | null;
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
      perDiemDropDownSelected: this.props.perDiemRowIds
        ? `${this.props.perDiemRowIds[0]} | 0`
        : '',
      perDiems: null,
    };

    this.loadScripts();
  }

  loadScriptByUrl = async (url: string) => {
    await new Promise<void>(resolve => {
      const scripts = document.getElementsByTagName('script');
      for (let i = scripts.length; i--; ) {
        if (scripts[i].src == url) {
          resolve(); // Already have that url assigned to a script, don't add again. Instead just
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
            resolve;
          }
        };
      } else {
        script.onload = () => resolve();
      }

      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  };

  loadScripts = async () => {
    await this.loadScriptByUrl(
      'https://polyfill.io/v3/polyfill.min.js?features=default',
    );
    await this.loadScriptByUrl(
      `https://maps.googleapis.com/maps/api/js?key=${
        (await ApiKeyClientService.getKeyByKeyName('google_maps')).apiKey
      }&libraries=places`,
    );
    this.handleLoad();
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
    this.loadScripts(); // Hotfix to make the api reappear after key refresh
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

  componentDidUpdate() {}

  componentDidMount() {
    this.geolocate();
    this.setStateOfPerDiems();
  }

  getPerDiemsFromIds = async (ids: number[]) => {
    let list: PerDiem.AsObject[] = [];
    for await (const id of ids) {
      let pd = new PerDiem();
      pd.setId(id);
      list.push(await PerDiemClientService.Get(pd));
    }

    return list;
  };

  setStateOfPerDiems = async () => {
    this.setState({
      perDiems: await this.getPerDiemsFromIds(this.props.perDiemRowIds),
    });
  };

  save = (addressPair: AddressPair.AddressPair) => {
    for (const [key, value] of Object.entries(addressPair)) {
      if (value == '' && key != 'Notes' && key != 'HomeTravel') {
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

    addressPair.PerDiemId = this.state.perDiemDropDownSelected.split(' ')[0];

    this.props.onSave(addressPair);
    this.setState({ saving: true });
  };

  setPerDiemDropdown = (value: any) => {
    this.setState({ perDiemDropDownSelected: value.target.value });
  };

  render() {
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
              Your notes exceed the maximum length of 1000 characters.
            </Typography>
          </Alert>
        )}
        <Modal open onClose={this.props.onClose}>
          <>
            {this.state.saving && <Loader />}
            <>
              <SectionBar title="Per Diem" uncollapsable>
                <FormControl>
                  {this.state.perDiems ? (
                    <InputLabel shrink htmlFor="per-diem-select">
                      Per Diem
                    </InputLabel>
                  ) : (
                    <></>
                  )}
                  {this.state.perDiems ? (
                    <Select
                      value={
                        this.state.perDiems
                          ? this.state.perDiemDropDownSelected
                          : 'loading'
                      }
                      onChange={this.setPerDiemDropdown}
                      label="Per Diem"
                      inputProps={{
                        name: 'age',
                        id: 'per-diem-select',
                      }}
                    >
                      {this.state.perDiems ? (
                        this.state.perDiems.map((key, idx) => {
                          return (
                            <MenuItem
                              value={key.id + ' | ' + idx}
                              key={key.id + ' | ' + idx}
                            >
                              {key.department?.value} | Notes: "{key.notes}"
                            </MenuItem>
                          );
                        })
                      ) : (
                        <MenuItem value={'loading'} key="Loading">
                          Loading...
                        </MenuItem>
                      )}
                    </Select>
                  ) : (
                    <></>
                  )}
                </FormControl>
              </SectionBar>
            </>
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
      </>
    );
  }
}
