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
  loadPropertiesByFilter,
  PropertiesFilter,
  PropertyClientService,
  getCFAppUrl,
  MapClientService,
  PropertiesSort,
  makeSafeFormObject,
} from '../../../helpers';
import './properties.less';

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
  const [entries, setEntries] = useState<Property[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<PropertiesFilter>({});
  const [loaded, setLoaded] = useState<boolean>(false);
  const [formKey, setFormKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<Property>();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<Property>();
  const [pendingDelete, setPendingDelete] = useState<boolean>(false);

  const handleSetEditing = useCallback(
    (editing?: Property) => () => setEditing(editing),
    [setEditing],
  );

  const handleSetDeleting = useCallback(
    (deleting?: Property) => () => {
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
          orderByField: 'getAddress',
          orderDir: 'ASC',
        } as PropertiesSort,
        req: new Property(),
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
    async (data: Property) => {
      if (editing) {
        setSaving(true);
        const geo = await MapClientService.loadGeoLocationByAddress(
          `${data.getAddress()}, ${data.getCity()}, ${data.getState()} ${data.getZip()}`,
        );
        if (geo) {
          data.setGeolocationLat(geo.geolocationLat);
          data.setGeolocationLng(geo.geolocationLng);
        }
        await PropertyClientService.saveProperty(
          data,
          userID,
          editing.getId() === 0 ? undefined : editing.getId(),
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
      await PropertyClientService.deletePropertyById(deleting.getId());
      handleSetDeleting()();
      load();
    }
  }, [deleting, handleSetDeleting, load]);

  const handleCheckLocation = useCallback(async () => {
    if (editing) {
      const geo = await MapClientService.loadGeoLocationByAddress(
        `${editing.getAddress()}, ${editing.getCity()}, ${editing.getState()} ${editing.getZip()}`,
      );
      if (geo) {
        setEditing(editing);
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

  const SCHEMA_PROPERTY_INFORMATION: Schema<Property> = [
    [{ label: 'Personal Details', headline: true, description: PROP_LEVEL }],
    [
      { label: 'First Name', name: 'getFirstname' },
      { label: 'Last Name', name: 'getLastname' },
      { label: 'Business Name', name: 'getBusinessname' },
    ],
    [{ label: 'Contact Details', headline: true, description: PROP_LEVEL }],
    [
      { label: 'Primary Phone', name: 'getPhone' },
      { label: 'Alternate Phone', name: 'getAltphone' },
      { label: 'Email', name: 'getEmail' },
    ],
    [{ label: 'Address Details', headline: true }],
    [
      { label: 'Address', name: 'getAddress', required: true, multiline: true },
      { label: 'City', name: 'getCity', required: true },
      {
        label: 'State',
        name: 'getState',
        options: USA_STATES_OPTIONS,
        required: true,
      },
      { label: 'Zip Code', name: 'getZip', required: true },
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
      { label: 'Directions', name: 'getDirections', multiline: true },
      { label: 'Subdivision', name: 'getSubdivision' },
    ],
    [
      {
        label: 'Zoning',
        name: 'getIsResidential',
        options: RESIDENTIAL_OPTIONS,
      },
      { label: 'Latitude', name: 'getGeolocationLat', type: 'number' },
      { label: 'Longitude', name: 'getGeolocationLng', type: 'number' },
    ],
    [{ label: 'Notes', headline: true }],
    [{ label: 'Notes', name: 'getNotes', multiline: true }],
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
    return [
      {
        value: entry.getAddress(),
        onClick: handleViewEntry(entry.getId(), entry.getUserId()),
      },
      {
        value: entry.getSubdivision(),
        onClick: handleViewEntry(entry.getId(), entry.getUserId()),
      },
      {
        value: `${entry.getCity()}, ${entry.getState()}`,
        onClick: handleViewEntry(entry.getId(), entry.getUserId()),
      },
      {
        value: entry.getZip(),
        onClick: handleViewEntry(entry.getId(), entry.getUserId()),
        actions: [
          <IconButton
            key="view"
            size="small"
            onClick={handleViewEntry(entry.getId(), entry.getUserId())}
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
                onClick: handleSetEditing(new Property()),
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
          <Form<Property>
            key={formKey}
            title={`${
              editing.getId() === 0 ? 'Add' : 'Edit'
            } Property Information`}
            schema={SCHEMA_PROPERTY_INFORMATION}
            data={editing}
            onSave={saved => {
              handleSave(makeSafeFormObject(saved, new Property()));
            }}
            onClose={() => handleSetEditing()}
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
