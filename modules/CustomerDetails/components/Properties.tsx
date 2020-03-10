import React, { FC, useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { ENDPOINT, USA_STATES } from '../../../constants';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
// import { PropertyDocuments } from './PropertyDocuments';
import { getRPCFields, loadGeoLocationByAddress } from '../../../helpers';

const PropertyClientService = new PropertyClient(ENDPOINT);

type Entry = Property.AsObject;

const PROP_LEVEL = 'Used for property-level billing only';
const RESIDENTIAL = [
  { label: 'Residential', value: 1 },
  { label: 'Commercial', value: 0 },
];

const COLUMNS: Columns = [{ name: 'Address' }, { name: 'Neighborhood' }];

interface Props {
  userID: number;
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

export const Properties: FC<Props> = props => {
  const { userID } = props;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [formKey, setFormKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<Entry>();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<Entry>();
  const [pendingDelete, setPendingDelete] = useState<boolean>(false);
  const classes = useStyles();

  const handleSetEditing = useCallback(
    (editing?: Entry) => () => setEditing(editing),
    [setEditing],
  );

  const handleSetDeleting = useCallback(
    (deleting?: Entry) => () => {
      setDeleting(deleting);
      setPendingDelete(!!deleting);
    },
    [setDeleting, setPendingDelete],
  );

  const load = useCallback(async () => {
    setLoaded(false);
    setLoading(true);
    const req = new Property();
    req.setUserId(userID);
    try {
      const { resultsList, totalCount } = (
        await PropertyClientService.BatchGet(req)
      ).toObject();
      setEntries(resultsList);
      setLoading(false);
      setLoaded(true);
      return null;
    } catch (e) {
      setError(true);
    }
    setLoading(false);
  }, [setLoading, userID, setEntries, setError]);

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);

  const handleSave = useCallback(
    async (data: Entry) => {
      if (editing) {
        const isNew = editing.id === 0;
        setSaving(true);
        const req = new Property();
        req.setUserId(userID);
        if (!isNew) {
          req.setId(editing.id);
        }
        const fieldMaskList = [];
        for (const fieldName in data) {
          const { upperCaseProp, methodName } = getRPCFields(fieldName);
          //@ts-ignore
          req[methodName](data[fieldName]);
          fieldMaskList.push(upperCaseProp);
        }
        req.setFieldMaskList(fieldMaskList);
        await PropertyClientService[isNew ? 'Create' : 'Update'](req);
        setSaving(false);
        handleSetEditing()();
        load();
      }
    },
    [editing, setSaving, userID, handleSetEditing],
  );

  const handleDelete = useCallback(async () => {
    // TODO: delete customer related data + redirect somewhere?
    if (deleting) {
      const entry = new Property();
      entry.setId(deleting.id);
      await PropertyClientService.Delete(entry);
      handleSetDeleting()();
      load();
    }
  }, [deleting, handleSetDeleting]);

  const handleCheckLocation = useCallback(async () => {
    if (editing) {
      const { address, city, state: addressState, zip } = editing;
      const geo = await loadGeoLocationByAddress(
        `${address}, ${city}, ${addressState} ${zip}`,
      );
      if (geo) {
        setEditing({ ...editing, ...geo });
        setFormKey(formKey + 1);
      }
    }
  }, [editing, setEditing, formKey, setFormKey]);

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
    [
      {
        label: 'Location Details',
        headline: true,
        actions: [
          {
            label: 'Check Location',
            compact: true,
            onClick: handleCheckLocation,
            disabled: saving,
            variant: 'outlined',
            size: 'xsmall',
          },
        ],
      },
    ],
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

  const handleViewEntry = useCallback(
    (id: number) => () => {
      document.location.href = [
        '/index.cfm?action=admin:properties.details',
        `user_id=${userID}`,
        `property_id=${id}`,
      ].join('&');
    },
    [userID],
  );

  const data: Data = entries.map(entry => {
    const { id, address, city, state, zip, subdivision } = entry;
    return [
      { value: `${address}, ${city}, ${state} ${zip}` },
      {
        value: subdivision,
        actions: [
          <IconButton
            key={0}
            style={{ marginLeft: 4 }}
            size="small"
            onClick={handleViewEntry(id)}
          >
            <InfoIcon />
          </IconButton>,
          <IconButton
            key={1}
            style={{ marginLeft: 4 }}
            size="small"
            onClick={handleSetEditing(entry)}
          >
            <EditIcon />
          </IconButton>,
          <IconButton
            key={2}
            style={{ marginLeft: 4 }}
            size="small"
            onClick={handleSetDeleting(entry)}
          >
            <DeleteIcon />
          </IconButton>,
        ],
      },
    ];
  });

  return (
    <>
      <div className={classes.propertiesWrapper}>
        <div className={classes.properties}>
          <SectionBar
            title="Properties"
            actions={[
              {
                label: 'Add',
                onClick: handleSetEditing(new Property().toObject()),
              },
            ]}
          >
            <InfoTable
              columns={COLUMNS}
              data={data}
              loading={loading}
              error={error}
            />
          </SectionBar>
        </div>
        {/* <PropertyDocuments className={classes.documents} {...props} /> */}
      </div>
      {editing && (
        <Modal open onClose={handleSetEditing()}>
          <Form<Entry>
            key={formKey}
            title="Edit Property Information"
            schema={SCHEMA_PROPERTY_INFORMATION}
            data={editing}
            onSave={handleSave}
            onClose={handleSetEditing()}
            disabled={saving}
          />
        </Modal>
      )}
      {deleting && (
        <ConfirmDelete
          open={pendingDelete}
          onClose={handleSetDeleting()}
          onConfirm={handleDelete}
          kind="Property"
          name={`${deleting.address}`}
        />
      )}
    </>
  );
};
