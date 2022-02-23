// !PropertyType is same as Property.AsObject, we need to convert it to property

import React, { FC, useCallback, useState, useEffect } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { User } from '@kalos-core/kalos-rpc/User';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Confirm } from '../../ComponentsLibrary/Confirm';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { Search } from '../../ComponentsLibrary/Search';
import { ServiceItemLinks } from '../../ComponentsLibrary/ServiceItemLinks';
import { PropertyDocuments } from './PropertyDocuments';
import { ServiceItems } from '../../ComponentsLibrary/ServiceItems';
import { PropertyEdit } from '../../ComponentsLibrary/PropertyEdit';
import { ServiceCalls } from './ServiceCalls';

import {
  ActivityLogClientService,
  makeFakeRows,
  makeSafeFormObject,
  PropertyClientService,
  UserClientService,
} from '../../../helpers';
import './propertyInfo.less';
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import format from 'date-fns/esm/format';
import { templateSettings } from 'lodash';

export interface ProptertyNotification {
  notification: string;
  id: number;
}
const SCHEMA_PROPERTY_NOTIFICATION: Schema<ProptertyNotification> = [
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
  propertyId: number;
  loggedUserId: number;
  viewedAsCustomer?: boolean;
  onClose?: () => void;
}

export const PropertyInfo: FC<Props> = props => {
  const {
    userID,
    propertyId,
    loggedUserId,
    viewedAsCustomer = false,
    onClose,
  } = props;
  const [entry, setEntry] = useState<Property>(new Property());
  const [user, setUser] = useState<User>();
  const [loggedUser, setLoggedUser] = useState<User>(new User());
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [notificationEditing, setNotificationEditing] =
    useState<boolean>(false);
  const [notificationViewing, setNotificationViewing] =
    useState<boolean>(false);
  const [editMenuAnchorEl, setEditMenuAnchorEl] = useState<
    (EventTarget & HTMLElement) | null
  >(null);
  const [linksViewing, setLinksViewing] = useState<boolean>(false);
  const [changingOwner, setChangingOwner] = useState<boolean>(false);
  const [pendingChangeOwner, setPendingChangeOwner] = useState<User>();
  const [merging, setMerging] = useState<boolean>(false);
  const [pendingMerge, setPendingMerge] = useState<
    Property & { __user: User }
  >();

  const handleSetEditing = useCallback(
    (editing: boolean) => () => setEditing(editing),
    [setEditing],
  );

  const handleSetDeleting = useCallback(
    (deleting: boolean) => () => setDeleting(deleting),
    [setDeleting],
  );

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

  const handleSetEditEditMenuAnchorEl = useCallback(
    (editMenuAnchorEl: (EventTarget & HTMLElement) | null) =>
      setEditMenuAnchorEl(editMenuAnchorEl),
    [setEditMenuAnchorEl],
  );

  const handleSetLinksViewing = useCallback(
    (linksViewing: boolean) => () => setLinksViewing(linksViewing),
    [setLinksViewing],
  );

  const handleSetChangingOwner = useCallback(
    (changingOwner: boolean) => () => setChangingOwner(changingOwner),
    [setChangingOwner],
  );

  const handleSetPendingChangeOwner = useCallback(
    pendingChangeOwner => setPendingChangeOwner(pendingChangeOwner),
    [setPendingChangeOwner],
  );

  const handleSetMerging = useCallback(
    (merging: boolean) => () => setMerging(merging),
    [setMerging],
  );

  const handleSetPendingMerge = useCallback(
    pendingMerge => setPendingMerge(pendingMerge),
    [setPendingMerge],
  );

  const load = useCallback(async () => {
    setLoading(true);
    const user = await UserClientService.loadUserById(userID);
    setUser(user);
    const loggedUser = await UserClientService.loadUserById(loggedUserId);
    setLoggedUser(loggedUser);
    const req = new Property();
    req.setUserId(userID);
    req.setId(propertyId);
    req.setIsActive(1);
    try {
      const results = await PropertyClientService.Get(req);
      if (results) {
        const entry = results;
        setEntry(entry);
        setLoading(false);
        return entry;
      }
      setLoading(false);
      return null;
    } catch (e) {
      setError(true);
    }
    setLoading(false);
    return null;
  }, [setLoading, userID, propertyId, setEntry, setError, setUser]);

  useEffect(() => {
    if (!entry.getId() && !entry.getUserId()) {
      load();
    }
    if (!viewedAsCustomer && entry.getNotification() !== '') {
      setNotificationViewing(true);
    }
  }, [entry, load, setNotificationViewing, viewedAsCustomer]);

  const handleSave = useCallback(
    async (data: Property) => {
      setSaving(true);
      const entry = await PropertyClientService.saveProperty(
        data,
        userID,
        propertyId,
      );
      setEntry(entry);
      setSaving(false);
      setEditing(false);
      setNotificationEditing(false);
    },
    [
      setSaving,
      userID,
      propertyId,
      setEntry,
      setEditing,
      setNotificationEditing,
    ],
  );

  const handleSaveNotification = useCallback(
    async (data: ProptertyNotification) => {
      setSaving(true);
      const temp = entry;
      temp.setNotification(data.notification);
      temp.setFieldMaskList(['Notification']);
      temp.setId(data.id);
      if (temp) {
        const entry = await PropertyClientService.saveProperty(
          temp,
          userID,
          propertyId,
        );
        setEntry(entry);
        setSaving(false);
        setEditing(false);
        setNotificationEditing(false);
      } else {
        setSaving(false);
        setEditing(false);
        setNotificationEditing(false);
      }
    },
    [
      setSaving,
      userID,
      entry,
      propertyId,
      setEntry,
      setEditing,
      setNotificationEditing,
    ],
  );
  const handleDelete = useCallback(async () => {
    // TODO: delete customer related data + redirect somewhere?
    const entry = new Property();
    entry.setId(propertyId);
    const actLog = new ActivityLog();
    actLog.setUserId(userID);
    actLog.setPropertyId(propertyId);
    actLog.setActivityName(`Deleted Property : ${propertyId}`);
    actLog.setActivityDate(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    try {
      await PropertyClientService.Delete(entry);
      await ActivityLogClientService.Create(actLog);
    } catch (err) {
      console.error(err);
    }
    setDeleting(false);
  }, [propertyId, setDeleting, userID]);

  const handleChangeOwner = useCallback(async () => {
    if (pendingChangeOwner) {
      const id = pendingChangeOwner.getId();
      setPendingChangeOwner(undefined);
      setError(false);
      const entry = new Property();
      entry.setId(propertyId);
      entry.setUserId(id);
      // entry.setFieldMaskList(['UserId']);
      try {
        await PropertyClientService.Update(entry); // FIXME: for some reason this call fails
        window.open(
          [
            '/index.cfm?action=admin:properties.details',
            `property_id=${propertyId}`,
            `user_id=${id}`,
          ].join('&'),
        );
      } catch (e) {
        setError(true);
      }
    }
  }, [pendingChangeOwner, setPendingChangeOwner, setError, propertyId]);

  const handleMerge = useCallback(async () => {
    if (pendingMerge) {
      setPendingMerge(undefined);
      window.open(
        [
          '/index.cfm?action=admin:properties.mergeproperty',
          `oldPropertyId=${propertyId}`,
          `newPropertyId=${pendingMerge.getId()}`,
          `newOwnerId=${pendingMerge.__user.getId()}`,
        ].join('&'),
      );
    }
  }, [pendingMerge, setPendingMerge, propertyId]);
  console.log('entry data', entry);
  if (entry.getId() === 0 && entry.getUserId() == 0)
    return (
      <>
        <SectionBar title="Property Information">
          <InfoTable loading={loading} data={loading ? makeFakeRows() : []} />
        </SectionBar>
      </>
    );
  const data: Data = [
    ...(viewedAsCustomer
      ? []
      : ([
          [
            {
              label: 'Name',
              value: `${entry.getFirstname()} ${entry.getLastname()}`,
            },
            { label: 'Business Name', value: entry.getBusinessname() },
          ],
          [
            { label: 'Primary Phone', value: entry.getPhone(), href: 'tel' },
            {
              label: 'Alternate Phone',
              value: entry.getAltphone(),
              href: 'tel',
            },
          ],
          [{ label: 'Email', value: entry.getEmail(), href: 'mailto' }],
        ] as Data)),
    [
      {
        label: 'Address',
        value: `${entry.getAddress()}, ${entry.getCity()}, ${entry.getState()} ${entry.getZip()}`,
      },
    ],
    [
      { label: 'Directions', value: entry.getDirections() },
      { label: 'Subdivision', value: entry.getSubdivision() },
    ],
    [{ label: 'Notes', value: entry.getNotes() }],
  ];
  return (
    <>
      <div className="PropertyInfoPropertiesWrapper">
        <div className="PropertyInfoProperties">
          <SectionBar
            title="Property Information"
            actions={
              viewedAsCustomer
                ? [
                    {
                      label: 'Edit Property',
                      onClick: handleSetEditing(true),
                    },
                    {
                      label: 'Close',
                      onClick: onClose,
                    },
                  ]
                : [
                    {
                      label: 'Tasks',
                      url: `/index.cfm?action=admin:tasks.list&code=properties&id=${propertyId}`,
                    },
                    {
                      label: entry.getNotification()
                        ? 'Notification'
                        : 'Add Notification',
                      onClick: entry.getNotification()
                        ? handleSetNotificationViewing(true)
                        : handleSetNotificationEditing(true),
                    },
                    {
                      label: 'Change',
                      onClick: ({
                        currentTarget,
                      }: React.MouseEvent<HTMLElement>) =>
                        handleSetEditEditMenuAnchorEl(currentTarget),
                      desktop: true,
                    },
                    {
                      label: 'Edit Property',
                      onClick: handleSetEditing(true),
                      desktop: false,
                    },
                    {
                      label: 'Activity',
                      url: `/index.cfm?action=admin:report.activityproperty&property_id=${propertyId}`,
                      desktop: false,
                    },
                    {
                      label: 'Delete Property',
                      desktop: false,
                      onClick: handleSetDeleting(true),
                    },
                    {
                      label: 'Merge Property',
                      desktop: false,
                      onClick: handleSetMerging(true),
                    },
                    {
                      label: 'Change Owner',
                      desktop: false,
                      onClick: handleSetChangingOwner(true),
                    },
                    {
                      label: 'Owner Details',
                      url: `/index.cfm?action=admin:customers.details&user_id=${entry.getUserId()}`,
                    },
                    {
                      label: 'Links',
                      onClick: handleSetLinksViewing(true),
                    },
                  ]
            }
          >
            <InfoTable data={data} loading={loading} error={error} />
          </SectionBar>
          <ServiceItems {...props} />
        </div>
        <PropertyDocuments
          className="PropertyInfoDocuments"
          propertyId={props.propertyId}
          userID={props.userID}
          viewedAsCustomer={false}
        />
      </div>
      <ServiceCalls {...props} user={loggedUser} />
      <Modal open={editing} onClose={handleSetEditing(false)}>
        <PropertyEdit
          userId={userID}
          propertyId={propertyId}
          onClose={handleSetEditing(false)}
          onSave={entry => {
            setEntry(entry);
            setEditing(false);
            setNotificationEditing(false);
          }}
          property={entry}
        />
      </Modal>
      <Modal
        open={notificationEditing || notificationViewing}
        onClose={() => {
          handleSetNotificationViewing(false)();
          handleSetNotificationEditing(false)();
        }}
      >
        <Form<ProptertyNotification>
          title={
            notificationViewing
              ? 'Property Notification'
              : `${
                  entry.getNotification() === '' ? 'Add' : 'Edit'
                } Property Notification`
          }
          schema={SCHEMA_PROPERTY_NOTIFICATION}
          data={{ notification: entry.getNotification(), id: propertyId }}
          onSave={handleSaveNotification}
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
                      let newProp = { notification: '', id: propertyId };
                      handleSaveNotification(newProp);
                    },
                  },
                ]
              : []
          }
        />
      </Modal>
      <Menu
        id="customized-menu"
        keepMounted
        anchorEl={editMenuAnchorEl}
        open={Boolean(editMenuAnchorEl)}
        onClose={() => handleSetEditEditMenuAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        getContentAnchorEl={null}
      >
        <MenuItem
          onClick={() => {
            handleSetEditEditMenuAnchorEl(null);
            handleSetEditing(true)();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSetEditEditMenuAnchorEl(null);
            window.open(
              `/index.cfm?action=admin:report.activityproperty&property_id=${propertyId}`,
            );
          }}
        >
          Activity
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSetEditEditMenuAnchorEl(null);
            handleSetDeleting(true)();
          }}
        >
          Delete Property
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSetEditEditMenuAnchorEl(null);
            handleSetMerging(true)();
          }}
        >
          Merge Property
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSetEditEditMenuAnchorEl(null);
            handleSetChangingOwner(true)();
          }}
        >
          Change Owner
        </MenuItem>
      </Menu>
      <Modal open={linksViewing} onClose={handleSetLinksViewing(false)}>
        <ServiceItemLinks
          kind="Property Information Link"
          serviceItemId={propertyId}
          onClose={handleSetLinksViewing(false)}
        />
      </Modal>
      <ConfirmDelete
        open={deleting}
        onClose={handleSetDeleting(false)}
        onConfirm={handleDelete}
        kind="Property Information"
        name={`${entry.getFirstname()} ${entry.getLastname()}`}
      />
      <Search
        kinds={['Customers']}
        open={changingOwner}
        onClose={handleSetChangingOwner(false)}
        onSelect={handleSetPendingChangeOwner}
        excludeId={userID}
      />
      <Search
        kinds={['Properties']}
        open={merging}
        onClose={handleSetMerging(false)}
        onSelect={handleSetPendingMerge}
        excludeId={userID}
      />
      {pendingChangeOwner && (
        <Confirm
          open
          title="Confirm"
          onClose={() => setPendingChangeOwner(undefined)}
          onConfirm={handleChangeOwner}
        >
          Are you sure you want to move this property to{' '}
          <strong>
            {pendingChangeOwner.getFirstname()}{' '}
            {pendingChangeOwner.getLastname()}
          </strong>
          ?
        </Confirm>
      )}
      {pendingMerge && user && (
        <Confirm
          open
          title="Confirm"
          onClose={() => setPendingMerge(undefined)}
          onConfirm={handleMerge}
        >
          Are you sure you want to remove all information from{' '}
          <strong>
            {entry.getAddress()}, {entry.getCity()}, {entry.getState()}{' '}
            {entry.getZip()}
          </strong>
          , under{' '}
          <strong>
            {user.getBusinessname() ||
              `${user.getFirstname()} ${user.getLastname()}`}
          </strong>
          , and merge it into{' '}
          <strong>
            {pendingMerge.getAddress()}, {pendingMerge.getCity()},{' '}
            {pendingMerge.getState()} {pendingMerge.getZip()}
          </strong>
          , under{' '}
          <strong>
            {pendingMerge.__user.getBusinessname() ||
              `${pendingMerge.__user.getFirstname()} ${pendingMerge.__user.getLastname()}`}
          </strong>
          ?
        </Confirm>
      )}
    </>
  );
};
