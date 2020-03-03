import React, { FC, useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {
  ServiceItemClient,
  ServiceItem,
} from '@kalos-core/kalos-rpc/ServiceItem';
import { ReadingClient, Reading } from '@kalos-core/kalos-rpc/Reading';
import {
  MaintenanceQuestionClient,
  MaintenanceQuestion,
} from '@kalos-core/kalos-rpc/MaintenanceQuestion';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema, Options } from '../../ComponentsLibrary/Form';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { makeFakeRows, getRPCFields } from '../../../helpers';
import { ServiceItemLinks } from './ServiceItemLinks';
import { ServiceItemReadings } from './ServiceItemReadings';

const ServiceItemClientService = new ServiceItemClient(ENDPOINT);
const ReadingClientService = new ReadingClient(ENDPOINT);
const MaintenanceQuestionClientService = new MaintenanceQuestionClient(
  ENDPOINT,
);

type Entry = ServiceItem.AsObject;

const SYSTEM_READINGS_TYPE_OPTIONS: Options = [
  { label: 'Straight-cool AC w/ heatstrips', value: '1' },
  { label: 'Heat-pump AC', value: '2' },
  { label: 'Furnace (Straight-Cool)', value: '3' },
  { label: 'Gas Pool Heater', value: '4' },
  { label: 'Heat Pump Pool Heater', value: '5' },
  { label: 'Furnace (Heat-pump)', value: '6' },
  { label: 'Cooler', value: '7' },
  { label: 'Freezer', value: '8' },
  { label: 'AC w/ Reheat', value: '9' },
  { label: 'Other', value: '10' },
];

const SCHEMA: Schema<Entry> = [
  [
    { label: 'System Description', name: 'type', required: true },
    {
      label: 'System Type',
      name: 'systemReadingsTypeId',
      required: true,
      options: SYSTEM_READINGS_TYPE_OPTIONS,
    },
  ],
  [
    { label: 'Start Date', name: 'startDate' },
    { label: 'Item Location', name: 'location' },
  ],
  [{ label: '#1', headline: true }],
  [
    { label: 'Item', name: 'item' },
    { label: 'Brand', name: 'brand' },
    { label: 'Model #', name: 'model' },
    { label: 'Serial #', name: 'serial' },
  ],
  [{ label: '#2', headline: true }],
  [
    { label: 'Item', name: 'item2' },
    { label: 'Brand', name: 'brand2' },
    { label: 'Model #', name: 'model2' },
    { label: 'Serial #', name: 'serial2' },
  ],
  [{ label: '#3', headline: true }],
  [
    { label: 'Item', name: 'item3' },
    { label: 'Brand', name: 'brand3' },
    { label: 'Model #', name: 'model3' },
    { label: 'Serial #', name: 'serial3' },
  ],
  [{ label: 'Filter', headline: true }],
  [
    { label: 'Width', name: 'filterWidth' },
    { label: 'Length', name: 'filterLength' },
    { label: 'Thickness', name: 'filterThickness' },
    { label: 'Quantity', name: 'filterQty' },
  ],
  [
    { label: 'Part #', name: 'filterPartNumber' },
    { label: 'Vendor', name: 'filterVendor' },
  ],
  [{ label: 'Notes', headline: true }],
  [{ label: 'Additional Notes', name: 'notes', multiline: true }],
];

interface Props {
  className?: string;
  userID: number;
  loggedUserId: number;
  propertyId: number;
}

const sort = (a: Entry, b: Entry) => {
  if (a.sortOrder < b.sortOrder) return -1;
  if (a.sortOrder > b.sortOrder) return 1;
  return 0;
};

const useStyles = makeStyles(theme => ({
  form: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  readings: {
    [theme.breakpoints.up('md')]: {
      width: 500,
      marginLeft: theme.spacing(),
    },
  },
}));

