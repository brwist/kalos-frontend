import React, { FC, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@kalos-core/kalos-rpc/User';
import { Group } from '@kalos-core/kalos-rpc/Group';
import { UserGroupLink } from '@kalos-core/kalos-rpc/UserGroupLink';
import { getPropertyAddress } from '@kalos-core/kalos-rpc/Property';
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
  UserGroupLinkClientService,
  UserClientService,
  CustomEventsHandler,
  getCFAppUrl,
  GroupClientService,
  makeSafeFormObject,
} from '../../../helpers';
import './styles.less';

const PendingBillingClientService = new PendingBillingClient(ENDPOINT);
interface Notification {
  notification: string;
  id: number;
}
const SCHEMA_NOTIFICATION: Schema<Notification> = [
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
  renderChildren?: (customer: User) => ReactNode;
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
  const [customer, setCustomer] = useState<User>(new User());
  const [pendingBillingRecordCount, setPendingBillingRecordCount] =
    useState<number>(0);
  const [isPendingBilling, setPendingBilling] = useState<boolean>(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupLinks, setGroupLinks] = useState<UserGroupLink[]>([]);
  const [groupLinksInitial, setGroupLinksInitial] = useState<UserGroupLink[]>(
    [],
  );
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [documentsOpened, setDocumentsOpened] = useState<boolean>(false);
  const [notificationEditing, setNotificationEditing] =
    useState<boolean>(false);
  const [notificationViewing, setNotificationViewing] =
    useState<boolean>(false);
  const [pendingBillingsLoaded, setPendingBillingsLoaded] = useState<boolean>();

  const groupLinksInitialIds = groupLinksInitial.map(g => g.getGroupId());

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
      let pendingBillingsTotalCount = 0;
      try {
        let result = await PendingBillingClientService.BatchGet(pendingBilling);
        pendingBillingsTotalCount = result.getTotalCount();
        setPendingBillingsLoaded(true);
      } catch (err) {
        console.error(
          `An error occurred while batch-getting pending bills: ${err}`,
        );
      }
      if (pendingBillingsTotalCount > 0) {
        setPendingBilling(true);
        setPendingBillingRecordCount(pendingBillingsTotalCount);
      }
    }
    const groups = await GroupClientService.loadGroups();
    setGroups(groups);
    const groupLinks =
      await UserGroupLinkClientService.loadUserGroupLinksByUserId(userID);
    setGroupLinks(groupLinks);
    setGroupLinksInitial(groupLinks);
    const entry = new User();
    entry.setId(userID);
    entry.setIsActive(1);
    try {
      const customer = await UserClientService.loadUserById(
        userID,
        viewedAsCustomer,
      );
      setCustomer(customer);
    } catch (e) {
      console.error(`An error occurred while loading user by id, error: ${e}`);
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
    handleToggleEditing,
    setPendingBillingsLoaded,
  ]);

  const handleSetNotificationEditing = useCallback(
    (notificationEditing: boolean) => () => {
      setNotificationEditing(notificationEditing);
    },
    [setNotificationEditing],
  );
  const handleResetGroups = useCallback(async () => {
    const groupLinks =
      await UserGroupLinkClientService.loadUserGroupLinksByUserId(userID);
    setGroupLinks(groupLinks);
    setGroupLinksInitial(groupLinks);
  }, [userID]);
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
    async (data: Notification) => {
      setSaving(true);
      const temp = customer;
      temp.setNotification(data.notification);
      temp.setFieldMaskList(['Notification']);
      temp.setId(data.id);
      if (temp) {
        const entry = await UserClientService.saveUser(temp, userID);
        setCustomer(entry);
        setSaving(false);
        setEditing(false);
        setNotificationEditing(false);
      } else {
        setSaving(false);
        setEditing(false);
        setNotificationEditing(false);
      }
    },
    [customer, userID],
  );

  const handleDelete = useCallback(async () => {
    // TODO: delete customer related data?
    const entry = new User();
    entry.setId(userID);
    await UserClientService.Delete(entry);
    setDeleting(false);
  }, [userID, setDeleting]);

  useEffect(() => {
    if (!customer.getId()) {
      load();
    }
    if (!viewedAsCustomer && customer.getNotification() !== '') {
      setNotificationViewing(true);
    }
  }, [customer, load, setNotificationViewing, viewedAsCustomer]);

  const data: Data = [
    [
      {
        label: 'Name',
        value: `${customer.getFirstname()} ${customer.getLastname()}`,
      },
      { label: 'Business Name', value: customer.getBusinessname() },
    ],
    [
      { label: 'Primary Phone', value: customer.getPhone(), href: 'tel' },
      { label: 'Cell Phone', value: customer.getCellphone(), href: 'tel' },
    ],
    [
      { label: 'Alternate Phone', value: customer.getAltphone(), href: 'tel' },
      { label: 'Fax', value: customer.getFax() },
    ],
    [
      {
        label: 'Billing Address',
        value: `${customer.getAddress()}, ${customer.getCity()}, ${customer.getState()} ${customer.getZip()}`,
      },
      { label: 'Email', value: customer.getEmail(), href: 'mailto' },
    ],
    ...(viewedAsCustomer
      ? []
      : [
          [{ label: 'Billing Terms', value: customer.getBillingTerms() }],
          [
            {
              label: 'Customer Notes',
              value: customer.getNotes(),
            },
            { label: 'Internal Notes', value: customer.getIntNotes() },
          ],
          [
            {
              label: 'Groups',
              value: groups
                .filter(u => groupLinksInitialIds.includes(u.getId()))
                .map(u => u.getName())
                .join(', '),
            },
            {
              label: 'Referred By',
              value: customer.getRecommendedBy(),
            },
          ],
        ]),
  ];
  const systemData: Data = [
    [
      {
        label: 'Created',
        value:
          customer.getDateCreated() === ''
            ? ''
            : formatDateTime(customer.getDateCreated()),
      },
    ],
    [
      {
        label: 'Last Login',
        value:
          customer.getLastLogin() === ''
            ? ''
            : formatDateTime(customer.getLastLogin()),
      },
    ],
    [
      {
        label: 'Login ID',
        value: customer.getLogin(),
      },
    ],
    [
      {
        label: 'Wishes to receive promotional emails',
        value: customer.getReceiveemail() ? 'Yes' : 'No',
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
                      url: [
                        getCFAppUrl('admin:service.calendar'),
                        'calendarAction=week',
                        `userIds=${userID}`,
                      ].join('&'),
                    },
                    {
                      label: 'Users',
                      url: [
                        getCFAppUrl('admin:customers.userslist'),
                        `id=${userID}`,
                      ].join('&'),
                    },
                    {
                      label: 'Call History',
                      url: [
                        getCFAppUrl('admin:customers.listPhoneCallLogs'),
                        'code=customers',
                        `id=${userID}`,
                      ].join('&'),
                    },
                    {
                      label: 'Tasks',
                      url: [
                        getCFAppUrl('admin:tasks.list'),
                        'code=customers',
                        `id=${userID}`,
                      ].join('&'),
                    },
                    {
                      label: customer.getNotification()
                        ? 'Notification'
                        : 'Add Notification',
                      onClick: customer.getNotification()
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
            <InfoTable
              data={data}
              loading={customer.getId() === 0}
              error={error}
            />
          </SectionBar>
        </div>
        {!viewedAsCustomer && (
          <div className="CustomerInformationAsidePanel">
            <SectionBar title="System Information">
              <InfoTable
                data={systemData}
                loading={customer.getId() === 0}
                error={error}
              />
            </SectionBar>
            <SectionBar
              title="Pending Billing"
              className="CustomerInformationPendingBilling"
              disabled={!isPendingBilling}
              actions={[
                {
                  label: isPendingBilling ? 'View' : 'None',
                  url: isPendingBilling
                    ? [
                        getCFAppUrl('admin:properties.customerpendingbilling'),
                        `user_id=${userID}`,
                        `property_id=${propertyId}`,
                      ].join('&')
                    : '',
                },
              ]}
            >
              <InfoTable
                data={[
                  [{ label: 'Record Count', value: pendingBillingRecordCount }],
                ]}
                loading={!pendingBillingsLoaded}
              />
            </SectionBar>
          </div>
        )}
      </div>
      {renderChildren && renderChildren(customer)}
      {children}
      <Modal open={editing} onClose={handleToggleEditing}>
        <CustomerEdit
          userId={customer.getId()}
          onSave={customer => {
            setCustomer(customer);
            setEditing(false);
            handleSetNotificationEditing(false);
            handleResetGroups();
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
        <Form<Notification>
          title={
            notificationViewing
              ? 'Customer Notification'
              : `${
                  customer.getNotification() === '' ? 'Add' : 'Edit'
                } Customer Notification`
          }
          schema={SCHEMA_NOTIFICATION}
          data={{
            notification: customer.getNotification(),
            id: customer.getId(),
          }}
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
                      handleSave({ notification: '', id: customer.getId() });
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
        name={`${customer.getFirstname()} ${customer.getLastname()}`}
      />
      <Modal open={documentsOpened} onClose={handleToggleDocuments}>
        <SectionBar
          title="Documents"
          actions={[{ label: 'Close', onClick: handleToggleDocuments }]}
          fixedActions
        />
        {customer
          .getPropertiesList()
          .filter(p => !!p.getIsActive())
          .map(prop => (
            <Documents
              key={prop.getId()}
              title={getPropertyAddress(prop)}
              propertyId={prop.getId()}
              userId={customer.getId()}
              ignoreUserId
              deletable={false}
              stickySectionBar={false}
            />
          ))}
      </Modal>
    </>
  );
};
