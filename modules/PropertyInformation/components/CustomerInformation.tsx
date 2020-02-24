import React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
// import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
// import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import InputLabel from '@material-ui/core/InputLabel';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import {
  ENDPOINT,
  // USA_STATES
} from '../../../constants';
import InfoTable from './InfoTable';

interface props {
  userID: number;
}

interface state {
  isEditing: boolean;
  customer: User.AsObject;
}

export class CustomerInformation extends React.PureComponent<props, state> {
  UserClient: UserClient;

  constructor(props: props) {
    super(props);
    this.state = {
      isEditing: false,
      customer: new User().toObject(),
    };
    this.UserClient = new UserClient(ENDPOINT);
    this.getCustomer = this.getCustomer.bind(this);
  }

  toggleEditing = () => {
    this.setState(prevState => ({
      isEditing: !prevState.isEditing,
    }));
  };

  // updateUserProperty<K extends keyof Property.AsObject>(prop: K) {
  //   return async (
  //     e: ChangeEvent<
  //       | HTMLInputElement
  //       | HTMLTextAreaElement
  //       | {
  //           name?: string | undefined;
  //           value: unknown;
  //         }
  //     >
  //   ) => {
  //     const property = new Property();
  //     const upperCaseProp = `${prop[0].toUpperCase()}${prop.slice(1)}`;
  //     const methodName = `set${upperCaseProp}`;
  //     property.setId(this.props.propertyId);
  //     property.setUserId(this.props.userID);
  //     //@ts-ignore
  //     property[methodName](e.target.value);
  //     property.setFieldMaskList([upperCaseProp]);
  //     const updatedProperty = await this.PropertyClient.Update(property);
  //     this.setState(() => ({ userProperty: updatedProperty }));
  //   };
  // }
  // updateFirstName = this.updateUserProperty('firstname');
  // updateLastName = this.updateUserProperty('lastname');
  // updateBusinessName = this.updateUserProperty('businessname');
  // updatePhone = this.updateUserProperty('phone');
  // updateAltPhone = this.updateUserProperty('altphone');
  // updateEmail = this.updateUserProperty('email');
  // updateAddress = this.updateUserProperty('address');
  // updateCity = this.updateUserProperty('city');
  // updateState = this.updateUserProperty('state');
  // updateZip = this.updateUserProperty('zip');
  // updateSubdivision = this.updateUserProperty('subdivision');
  // updateNotes = this.updateUserProperty('notes');

  async getCustomer() {
    const user = new User();
    user.setId(this.props.userID);
    const userData = await this.UserClient.Get(user);
    this.setState({
      customer: userData,
    });
  }

  async componentDidMount() {
    await this.UserClient.GetToken('test', 'test');
    await this.getCustomer();
  }

  render() {
    const { customer, isEditing } = this.state;
    const {
      id,
      firstname,
      lastname,
      businessname,
      phone,
      altphone,
      cellphone,
      fax,
      email,
      address,
      city,
      state,
      zip,
      billingTerms,
    } = customer;
    const infoTableData = [
      [
        { label: 'Name', value: `${firstname} ${lastname}` },
        { label: 'Business Name', value: businessname },
      ],
      [
        { label: 'Primary Phone', value: phone },
        { label: 'Cell Phone', value: cellphone },
      ],
      [
        { label: 'Alternate Phone', value: altphone },
        { label: 'Fax', value: fax },
      ],
      [
        {
          label: 'Billing Address',
          value: `${address}, ${city}, ${state} ${zip}`,
        },
        { label: 'Email', value: email },
      ],
      [{ label: 'Billing Terms', value: billingTerms }],
    ];
    return (
      <Grid container direction="column">
        {id === 0 ? (
          <CircularProgress style={{ margin: '10px auto' }} />
        ) : (
          <>
            {/* <FormControlLabel
              style={{
                marginLeft: 'auto',
              }}
              control={
                <Switch
                  checked={isEditing}
                  onChange={this.toggleEditing}
                  value="isEditing"
                  color="primary"
                />
              }
              label={isEditing ? 'Editing Enabled' : 'Editing Disabled'}
            /> */}
            {isEditing ? (
              <>
                {/* <TextField
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
                /> */}
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