export const ServiceItems: FC<Props> = props => {
  const { propertyId, className } = props;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [editing, setEditing] = useState<Entry>();
  const [deletingEntry, setDeletingEntry] = useState<Entry>();
  const [saving, setSaving] = useState<boolean>(false);
  const [linkId, setLinkId] = useState<number>();
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const classes = useStyles();

  const load = useCallback(async () => {
    setLoading(true);
    const entry = new ServiceItem();
    entry.setPropertyId(propertyId);
    try {
      const response = await ServiceItemClientService.BatchGet(entry);
      const { resultsList, totalCount: count } = response.toObject();
      setEntries(resultsList.sort(sort));
      setCount(count);
      setLoading(false);
      setLoaded(true);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  }, [setLoading, setEntries, setCount, setError, setLoaded]);

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);

  const handleSave = useCallback(
    async (data: Entry) => {
      if (editing) {
        setSaving(true);
        const entry = new ServiceItem();
        entry.setPropertyId(propertyId);
        const fieldMaskList = ['setPropertyId'];
        const isNew = !editing.id;
        if (!isNew) {
          entry.setId(editing.id);
        } else {
          const sortOrder = Math.max(
            entries[entries.length - 1].sortOrder + 1,
            entries.length,
          );
          entry.setSortOrder(sortOrder);
          fieldMaskList.push('setSortOrder');
        }
        for (const fieldName in data) {
          const { upperCaseProp, methodName } = getRPCFields(fieldName);
          // @ts-ignore
          entry[methodName](data[fieldName]);
          fieldMaskList.push(upperCaseProp);
        }
        entry.setFieldMaskList(fieldMaskList);
        await ServiceItemClientService[isNew ? 'Create' : 'Update'](entry);
        setSaving(false);
        setEditing(undefined);
        await load();
      }
    },
    [editing, setSaving, entries, setEditing, load],
  );

  const handleDelete = useCallback(async () => {
    // FIXME: service item is not actually deleted for some reason
    setDeletingEntry(undefined);
    if (deletingEntry) {
      setLoading(true);
      const reading = new Reading();
      reading.setServiceItemId(deletingEntry.id);
      const response = await ReadingClientService.BatchGet(reading);
      const readingIds = response.toObject().resultsList.map(({ id }) => id);
      await Promise.all(
        readingIds.map(async id => {
          const maintenanceQuestion = new MaintenanceQuestion();
          maintenanceQuestion.setReadingId(id);
          return await MaintenanceQuestionClientService.Delete(
            maintenanceQuestion,
          );
        }),
      );
      await Promise.all(
        readingIds.map(async id => {
          const reading = new Reading();
          reading.setId(id);
          return await ReadingClientService.Delete(reading);
        }),
      );
      const entry = new ServiceItem();
      entry.setId(deletingEntry.id);
      await ServiceItemClientService.Delete(entry);
      await load();
    }
  }, [setDeletingEntry, deletingEntry, setLoading, load]);

  const handleReorder = useCallback(
    (idx: number, step: number) => async () => {
      setLoading(true);
      const currentItem = entries[idx];
      const nextItem = entries[idx + step];
      const entry = new ServiceItem();
      entry.setFieldMaskList(['SortOrder']);
      entry.setId(currentItem.id);
      entry.setSortOrder(nextItem.sortOrder);
      await ServiceItemClientService.Update(entry);
      entry.setId(nextItem.id);
      entry.setSortOrder(currentItem.sortOrder);
      await ServiceItemClientService.Update(entry);
      await load();
    },
    [setLoading, entries, load],
  );

  const handleSetLinkId = useCallback(
    (linkId?: number) => () => setLinkId(linkId),
    [setLinkId],
  );

  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );

  const handleEditing = useCallback(
    (editing?: Entry) => () => setEditing(editing),
    [setEditing],
  );

  const setDeleting = useCallback(
    (deletingEntry?: Entry) => () => setDeletingEntry(deletingEntry),
    [setDeletingEntry],
  );

  const data: Data = loading
    ? makeFakeRows()
    : entries.map((entry, idx) => {
        const { id, type: value } = entry;
        return [
          {
            value: (
              <>
                <IconButton
                  style={{ marginRight: 4 }}
                  size="small"
                  disabled={idx === 0}
                  onClick={handleReorder(idx, -1)}
                >
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                  style={{ marginRight: 4 }}
                  size="small"
                  disabled={idx === entries.length - 1}
                  onClick={handleReorder(idx, 1)}
                >
                  <ArrowDownwardIcon />
                </IconButton>
                <span>{value}</span>
              </>
            ),
            actions: [
              <IconButton
                key={0}
                style={{ marginLeft: 4 }}
                size="small"
                onClick={handleSetLinkId(id)}
              >
                <LinkIcon />
              </IconButton>,
              <IconButton
                key={1}
                style={{ marginLeft: 4 }}
                size="small"
                onClick={handleEditing(entry)}
              >
                <EditIcon />
              </IconButton>,
              <IconButton
                key={2}
                style={{ marginLeft: 4 }}
                size="small"
                onClick={setDeleting(entry)}
              >
                <DeleteIcon />
              </IconButton>,
            ],
          },
        ];
      });
  return (
    <div className={className}>
      <SectionBar
        title="Service Items"
        actions={[
          {
            label: 'Add Service Item',
            onClick: handleEditing({} as Entry),
          },
        ]}
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handleChangePage,
        }}
      >
        <InfoTable
          data={data}
          loading={loading}
          error={error}
          compact
          hoverable
        />
      </SectionBar>
      {linkId && (
        <Modal open onClose={handleSetLinkId(undefined)}>
          <ServiceItemLinks
            kind="Service Item Link"
            title={`: ${entries.find(({ id }) => id === linkId)?.type}`}
            serviceItemId={linkId}
            onClose={handleSetLinkId(undefined)}
          />
        </Modal>
      )}
      {editing && (
        <Modal open onClose={handleEditing()} compact>
          <div className={classes.form}>
            <Form<Entry>
              title={`${editing.id ? 'Edit' : 'Add'} Service Item`}
              schema={SCHEMA}
              data={editing}
              onSave={handleSave}
              onClose={handleEditing()}
              disabled={saving}
            />
            {editing.id && (
              <div className={classes.readings}>
                <ServiceItemReadings {...props} serviceItemId={editing.id} />
              </div>
            )}
          </div>
        </Modal>
      )}
      {deletingEntry && (
        <ConfirmDelete
          open
          onClose={setDeleting()}
          onConfirm={handleDelete}
          kind="Service Item"
          name={deletingEntry.type}
        />
      )}
    </div>
  );
};
