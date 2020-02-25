import React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import Grid from '@material-ui/core/Grid';
import { ENDPOINT, USA_STATES, BILLING_TERMS } from '../../../constants';
import { InfoTable, Data as InfoTableData } from './InfoTable';
import { Modal } from './Modal';
import { Form, Schema } from './Form';

const SCHEMA: Schema<User.AsObject>[] = [
  { label: 'First Name', name: 'firstname', required: true },
  { label: 'Last Name', name: 'lastname', required: true },
  { label: 'Business Name', name: 'businessname' },
  { label: 'Primary Phone', name: 'phone' },
  { label: 'Alternate Phone', name: 'altphone' },
  { label: 'Cell Phone', name: 'cellphone' },
  { label: 'Email', name: 'email', required: true },
  {
    label: 'Alternate Email(s)',
    name: 'altEmail',
    helperText: 'Separate multiple email addresses w/comma',
  },
  { label: 'Bulling Address', name: 'address', multiline: true },
  { label: 'Billing City', name: 'city' },
  { label: 'Billing State', name: 'state', options: USA_STATES },
  { label: 'Billing Zip Code', name: 'zip' },
  { label: 'Billing Terms', name: 'billingTerms', options: BILLING_TERMS },
  { label: 'Discount', name: 'discount', required: true },
  { label: 'Rebate', name: 'rebate', required: true },
  {
    label: 'Customer notes',
    name: 'notes',
    helperText: 'Visible to customer',
    multiline: true,
  },
  {
    label: 'Internal Notes',
    name: 'intNotes',
    helperText: 'NOT visible to customer',
    multiline: true,
  },
  // {label:'Who recommended us?', name:''}, // TODO
  {
    label: 'Login',
    name: 'login',
    required: true,
    helperText:
      'NOTE: If they have an email address, their login ID will automatically be their email address.',
  },
  { label: 'Password', name: 'pwd', type: 'password' },
];

interface props {
  userID: number;
  editing: boolean;
  onCloseEdit: () => void;
}

interface state {
  customer: User.AsObject;
  saving: boolean;
  error: boolean;
}

export class CustomerInformation extends React.PureComponent<props, state> {
  UserClient: UserClient;

  constructor(props: props) {
    super(props);
    this.state = {
      customer: new User().toObject(),
      saving: false,
      error: false,
    };
    this.UserClient = new UserClient(ENDPOINT);
  }

  loadEntry = async () => {
    const { userID } = this.props;
    const entry = new User();
    entry.setId(userID);
    try {
      const customer = await this.UserClient.Get(entry);
      this.setState({ customer });
    } catch (e) {
      this.setState({ error: true });
    }
  };

  handleSave = async (data: User.AsObject) => {
    const { userID, onCloseEdit } = this.props;
    this.setState({ saving: true });
    const entry = new User();
    entry.setId(userID);
    const fieldMaskList = [];
    for (const key in data) {
      const upperCaseProp = `${key[0].toUpperCase()}${key.slice(1)}`;
      const methodName = `set${upperCaseProp}`;
      //@ts-ignore
      entry[methodName](data[key]);
      fieldMaskList.push(upperCaseProp);
    }
    entry.setFieldMaskList(fieldMaskList);
    const customer = await this.UserClient.Update(entry);
    this.setState(() => ({ customer, saving: false }));
    onCloseEdit();
  };

  async componentDidMount() {
    // await this.UserClient.GetToken('test', 'test');
    await this.loadEntry();
  }

  render() {
    const { editing, onCloseEdit } = this.props;
    const { customer, saving, error } = this.state;
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
      notes,
      intNotes,
    } = customer;
    const infoTableData: InfoTableData = [
      [
        { label: 'Name', value: `${firstname} ${lastname}` },
        { label: 'Business Name', value: businessname },
      ],
      [
        { label: 'Primary Phone', value: phone, href: 'tel' },
        { label: 'Cell Phone', value: cellphone, href: 'tel' },
      ],
      [
        { label: 'Alternate Phone', value: altphone, href: 'tel' },
        { label: 'Fax', value: fax },
      ],
      [
        {
          label: 'Billing Address',
          value: `${address}, ${city}, ${state} ${zip}`,
        },
        { label: 'Email', value: email, href: 'mailto' },
      ],
      [{ label: 'Billing Terms', value: billingTerms }],
      [
        {
          label: 'Customer Notes',
          value: notes,
        },
        { label: 'Internal Notes', value: intNotes },
      ],
    ];
    return (
      <Grid container direction="column">
        <InfoTable data={infoTableData} loading={id === 0} error={error} />
        <Modal open={editing} onClose={onCloseEdit}>
          <Form<User.AsObject>
            schema={SCHEMA}
            data={customer}
            onSave={this.handleSave}
            onClose={onCloseEdit}
            disabled={saving}
          />
        </Modal>
      </Grid>
    );
  }
}
