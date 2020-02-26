import React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT, USA_STATES, BILLING_TERMS } from '../../../constants';
import {
  InfoTable,
  Data as InfoTableData,
} from '../../ComponentsLibrary/InfoTable';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';

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

interface Props {
  userID: number;
}

interface State {
  customer: User.AsObject;
  editing: boolean;
  saving: boolean;
  error: boolean;
}

export class CustomerInformation extends React.PureComponent<Props, State> {
  UserClient: UserClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      customer: new User().toObject(),
      editing: false,
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

  handleToggleEditing = () => this.setState({ editing: !this.state.editing });

  handleSave = async (data: User.AsObject) => {
    const { userID } = this.props;
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
    this.handleToggleEditing();
  };

  async componentDidMount() {
    await this.loadEntry();
  }

  render() {
    const { userID } = this.props;
    const { customer, editing, saving, error } = this.state;
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
    const data: InfoTableData = [
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
      <>
        <SectionBar
          title="Customer Information"
          buttons={[
            {
              label: 'Calendar',
              url: `/index.cfm?action=admin:service.calendar&calendarAction=week&userIds=${userID}`,
            },
            {
              label: 'Call History',
              url: `/index.cfm?action=admin:customers.listPhoneCallLogs&code=customers&id=${userID}`,
            },
            {
              label: 'Tasks',
              url: `/index.cfm?action=admin:tasks.list&code=customers&id=${userID}`,
            },
            {
              label: 'Add Notification',
              onClick: () => {}, // TODO: implement onClick
            },
            {
              label: 'Edit Customer Information',
              onClick: this.handleToggleEditing,
            },
            {
              label: 'Delete Customer',
              onClick: () => {}, // TODO: implement onClick
            },
          ]}
        />
        <InfoTable data={data} loading={id === 0} error={error} />
        <Modal open={editing} onClose={this.handleToggleEditing}>
          <Form<User.AsObject>
            title="Edit Customer Information"
            schema={SCHEMA}
            data={customer}
            onSave={this.handleSave}
            onClose={this.handleToggleEditing}
            disabled={saving}
          />
        </Modal>
      </>
    );
  }
}
