import React, { ChangeEvent } from 'react';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import Grid from '@material-ui/core/Grid';
import { ENDPOINT, USA_STATES } from '../../../constants';
import InfoTable from './InfoTable';
import { Modal } from './Modal';
import { Form, Schema } from './Form';

const PROP_LEVEL = 'Used for property-level billing only';
const RESIDENTIAL = [
  { label: 'Residential', value: 1 },
  { label: 'Commercial', value: 0 },
];

const SCHEMA: Schema<Property.AsObject>[] = [
  { label: 'First Name', name: 'firstname', helperText: PROP_LEVEL },
  { label: 'Last Name', name: 'lastname', helperText: PROP_LEVEL },
  { label: 'Business Name', name: 'businessname', helperText: PROP_LEVEL },
  { label: 'Primary Phone', name: 'phone', helperText: PROP_LEVEL },
  { label: 'Alternate Phone', name: 'altphone', helperText: PROP_LEVEL },
  { label: 'Email', name: 'email', helperText: PROP_LEVEL },
  { label: 'Address', name: 'address', required: true },
  { label: 'City', name: 'city', required: true },
  { label: 'State', name: 'state', options: USA_STATES, required: true },
  { label: 'Zip Code', name: 'zip', required: true },
  { label: 'Zoning', name: 'isResidential', options: RESIDENTIAL },
  { label: 'Subdivision', name: 'subdivision' },
  { label: 'Directions', name: 'directions' },
  { label: 'Latitude', name: 'geolocationLat' },
  { label: 'Longitude', name: 'geolocationLng' },
  { label: 'Notes', name: 'notes' },
];
interface Props {
  userID: number;
  propertyId: number;
  editing: boolean;
  onCloseEdit: () => void;
}

interface State {
  userProperty: Property.AsObject;
  saving: boolean;
}

export class PropertyInfo extends React.PureComponent<Props, State> {
  UserClient: UserClient;
  PropertyClient: PropertyClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      userProperty: new Property().toObject(),
      saving: false,
    };
    this.UserClient = new UserClient(ENDPOINT);
    this.PropertyClient = new PropertyClient(ENDPOINT);
  }

  loadUserProperty = async () => {
    const entry = new Property();
    entry.setUserId(this.props.userID);
    entry.setId(this.props.propertyId);
    const response = await this.PropertyClient.BatchGet(entry);
    this.setState({
      userProperty: response.toObject().resultsList[0],
    });
  };

  async componentDidMount() {
    // await this.UserClient.GetToken('test', 'test');
    await this.loadUserProperty();
  }

  handleSave = async (data: Property.AsObject) => {
    const { propertyId, userID, onCloseEdit } = this.props;
    this.setState({ saving: true });
    const entry = new Property();
    entry.setId(propertyId);
    entry.setUserId(userID);
    const fieldMaskList = [];
    for (const key in data) {
      const upperCaseProp = `${key[0].toUpperCase()}${key.slice(1)}`;
      const methodName = `set${upperCaseProp}`;
      //@ts-ignore
      entry[methodName](data[key]);
      fieldMaskList.push(upperCaseProp);
    }
    entry.setFieldMaskList(fieldMaskList);
    const userProperty = await this.PropertyClient.Update(entry);
    this.setState(() => ({
      userProperty,
      saving: false,
    }));
    onCloseEdit();
  };

  render() {
    const { editing, onCloseEdit } = this.props;
    const { userProperty, saving } = this.state;
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
        <InfoTable data={infoTableData} loading={id === 0} />
        <Modal open={editing} onClose={onCloseEdit}>
          <Form<Property.AsObject>
            schema={SCHEMA}
            data={userProperty}
            onSave={this.handleSave}
            onClose={onCloseEdit}
            disabled={saving}
          />
        </Modal>
      </Grid>
    );
  }
}
