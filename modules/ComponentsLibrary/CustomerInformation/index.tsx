import React, { FC, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@kalos-core/kalos-rpc/User';
import {
  PendingBillingClient,
  PendingBilling,
} from '@kalos-core/kalos-rpc/PendingBilling';
import { ENDPOINT } from '../../../constants';
import { InfoTable, Data } from '../InfoTable';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { SectionBar } from '../SectionBar';
import { ConfirmDelete } from '../ConfirmDelete';
import { CustomerEdit } from '../CustomerEdit';
import { Documents } from '../Documents';
import {
  formatDateTime,
  UserType,
  saveUser,
  loadGroups,
  loadUserGroupLinksByUserId,
  loadUserById,
  GroupType,
  UserGroupLinkType,
  UserClientService,
  getPropertyAddress,
  CustomEventsHandler,
} from '../../../helpers';
import './styles.less';

const PendingBillingClientService = new PendingBillingClient(ENDPOINT);

const SCHEMA_PROPERTY_NOTIFICATION: Schema<UserType> = [
  [
    {
      label: 'Notification',
      name: 'notification',
      required: true,
      multiline: true,
    },
  ],
  [
    {
      name: 'id',
      type: 'hidden',
    },
  ],
];

interface Props {
  userID: number;
  viewedAsCustomer?: boolean;
  propertyId?: number;
  renderChildren?: (customer: UserType) => ReactNode;
  onClose?: () => void;
}

export const CustomerInformation: FC<Props> = ({
  userID,
  propertyId,
  renderChildren,
  onClose,
  children,
  viewedAsCustomer = false,
}) => {
  const [customer, setCustomer] = useState<UserType>(new User().toObject());
  const [isPendingBilling, setPendingBilling] = useState<boolean>(false);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [groupLinks, setGroupLinks] = useState<UserGroupLinkType[]>([]);
  const [groupLinksInitial, setGroupLinksInitial] = useState<
    UserGroupLinkType[]
  >([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [documentsOpened, setDocumentsOpened] = useState<boolean>(false);
  const [notificationEditing, setNotificationEditing] = useState<boolean>(
    false,
  );
  const [notificationViewing, setNotificationViewing] = useState<boolean>(
    false,
  );

  const groupLinksInitialIds = groupLinksInitial.map(({ groupId }) => groupId);

  const handleToggleEditing = useCallback(() => {
    setEditing(!editing);
    if (!editing) {
      setGroupLinks(groupLinksInitial);
    }
  }, [editing, setEditing, setGroupLinks, groupLinksInitial]);

  const handleToggleDocuments = useCallback(
    () => setDocumentsOpened(!documentsOpened),
    [setDocumentsOpened, documentsOpened],
  );

  const load = useCallback(async () => {
    if (propertyId) {
      const pendingBilling = new PendingBilling();
      pendingBilling.setUserId(userID);
      pendingBilling.setPropertyId(propertyId);
      const { totalCount: pendingBillingsTotalCount } = (
        await PendingBillingClientService.BatchGet(pendingBilling)
      ).toObject();
      if (pendingBillingsTotalCount > 0) {
        setPendingBilling(true);
      }
    }
    const groups = await loadGroups();
    setGroups(groups);
    const groupLinks = await loadUserGroupLinksByUserId(userID);
    setGroupLinks(groupLinks);
    setGroupLinksInitial(groupLinks);
    const entry = new User();
    entry.setId(userID);
    entry.setIsActive(1);
    try {
      const customer = await loadUserById(userID, viewedAsCustomer);
      setCustomer(customer);
    } catch (e) {
      setError(true);
    }
    CustomEventsHandler.listen('ShowDocuments', handleToggleDocuments);
    CustomEventsHandler.listen('EditCustomer', handleToggleEditing);
  }, [
    userID,
    propertyId,
    setCustomer,
    setError,
    setGroupLinks,
    setGroupLinksInitial,
    setGroups,
    viewedAsCustomer,
    handleToggleDocuments,
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
    async (data: UserType) => {
      setSaving(true);
      const customer = await saveUser(data, userID);
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
    if (!viewedAsCustomer && customer.notification !== '') {
      setNotificationViewing(true);
    }
  }, [customer, load, setNotificationViewing, viewedAsCustomer]);

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
    ...(viewedAsCustomer
      ? []
      : [
          [{ label: 'Billing Terms', value: billingTerms }],
          [
            {
              label: 'Customer Notes',
              value: notes,
            },
            { label: 'Internal Notes', value: intNotes },
          ],
          [
            {
              label: 'Groups',
              value: groups
                .filter(({ id }) => groupLinksInitialIds.includes(id))
                .map(({ name }) => name)
                .join(', '),
            },
          ],
        ]),
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
      <div className="CustomerInformation">
        <div className="CustomerInformationCustomerInformation">
          <SectionBar
            title="Customer Information"
            actions={
              viewedAsCustomer
                ? [
                    {
                      label: 'Edit',
                      onClick: handleToggleEditing,
                    },
                    ...(onClose
                      ? [
                          {
                            label: 'Close',
                            onClick: onClose,
                          },
                        ]
                      : []),
                  ]
                : [
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
                      label: 'Edit',
                      onClick: handleToggleEditing,
                    },
                    {
                      label: 'Delete',
                      onClick: handleSetDeleting(true),
                    },
                    ...(onClose
                      ? [
                          {
                            label: 'Close',
                            onClick: onClose,
                          },
                        ]
                      : []),
                  ]
            }
          >
            <InfoTable data={data} loading={id === 0} error={error} />
          </SectionBar>
        </div>
        {!viewedAsCustomer && (
          <div className="CustomerInformationAsidePanel">
            <SectionBar title="System Information">
              <InfoTable data={systemData} loading={id === 0} error={error} />
            </SectionBar>
            {isPendingBilling && (
              <SectionBar
                title="Pending Billing"
                className="CustomerInformationPendingBilling"
                actions={[
                  {
                    label: 'View',
                    url: [
                      '/index.cfm?action=admin:properties.customerpendingbilling',
                      `user_id=${userID}`,
                      `property_id=${propertyId}`,
                    ].join('&'),
                  },
                ]}
              />
            )}
          </div>
        )}
      </div>
      {renderChildren && renderChildren(customer)}
      {children}
      <Modal open={editing} onClose={handleToggleEditing}>
        <CustomerEdit
          userId={customer.id}
          onSave={customer => {
            setCustomer(customer);
            setEditing(false);
            handleSetNotificationEditing(false);
          }}
          onClose={handleToggleEditing}
          customer={customer}
          groups={groups}
          groupLinks={groupLinks}
          viewedAsCustomer={viewedAsCustomer}
        />
      </Modal>
      <Modal
        open={notificationEditing || notificationViewing}
        onClose={() => {
          handleSetNotificationViewing(false)();
          handleSetNotificationEditing(false)();
        }}
      >
        <Form<UserType>
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
                      handleSave({ notification: '' } as UserType);
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
      <Modal open={documentsOpened} onClose={handleToggleDocuments}>
        <SectionBar
          title="Documents"
          actions={[{ label: 'Close', onClick: handleToggleDocuments }]}
          fixedActions
        />
        {customer.propertiesList
          .filter(({ isActive }) => !!isActive)
          .map(prop => (
            <Documents
              key={prop.id}
              title={getPropertyAddress(prop)}
              propertyId={prop.id}
              deletable={false}
              stickySectionBar={false}
            />
          ))}
      </Modal>
    </>
  );
};
