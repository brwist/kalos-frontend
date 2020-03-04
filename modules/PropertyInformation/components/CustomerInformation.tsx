import React, { FC, useState, useEffect, useCallback } from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { makeStyles } from '@material-ui/core/styles';
import { ENDPOINT, USA_STATES, BILLING_TERMS } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { getRPCFields, formatDateTime } from '../../../helpers';

const UserClientService = new UserClient(ENDPOINT);

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
    {
      label: 'Wishes to receive promotional emails',
      name: 'receiveemail',
      type: 'checkbox',
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

const SCHEMA_PROPERTY_NOTIFICATION: Schema<Entry> = [
  [
    {
      label: 'Notification',
      name: 'notification',
      required: true,
      multiline: true,
    },
  ],
];

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('lg')]: {
      alignItems: 'flex-start',
    },
  },
  asidePanel: {
    marginTop: 8,
    flexShrink: 0,
    [theme.breakpoints.down('md')]: {
      flexGrow: 1,
      marginBottom: theme.spacing(),
    },
    [theme.breakpoints.up('lg')]: {
      width: 470,
      marginLeft: theme.spacing(2),
    },
  },
  pendingBilling: {
    marginBottom: theme.spacing(),
  },
}));

interface Props {
  userID: number;
  propertyId: number;
}

export const CustomerInformation: FC<Props> = ({ userID, propertyId }) => {
  const [customer, setCustomer] = useState<Entry>(new User().toObject());
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [notificationEditing, setNotificationEditing] = useState<boolean>(
    false,
  );
  const [notificationViewing, setNotificationViewing] = useState<boolean>(
    false,
  );
  const classes = useStyles();

  const load = useCallback(async () => {
    const entry = new User();
    entry.setId(userID);
    try {
      const customer = await UserClientService.Get(entry);
      setCustomer(customer);
    } catch (e) {
      setError(true);
    }
  }, [userID, setCustomer, setError]);

  const handleToggleEditing = useCallback(() => setEditing(!editing), [
    editing,
    setEditing,
  ]);

  const handleSetNotificationEditing = useCallback(
    (notificationEditing: boolean) => () =>
      setNotificationEditing(notificationEditing),
    [setNotificationEditing],
  );

  const handleSetNotificationViewing = useCallback(
    (notificationViewing: boolean) => () =>
      setNotificationViewing(notificationViewing),
    [setNotificationViewing],
  );

  const handleSetDeleting = useCallback(
    (deleting: boolean) => () => setDeleting(deleting),
    [setDeleting],
  );

  const handleSave = useCallback(
    async (data: Entry) => {
      setSaving(true);
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
      const customer = await UserClientService.Update(entry);
      setCustomer(customer);
      setSaving(false);
      setEditing(false);
      handleSetNotificationEditing(false)();
    },
    [setSaving, userID, setCustomer, setEditing, handleSetNotificationEditing],
  );

  const handleDelete = useCallback(async () => {
    // TODO: delete customer related data?
    const entry = new User();
    entry.setId(userID);
    await UserClientService.Delete(entry);
    setDeleting(false);
  }, [userID, setDeleting]);

  useEffect(() => {
    if (!customer.id) {
      load();
    }
    if (customer.notification !== '') {
      setNotificationViewing(true);
    }
  }, [customer, load, setNotificationViewing]);

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
    notification,
    receiveemail,
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
    [
      {
        label: 'Created',
        value: dateCreated === '' ? '' : formatDateTime(dateCreated),
      },
    ],
    [
      {
        label: 'Last Login',
        value: lastLogin === '' ? '' : formatDateTime(lastLogin),
      },
    ],
    [
      {
        label: 'Login ID',
        value: login,
      },
    ],
    [
      {
        label: 'Wishes to receive promotional emails',
        value: receiveemail ? 'Yes' : 'No',
      },
    ],
  ];
  return (
    <>
      <SectionBar
        title="Customer Information"
        actions={[
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
            label: notification ? 'Notification' : 'Add Notification',
            onClick: notification
              ? handleSetNotificationViewing(true)
              : handleSetNotificationEditing(true),
          },
          {
            label: 'Edit Customer Information',
            onClick: handleToggleEditing,
          },
          {
            label: 'Delete Customer',
            onClick: handleSetDeleting(true),
          },
        ]}
      >
        <div className={classes.wrapper}>
          <InfoTable
            styles={{ flexGrow: 1 }}
            data={data}
            loading={id === 0}
            error={error}
          />
          <div className={classes.asidePanel}>
            <SectionBar title="System Information">
              <InfoTable data={systemData} loading={id === 0} error={error} />
            </SectionBar>
            <SectionBar
              title="Pending Billing"
              className={classes.pendingBilling}
              actions={[
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
      <Modal open={editing} onClose={handleToggleEditing}>
        <Form<Entry>
          title="Edit Customer Information"
          schema={SCHEMA}
          data={customer}
          onSave={handleSave}
          onClose={handleToggleEditing}
          disabled={saving}
        />
      </Modal>
      <Modal
        open={notificationEditing || notificationViewing}
        onClose={() => {
          handleSetNotificationViewing(false)();
          handleSetNotificationEditing(false)();
        }}
      >
        <Form<Entry>
          title={
            notificationViewing
              ? 'Customer Notification'
              : `${notification === '' ? 'Add' : 'Edit'} Customer Notification`
          }
          schema={SCHEMA_PROPERTY_NOTIFICATION}
          data={customer}
          onSave={handleSave}
          onClose={() => {
            handleSetNotificationViewing(false)();
            handleSetNotificationEditing(false)();
          }}
          disabled={saving}
          readOnly={notificationViewing}
          actions={
            notificationViewing
              ? [
                  {
                    label: 'Edit',
                    variant: 'outlined',
                    onClick: () => {
                      handleSetNotificationViewing(false)();
                      handleSetNotificationEditing(true)();
                    },
                  },
                  {
                    label: 'Delete',
                    variant: 'outlined',
                    onClick: () => {
                      handleSetNotificationViewing(false)();
                      handleSave({ notification: '' } as Entry);
                    },
                  },
                ]
              : []
          }
        />
      </Modal>
      <ConfirmDelete
        open={deleting}
        onClose={handleSetDeleting(false)}
        onConfirm={handleDelete}
        kind="Customer"
        name={`${firstname} ${lastname}`}
      />
    </>
  );
};
