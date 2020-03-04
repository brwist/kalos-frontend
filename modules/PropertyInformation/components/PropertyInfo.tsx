import React, { FC, useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { User } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT, USA_STATES } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Confirm } from '../../ComponentsLibrary/Confirm';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { Search } from '../../ComponentsLibrary/Search';
import { ServiceItemLinks } from './ServiceItemLinks';
import { PropertyDocuments } from './PropertyDocuments';
import { ServiceItems } from './ServiceItems';
import { ServiceCalls } from './ServiceCalls';
import { getRPCFields, loadUsersByIds } from '../../../helpers';

const PropertyClientService = new PropertyClient(ENDPOINT);

type Entry = Property.AsObject;
type UserEntry = User.AsObject;

const PROP_LEVEL = 'Used for property-level billing only';
const RESIDENTIAL = [
  { label: 'Residential', value: 1 },
  { label: 'Commercial', value: 0 },
];

const SCHEMA_PROPERTY_INFORMATION: Schema<Entry> = [
  [{ label: 'Personal Details', headline: true, description: PROP_LEVEL }],
  [
    { label: 'First Name', name: 'firstname' },
    { label: 'Last Name', name: 'lastname' },
    { label: 'Business Name', name: 'businessname' },
  ],
  [{ label: 'Contact Details', headline: true, description: PROP_LEVEL }],
  [
    { label: 'Primary Phone', name: 'phone' },
    { label: 'Alternate Phone', name: 'altphone' },
    { label: 'Email', name: 'email' },
  ],
  [{ label: 'Address Details', headline: true }],
  [
    { label: 'Address', name: 'address', required: true, multiline: true },
    { label: 'City', name: 'city', required: true },
    { label: 'State', name: 'state', options: USA_STATES, required: true },
    { label: 'Zip Code', name: 'zip', required: true },
  ],
  [{ label: 'Location Details', headline: true }],
  [
    { label: 'Directions', name: 'directions', multiline: true },
    { label: 'Subdivision', name: 'subdivision' },
  ],
  [
    { label: 'Zoning', name: 'isResidential', options: RESIDENTIAL },
    { label: 'Latitude', name: 'geolocationLat', type: 'number' },
    { label: 'Longitude', name: 'geolocationLng', type: 'number' },
  ],
  [{ label: 'Notes', headline: true }],
  [{ label: 'Notes', name: 'notes', multiline: true }],
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

interface Props {
  userID: number;
  propertyId: number;
  loggedUserId: number;
}

const useStyles = makeStyles(theme => ({
  propertiesWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  properties: {
    flexGrow: 1,
  },
  documents: {
    flexShrink: 0,
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(2),
      width: 470,
    },
  },
}));

