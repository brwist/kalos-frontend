import React, { ChangeEvent } from 'react';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { ENDPOINT, USA_STATES } from '../../../constants';
import InfoTable from './InfoTable';

interface Props {
  userID: number;
  propertyId: number;
  isEditing: boolean;
}

interface State {
  userProperty: Property.AsObject;
}

export class PropertyInfo extends React.PureComponent<Props, State> {
  UserClient: UserClient;
  PropertyClient: PropertyClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      userProperty: new Property().toObject(),
    };
    this.UserClient = new UserClient(ENDPOINT);
    this.PropertyClient = new PropertyClient(ENDPOINT);
    this.getUserProperty = this.getUserProperty.bind(this);
  }

  updateUserProperty<K extends keyof Property.AsObject>(prop: K) {
    return async (
      e: ChangeEvent<
        | HTMLInputElement
        | HTMLTextAreaElement
        | {
            name?: string | undefined;
            value: unknown;
          }
      >
    ) => {
      const property = new Property();
      const upperCaseProp = `${prop[0].toUpperCase()}${prop.slice(1)}`;
      const methodName = `set${upperCaseProp}`;
      property.setId(this.props.propertyId);
      property.setUserId(this.props.userID);
      //@ts-ignore
      property[methodName](e.target.value);
      property.setFieldMaskList([upperCaseProp]);
      const updatedProperty = await this.PropertyClient.Update(property);
      this.setState(() => ({ userProperty: updatedProperty }));
    };
  }
  updateFirstName = this.updateUserProperty('firstname');
  updateLastName = this.updateUserProperty('lastname');
  updateBusinessName = this.updateUserProperty('businessname');
  updatePhone = this.updateUserProperty('phone');
  updateAltPhone = this.updateUserProperty('altphone');
  updateEmail = this.updateUserProperty('email');
  updateAddress = this.updateUserProperty('address');
  updateCity = this.updateUserProperty('city');
  updateState = this.updateUserProperty('state');
  updateZip = this.updateUserProperty('zip');
  updateSubdivision = this.updateUserProperty('subdivision');
  updateNotes = this.updateUserProperty('notes');

  async getUserProperty() {
    const req = new Property();
    req.setUserId(this.props.userID);
    req.setId(this.props.propertyId);
    const res = await this.PropertyClient.BatchGet(req);
    this.setState({
      userProperty: res.toObject().resultsList[0],
    });
    return res.toObject().resultsList;
  }

  async componentDidMount() {
    await this.UserClient.GetToken('test', 'test');
    await this.getUserProperty();
  }

  render() {
    const { isEditing } = this.props;
    const { userProperty } = this.state;
    const {
      id,
      firstname,
      lastname,
      businessname,
      phone,
      altphone,
      email,
      address,
      city,
      state,
      zip,
      subdivision,
      notes,
    } = userProperty;
    const infoTableData = [
      [
        { label: 'Name', value: `${firstname} ${lastname}` },
        { label: 'Business Name', value: businessname },
      ],
      [
        { label: 'Primary Phone', value: phone },
        { label: 'Alternate Phone', value: altphone },
      ],
      [{ label: 'Email', value: email }],
      [{ label: 'Address', value: `${address}, ${city}, ${state} ${zip}` }],
      [{ label: 'Subdivision', value: subdivision }],
      [{ label: 'Notes', value: notes }],
    ];
    return (
      <Grid container direction="column">
        {id === 0 ? (
          <CircularProgress style={{ margin: '10px auto' }} />
        ) : (
          <>
            {isEditing ? (
              <>
                <TextField
                  disabled={!isEditing}
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  defaultValue={firstname}
                  onChange={this.updateFirstName}
                  label={'First Name'}
                  fullWidth
                />
                <TextField
                  disabled={!isEditing}
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  defaultValue={lastname}
                  onChange={this.updateLastName}
                  label={'Last Name'}
                  fullWidth
                />
                <TextField
                  disabled={!isEditing}
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  defaultValue={businessname}
                  onChange={this.updateBusinessName}
                  label={'Business Name'}
                  fullWidth
                />
                <TextField
                  disabled={!isEditing}
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  defaultValue={phone}
                  onChange={this.updatePhone}
                  label={'Phone'}
                  fullWidth
                />
                <TextField
                  disabled={!isEditing}
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  defaultValue={altphone}
                  onChange={this.updateAltPhone}
                  label={'Alternate Phone'}
                  fullWidth
                />
                <TextField
                  disabled={!isEditing}
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  defaultValue={email}
                  onChange={this.updateEmail}
                  label={'Email'}
                  fullWidth
                />
                <TextField
                  disabled={!isEditing}
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  defaultValue={address}
                  onChange={this.updateAddress}
                  label={'Address'}
                  fullWidth
                />
                <TextField
                  disabled={!isEditing}
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  defaultValue={city}
                  onChange={this.updateCity}
                  label={'City'}
                  fullWidth
                />
                <FormControl
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  fullWidth
                  disabled={!isEditing}
                >
                  <InputLabel id="state-select-label">State</InputLabel>
                  <Select
                    labelId="state-select-label"
                    id="state-select"
                    value={state}
                    onChange={this.updateState}
                  >
                    {USA_STATES.map(value => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  disabled={!isEditing}
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  defaultValue={zip}
                  onChange={this.updateZip}
                  label={'Zip'}
                  fullWidth
                />
                <TextField
                  disabled={!isEditing}
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  defaultValue={subdivision}
                  onChange={this.updateSubdivision}
                  label={'Subdivision'}
                  fullWidth
                />
                <TextField
                  disabled={!isEditing}
                  style={{ paddingBottom: '10px', paddingTop: '10px' }}
                  defaultValue={notes}
                  onChange={this.updateNotes}
                  label={'Notes'}
                  fullWidth
                />
              </>
            ) : (
              <div>
                <InfoTable data={infoTableData} />
              </div>
            )}
          </>
        )}
      </Grid>
    );
  }
}
