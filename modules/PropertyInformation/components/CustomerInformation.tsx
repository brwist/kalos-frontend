import React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT, USA_STATES, BILLING_TERMS } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { getRPCFields, formatDateTime } from '../../../helpers';

type Entry = User.AsObject;

const SCHEMA: Schema<Entry> = [
  [{ label: 'Personal Details', headline: true }],
  [
    { label: 'First Name', name: 'firstname', required: true },
    { label: 'Last Name', name: 'lastname', required: true },
    { label: 'Business Name', name: 'businessname', multiline: true },
  ],
  [{ label: 'Contact Details', headline: true }],
  [
    { label: 'Primary Phone', name: 'phone' },
    { label: 'Alternate Phone', name: 'altphone' },
    { label: 'Cell Phone', name: 'cellphone' },
  ],
  [
    { label: 'Email', name: 'email', required: true },

    {
      label: 'Alternate Email(s)',
      name: 'altEmail',
      helperText: 'Separate multiple email addresses w/comma',
    },
  ],
  [{ label: 'Address Details', headline: true }],
  [
    { label: 'Bulling Address', name: 'address', multiline: true },
    { label: 'Billing City', name: 'city' },
    { label: 'Billing State', name: 'state', options: USA_STATES },
    { label: 'Billing Zip Code', name: 'zip' },
  ],
  [{ label: 'Billing Details', headline: true }],
  [
    { label: 'Billing Terms', name: 'billingTerms', options: BILLING_TERMS },
    { label: 'Discount', name: 'discount', required: true, type: 'number' },
    { label: 'Rebate', name: 'rebate', required: true, type: 'number' },
  ],
  [{ label: 'Notes', headline: true }],
  [
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
  ],
  // {label:'Who recommended us?', name:''}, // TODO
  [{ label: 'Login details', headline: true }],
  [
    {
      label: 'Login',
      name: 'login',
      required: true,
      helperText:
        'NOTE: If they have an email address, their login ID will automatically be their email address.',
    },
    { label: 'Password', name: 'pwd', type: 'password' },
  ],
];

interface Props {
  userID: number;
  propertyId: number;
}

interface State {
  customer: Entry;
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

  load = async () => {
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

  handleSave = async (data: Entry) => {
    const { userID } = this.props;
    this.setState({ saving: true });
    const entry = new User();
    entry.setId(userID);
    const fieldMaskList = [];
    for (const fieldName in data) {
      const { upperCaseProp, methodName } = getRPCFields(fieldName);
      // @ts-ignore
      entry[methodName](data[fieldName]);
      fieldMaskList.push(upperCaseProp);
    }
    entry.setFieldMaskList(fieldMaskList);
    const customer = await this.UserClient.Update(entry);
    this.setState({ customer, saving: false });
    this.handleToggleEditing();
  };

  async componentDidMount() {
    await this.load();
  }

  render() {
    const { userID, propertyId } = this.props;
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
      dateCreated,
      lastLogin,
      login,
    } = customer;
    const data: Data = [
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
    const systemData: Data = [
      [{ label: 'Created', value: formatDateTime(dateCreated) }],
      [{ label: 'Last Login', value: formatDateTime(lastLogin) }],
      [{ label: 'Login ID', value: login }],
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
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <InfoTable
              styles={{ flexGrow: 1, marginRight: 16 }}
              data={data}
              loading={id === 0}
              error={error}
            />
            <div style={{ width: 470, marginTop: 8, flexShrink: 0 }}>
              <SectionBar title="System Information">
                <InfoTable data={systemData} loading={id === 0} error={error} />
              </SectionBar>
              <SectionBar
                title="Pending Billing"
                buttons={[
                  {
                    label: 'View',
                    url: [
                      '/index.cfm?action=admin:properties.customerpendingbilling',
                      `user_id=${userID}`,
                      `property_id=${propertyId}`,
                      'unique=207D8F02-BBCF-005A-4455A712EDA6614C', // FIXME set proper unique
                    ].join('&'),
                  },
                ]}
              />
            </div>
          </div>
        </SectionBar>
        <Modal open={editing} onClose={this.handleToggleEditing}>
          <Form<Entry>
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
