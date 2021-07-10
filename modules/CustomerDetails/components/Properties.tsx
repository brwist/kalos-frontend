import React, { FC, useCallback, useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import { Property, getPropertyAddress } from '@kalos-core/kalos-rpc/Property';
import {
  USA_STATES_OPTIONS,
  RESIDENTIAL_OPTIONS,
  ROWS_PER_PAGE,
} from '../../../constants';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { PlainForm } from '../../ComponentsLibrary/PlainForm';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import {
  PropertyType,
  loadPropertiesByFilter,
  PropertiesFilter,
  PropertyClientService,
  getCFAppUrl,
  MapClientService,
} from '../../../helpers';
import './properties.less';
import { MapServiceClient } from '@kalos-core/kalos-rpc/compiled-protos/kalosmaps_pb_service';
import { MapClient } from '@kalos-core/kalos-rpc/Maps';

const PROP_LEVEL = 'Used for property-level billing only';

const COLUMNS: Columns = [
  { name: 'Address' },
  { name: 'Neighborhood' },
  { name: 'City, State' },
  { name: 'Zip' },
];

interface Props {
  userID: number;
}

export const Properties: FC<Props> = props => {
  const { userID } = props;
  const [entries, setEntries] = useState<PropertyType[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<PropertiesFilter>({});
  const [loaded, setLoaded] = useState<boolean>(false);
  const [formKey, setFormKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<PropertyType>();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<PropertyType>();
  const [pendingDelete, setPendingDelete] = useState<boolean>(false);

  const handleSetEditing = useCallback(
    (editing?: PropertyType) => () => setEditing(editing),
    [setEditing],
  );

  const handleSetDeleting = useCallback(
    (deleting?: PropertyType) => () => {
      setDeleting(deleting);
      setPendingDelete(!!deleting);
    },
    [setDeleting, setPendingDelete],
  );

  const load = useCallback(async () => {
    setLoaded(false);
    setLoading(true);
    try {
      const { results, totalCount } = await loadPropertiesByFilter({
        page,
        filter: {
          ...filter,
          userId: userID,
        },
        sort: {
          orderBy: 'property_address',
          orderByField: 'address',
          orderDir: 'ASC',
        },
      });
      setEntries(results);
      setCount(totalCount);
      setLoading(false);
      setLoaded(true);
      return null;
    } catch (e) {
      setError(true);
    }
    setLoading(false);
  }, [setLoading, userID, setEntries, setError, setCount, page, filter]);

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);

  const handleSave = useCallback(
    async (data: PropertyType) => {
      if (editing) {
        setSaving(true);
        const { address, city, state: addressState, zip } = data;
        const geo = await MapClientService.loadGeoLocationByAddress(
          `${address}, ${city}, ${addressState} ${zip}`,
        );
        if (geo) {
          data.geolocationLat = geo.geolocationLat;
          data.geolocationLng = geo.geolocationLng;
        }
        await PropertyClientService.saveProperty(
          data,
          userID,
          editing.id === 0 ? undefined : editing.id,
        );
        setSaving(false);
        handleSetEditing()();
        load();
      }
    },
    [editing, userID, handleSetEditing, load],
  );

  const handleDelete = useCallback(async () => {
    if (deleting) {
      await PropertyClientService.deletePropertyById(deleting.id);
      handleSetDeleting()();
      load();
    }
  }, [deleting, handleSetDeleting, load]);

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

  const handleViewEntry = useCallback(
    (id: number, altUserId: number) => () => {
      window.open(
        [
          getCFAppUrl('admin:properties.details'),
          `user_id=${altUserId}`,
          `property_id=${id}`,
        ].join('&'),
      );
    },
    [],
  );

  const handlePageChange = useCallback(
    page => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );

  const handleSearch = useCallback(() => {
    setPage(0);
    setLoaded(false);
  }, [setPage, setLoaded]);

  const SCHEMA_PROPERTY_INFORMATION: Schema<PropertyType> = [
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
      {
        label: 'State',
        name: 'state',
        options: USA_STATES_OPTIONS,
        required: true,
      },
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
      { label: 'Zoning', name: 'isResidential', options: RESIDENTIAL_OPTIONS },
      { label: 'Latitude', name: 'geolocationLat', type: 'number' },
      { label: 'Longitude', name: 'geolocationLng', type: 'number' },
    ],
    [{ label: 'Notes', headline: true }],
    [{ label: 'Notes', name: 'notes', multiline: true }],
  ];

  const SCHEMA_FILTER: Schema<PropertiesFilter> = [
    [
      { name: 'address', label: 'Address', type: 'search' },
      { name: 'subdivision', label: 'Neighborhood', type: 'search' },
      { name: 'city', label: 'City', type: 'search' },
      { name: 'state', label: 'State', type: 'search' },
      {
        name: 'zip',
        label: 'Zip',
        type: 'search',
        actions: [{ label: 'Search', onClick: handleSearch }],
      },
    ],
  ];

  const data: Data = entries.map(entry => {
    const { id, address, city, state, zip, subdivision } = entry;
    return [
      {
        value: address,
        onClick: handleViewEntry(id, entry.userId),
      },
      {
        value: subdivision,
        onClick: handleViewEntry(id, entry.userId),
      },
      {
        value: `${city}, ${state}`,
        onClick: handleViewEntry(id, entry.userId),
      },
      {
        value: zip,
        onClick: handleViewEntry(id, entry.userId),
        actions: [
          <IconButton
            key="view"
            size="small"
            onClick={handleViewEntry(id, entry.userId)}
          >
            <InfoIcon />
          </IconButton>,
          <IconButton key="edit" size="small" onClick={handleSetEditing(entry)}>
            <EditIcon />
          </IconButton>,
          <IconButton
            key="delete"
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
      <div className="PropertiesWrapper">
        <div className="PropertiesProperties">
          <SectionBar
            title="Properties"
            actions={[
              {
                label: 'Add',
                onClick: handleSetEditing(new Property().toObject()),
              },
            ]}
            pagination={{
              count,
              onPageChange: handlePageChange,
              page,
              rowsPerPage: ROWS_PER_PAGE,
            }}
          >
            <PlainForm
              data={filter}
              schema={SCHEMA_FILTER}
              onChange={setFilter}
            />
            <InfoTable
              columns={COLUMNS}
              data={data}
              loading={loading}
              error={error}
            />
          </SectionBar>
        </div>
      </div>
      {editing && (
        <Modal open onClose={handleSetEditing()}>
          <Form<PropertyType>
            key={formKey}
            title={`${editing.id === 0 ? 'Add' : 'Edit'} Property Information`}
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
          name={getPropertyAddress(deleting)}
        />
      )}
    </>
  );
};
