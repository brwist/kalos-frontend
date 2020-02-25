import React, { ChangeEvent } from 'react';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import Grid from '@material-ui/core/Grid';
import { ENDPOINT, USA_STATES } from '../../../constants';
import InfoTable from './InfoTable';
import { Modal } from './Modal';
import { Form, Schema } from './Form';

const SCHEMA: Schema<Property.AsObject>[] = [
  { label: 'First Name', name: 'firstname' },
  { label: 'Last Name', name: 'lastname' },
  { label: 'Business Name', name: 'businessname' },
  { label: 'Phone', name: 'phone' },
  { label: 'Alternate Phone', name: 'altphone' },
  { label: 'Email', name: 'email' },
  { label: 'Address', name: 'address' },
  { label: 'City', name: 'city' },
  { label: 'State', name: 'state', options: USA_STATES },
  { label: 'Zip', name: 'zip' },
  { label: 'Subdivision', name: 'subdivision' },
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

  loadUserProperty = async () => {
    const req = new Property();
    req.setUserId(this.props.userID);
    req.setId(this.props.propertyId);
    const res = await this.PropertyClient.BatchGet(req);
    this.setState({
      userProperty: res.toObject().resultsList[0],
    });
    return res.toObject().resultsList;
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