export const PropertyInfo: FC<Props> = props => {
  const { userID, propertyId } = props;
  const [entry, setEntry] = useState<Entry>(new Property().toObject());
  const [user, setUser] = useState<User.AsObject>();
  const [loading, setLoading] = useState<boolean>(false);
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
  const [editMenuAnchorEl, setEditMenuAnchorEl] = useState<
    (EventTarget & HTMLElement) | null
  >(null);
  const [linksViewing, setLinksViewing] = useState<boolean>(false);
  const [changingOwner, setChangingOwner] = useState<boolean>(false);
  const [pendingChangeOwner, setPendingChangeOwner] = useState<UserEntry>();
  const [merging, setMerging] = useState<boolean>(false);
  const [pendingMerge, setPendingMerge] = useState<
    Entry & { __user: UserEntry }
  >();
  const classes = useStyles();

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
    const users = await loadUsersByIds([userID]);
    setUser(users[userID]);
    const req = new Property();
    req.setUserId(userID);
    req.setId(propertyId);
    try {
      const { resultsList, totalCount } = (
        await PropertyClientService.BatchGet(req)
      ).toObject();
      if (totalCount === 1) {
        const entry = resultsList[0];
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
    if (!entry.id) {
      load();
    }
    if (entry.notification !== '') {
      setNotificationViewing(true);
    }
  }, [entry, load, setNotificationViewing]);

  const handleSave = useCallback(
    async (data: Entry) => {
      setSaving(true);
      const req = new Property();
      req.setUserId(userID);
      req.setId(propertyId);
      const fieldMaskList = [];
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        //@ts-ignore
        req[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      req.setFieldMaskList(fieldMaskList);
      const entry = await PropertyClientService.Update(req);
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

  const handleDelete = useCallback(async () => {
    // TODO: delete customer related data + redirect somewhere?
    const entry = new Property();
    entry.setId(propertyId);
    await PropertyClientService.Delete(entry);
    setDeleting(false);
  }, [propertyId, setDeleting]);

  const handleChangeOwner = useCallback(async () => {
    if (pendingChangeOwner) {
      const { id } = pendingChangeOwner;
      setPendingChangeOwner(undefined);
      setError(false);
      const entry = new Property();
      entry.setId(propertyId);
      entry.setUserId(id);
      // entry.setFieldMaskList(['setUserId']);
      try {
        await PropertyClientService.Update(entry); // FIXME: for some reason this call fails
        document.location.href = [
          '/index.cfm?action=admin:properties.details',
          `property_id=${propertyId}`,
          `user_id=${id}`,
        ].join('&');
      } catch (e) {
        setError(true);
      }
    }
  }, [pendingChangeOwner, setPendingChangeOwner, setError, propertyId]);

  const handleMerge = useCallback(async () => {
    if (pendingMerge) {
      setPendingMerge(undefined);
      document.location.href = [
        '/index.cfm?action=admin:properties.mergeproperty',
        `oldPropertyId=${propertyId}`,
        `newPropertyId=${pendingMerge.id}`,
        `newOwnerId=${pendingMerge.__user.id}`,
      ].join('&');
    }
  }, [pendingMerge, setPendingMerge, propertyId]);

  const {
    firstname,
    lastname,
    businessname,
    phone,
    altphone,
    email,
    address,
    city,
    state: addressState,
    zip,
    subdivision,
    notes,
    notification,
  } = entry;
  if (!loading && entry.id === 0)
    return (
      <>
        <SectionBar title="Property Information">
          <InfoTable data={[]} />
        </SectionBar>
      </>
    );
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
    [
      {
        label: 'Address',
        value: `${address}, ${city}, ${addressState} ${zip}`,
      },
    ],
    [{ label: 'Subdivision', value: subdivision }],
    [{ label: 'Notes', value: notes }],
  ];
  return (
    <>
      <div className={classes.propertiesWrapper}>
        <div className={classes.properties}>
          <SectionBar
            title="Property Information"
            actions={[
              {
                label: 'Tasks',
                url: `/index.cfm?action=admin:tasks.list&code=properties&id=${propertyId}`,
              },
              {
                label: notification ? 'Notification' : 'Add Notification',
                onClick: notification
                  ? handleSetNotificationViewing(true)
                  : handleSetNotificationEditing(true),
              },
              {
                label: 'Change Property',
                onClick: ({ currentTarget }: React.MouseEvent<HTMLElement>) =>
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
                url: `/index.cfm?action=admin:customers.details&user_id=${userID}`,
              },
              {
                label: 'View Property Links',
                onClick: handleSetLinksViewing(true),
              },
            ]}
          >
            <InfoTable data={data} loading={loading} error={error} />
          </SectionBar>
          <ServiceItems {...props} />
        </div>
        <PropertyDocuments className={classes.documents} {...props} />
      </div>
      <ServiceCalls {...props} />
      <Modal open={editing} onClose={handleSetEditing(false)}>
        <Form<Entry>
          title="Edit Property Information"
          schema={SCHEMA_PROPERTY_INFORMATION}
          data={entry}
          onSave={handleSave}
          onClose={handleSetEditing(false)}
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
              ? 'Property Notification'
              : `${notification === '' ? 'Add' : 'Edit'} Property Notification`
          }
          schema={SCHEMA_PROPERTY_NOTIFICATION}
          data={entry}
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
            document.location.href = `/index.cfm?action=admin:report.activityproperty&property_id=${propertyId}`;
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
        name={`${firstname} ${lastname}`}
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
            {pendingChangeOwner.firstname} {pendingChangeOwner.lastname}
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
            {entry.address}, {entry.city}, {entry.state} {entry.zip}
          </strong>
          , under{' '}
          <strong>
            {user.businessname || `${user.firstname} ${user.lastname}`}
          </strong>
          , and merge it into{' '}
          <strong>
            {pendingMerge.address}, {pendingMerge.city}, {pendingMerge.state}{' '}
            {pendingMerge.zip}
          </strong>
          , under{' '}
          <strong>
            {pendingMerge.__user.businessname ||
              `${pendingMerge.__user.firstname} ${pendingMerge.__user.lastname}`}
          </strong>
          ?
        </Confirm>
      )}
    </>
  );
};
