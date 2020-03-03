import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { ENDPOINT, USA_STATES } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ServiceItemLinks } from './ServiceItemLinks';
import { getRPCFields } from '../../../helpers';

type Entry = Property.AsObject;

interface Props {
  userID: number;
  propertyId: number;
}

interface State {
  entry: Entry;
  editing: boolean;
  saving: boolean;
  error: boolean;
  notificationEditing: boolean;
  notificationViewing: boolean;
  editMenuAnchorEl: (EventTarget & HTMLElement) | null;
  linksViewing: boolean;
}

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

export class PropertyInfo extends React.PureComponent<Props, State> {
  PropertyClient: PropertyClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      entry: new Property().toObject(),
      editing: false,
      saving: false,
      error: false,
      notificationEditing: false,
      notificationViewing: false,
      editMenuAnchorEl: null,
      linksViewing: false,
    };
    this.PropertyClient = new PropertyClient(ENDPOINT);
  }

  handleSetEditing = (editing: boolean) => () => this.setState({ editing });

  handleSetNotificationEditing = (notificationEditing: boolean) => () =>
    this.setState({ notificationEditing });

  handleSetNotificationViewing = (notificationViewing: boolean) => () =>
    this.setState({ notificationViewing });

  handleSetEditEditMenuAnchorEl = (
    editMenuAnchorEl: (EventTarget & HTMLElement) | null,
  ) => this.setState({ editMenuAnchorEl });

  handleSetLinksViewing = (linksViewing: boolean) => () =>
    this.setState({ linksViewing });

  loadEntry = async () => {
    const { userID, propertyId } = this.props;
    const req = new Property();
    req.setUserId(userID);
    req.setId(propertyId);
    const response = await this.PropertyClient.BatchGet(req);
    const entry = response.toObject().resultsList[0];
    if (entry) {
      this.setState({ entry });
    } else {
      this.setState({ error: true });
    }
    return entry;
  };

  async componentDidMount() {
    const entry = await this.loadEntry();
    if (entry.notification !== '') {
      this.setState({ notificationViewing: true });
    }
  }

  handleSave = async (data: Entry) => {
    const { propertyId, userID } = this.props;
    this.setState({ saving: true });
    const req = new Property();
    req.setId(propertyId);
    req.setUserId(userID);
    const fieldMaskList = [];
    for (const fieldName in data) {
      const { upperCaseProp, methodName } = getRPCFields(fieldName);
      //@ts-ignore
      req[methodName](data[fieldName]);
      fieldMaskList.push(upperCaseProp);
    }
    req.setFieldMaskList(fieldMaskList);
    const entry = await this.PropertyClient.Update(req);
    this.setState({
      entry,
      saving: false,
    });
    this.handleSetEditing(false)();
    this.handleSetNotificationEditing(false)();
  };

  render() {
    const {
      props,
      state,
      handleSave,
      handleSetEditing,
      handleSetNotificationEditing,
      handleSetNotificationViewing,
      handleSetEditEditMenuAnchorEl,
      handleSetLinksViewing,
    } = this;
    const { userID, propertyId } = props;
    const {
      entry,
      editing,
      saving,
      error,
      notificationEditing,
      notificationViewing,
      editMenuAnchorEl,
      linksViewing,
    } = state;
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
      state: addressState,
      zip,
      subdivision,
      notes,
      notification,
    } = entry;
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
            },
            {
              label: 'Merge Property',
              desktop: false,
            },
            {
              label: 'Change Owner',
              desktop: false,
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
          <InfoTable data={data} loading={id === 0} error={error} />
        </SectionBar>
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
                : `${
                    notification === '' ? 'Add' : 'Edit'
                  } Property Notification`
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
              // TODO implement delete property with confirmation
            }}
          >
            Delete Property
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleSetEditEditMenuAnchorEl(null);
              // TODO implement merge property
            }}
          >
            Merge Property
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleSetEditEditMenuAnchorEl(null);
              // TODO implement change owner
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
      </>
    );
  }
}
