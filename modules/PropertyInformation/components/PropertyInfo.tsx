import React from 'react';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { ENDPOINT, USA_STATES } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';

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
  { label: 'Address', name: 'address', required: true, multiline: true },
  { label: 'City', name: 'city', required: true },
  { label: 'State', name: 'state', options: USA_STATES, required: true },
  { label: 'Zip Code', name: 'zip', required: true },
  { label: 'Zoning', name: 'isResidential', options: RESIDENTIAL },
  { label: 'Subdivision', name: 'subdivision' },
  { label: 'Directions', name: 'directions', multiline: true },
  { label: 'Latitude', name: 'geolocationLat' },
  { label: 'Longitude', name: 'geolocationLng' },
  { label: 'Notes', name: 'notes', multiline: true },
];

interface Props {
  userID: number;
  propertyId: number;
}

interface State {
  userProperty: Property.AsObject;
  editing: boolean;
  saving: boolean;
  error: boolean;
}

export class PropertyInfo extends React.PureComponent<Props, State> {
  PropertyClient: PropertyClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      userProperty: new Property().toObject(),
      editing: false,
      saving: false,
      error: false,
    };
    this.PropertyClient = new PropertyClient(ENDPOINT);
  }

  handleToggleEditing = () => this.setState({ editing: !this.state.editing });

  loadEntry = async () => {
    const { userID, propertyId } = this.props;
    const entry = new Property();
    entry.setUserId(userID);
    entry.setId(propertyId);
    const response = await this.PropertyClient.BatchGet(entry);
    const userProperty = response.toObject().resultsList[0];
    if (userProperty) {
      this.setState({ userProperty });
    } else {
      this.setState({ error: true });
    }
  };

  async componentDidMount() {
    await this.loadEntry();
  }

  handleSave = async (data: Property.AsObject) => {
    const { propertyId, userID } = this.props;
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
    this.handleToggleEditing();
  };

  render() {
    const { userID, propertyId } = this.props;
    const { userProperty, editing, saving, error } = this.state;
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
    const data: Data = [
      [
        { label: 'Name', value: `${firstname} ${lastname}` },
        { label: 'Business Name', value: businessname },
      ],
      [
        { label: 'Primary Phone', value: phone, href: 'tel' },
        { label: 'Alternate Phone', value: altphone, href: 'tel' },
      ],
      [{ label: 'Email', value: email, href: 'mailto' }],
      [{ label: 'Address', value: `${address}, ${city}, ${state} ${zip}` }],
      [{ label: 'Subdivision', value: subdivision }],
      [{ label: 'Notes', value: notes }],
    ];
    return (
      <>
        <SectionBar
          title="Property Information"
          buttons={[
            {
              label: 'Tasks',
              url: `/index.cfm?action=admin:tasks.list&code=properties&id=${propertyId}`,
            },
            {
              label: 'Add Notification',
              onClick: () => {}, // TODO: implement onClick
            },
            {
              label: 'Change Property',
              onClick: this.handleToggleEditing,
            },
            {
              label: 'Owner Details',
              url: `/index.cfm?action=admin:customers.details&user_id=${userID}`,
            },
          ]}
        />
        <InfoTable data={data} loading={id === 0} error={error} />
        <Modal open={editing} onClose={this.handleToggleEditing}>
          <Form<Property.AsObject>
            title="Edit Property Information"
            schema={SCHEMA}
            data={userProperty}
            onSave={this.handleSave}
            onClose={this.handleToggleEditing}
            disabled={saving}
          />
        </Modal>
      </>
    );
  }
}
