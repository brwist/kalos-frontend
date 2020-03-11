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
import { MaterialClient, Material } from '@kalos-core/kalos-rpc/Material';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema, Options } from '../../ComponentsLibrary/Form';
import { PlainForm } from '../../ComponentsLibrary/PlainForm';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { makeFakeRows, getRPCFields } from '../../../helpers';
import { ServiceItemLinks } from './ServiceItemLinks';
import { ServiceItemReadings } from './ServiceItemReadings';

const ServiceItemClientService = new ServiceItemClient(ENDPOINT);
const ReadingClientService = new ReadingClient(ENDPOINT);
const MaintenanceQuestionClientService = new MaintenanceQuestionClient(
  ENDPOINT,
);
const MaterialClientService = new MaterialClient(ENDPOINT);

type Entry = ServiceItem.AsObject;
type MaterialType = Material.AsObject;

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

const MATERIAL_SCHEMA: Schema<MaterialType> = [
  [
    { label: 'Name', name: 'name' },
    { label: 'Quantity', name: 'quantity' },
    { label: 'Part #', name: 'partNumber' },
    { label: 'Vendor', name: 'vendor' },
    { name: 'id', type: 'hidden' },
  ],
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
  modal: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  form: {
    flexGrow: 1,
  },
  readings: {
    [theme.breakpoints.up('md')]: {
      width: 500,
      height: '100vh',
      marginLeft: theme.spacing(),
      overflowY: 'auto',
    },
  },
  noMaterials: {
    ...theme.typography.body1,
    padding: theme.spacing(2),
    margin: 0,
    marginBottom: theme.spacing(3),
  },
  loadingMaterials: {
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    marginBottom: theme.spacing(3),
  },
}));

export const ServiceItems: FC<Props> = props => {
  const { propertyId, className } = props;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const [materialsIds, setMaterialsIds] = useState<number[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState<boolean>(false);
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

  const handleMaterialChange = useCallback(
    (idx: number) => (data: MaterialType) => {
      const newMaterials = [...materials];
      newMaterials[idx] = data;
      setMaterials(newMaterials);
    },
    [materials, setMaterials],
  );

  const handleAddMaterial = useCallback(() => {
    const newMaterial = new Material();
    newMaterial.setId(Date.now());
    const newMaterials = [...materials, newMaterial.toObject()];
    setMaterials(newMaterials);
  }, [materials, setMaterials]);

  const handleRemoveMaterial = useCallback(
    (idx: number) => () => {
      setMaterials(materials.filter((_, idy) => idx !== idy));
    },
    [materials, setMaterials],
  );

  const MATERIALS_SCHEMA = materials
    .map(
      (_, idx): Schema<Entry> => [
        [
          {
            label: `#${idx + 1}`,
            headline: true,
            actions: [
              {
                label: 'Remove',
                variant: 'outlined',
                onClick: handleRemoveMaterial(idx),
                compact: true,
                size: 'xsmall',
                disabled: saving,
              },
            ],
          },
        ],
        [
          {
            content: (
              <PlainForm<MaterialType>
                key={materials[idx].id}
                schema={MATERIAL_SCHEMA}
                data={materials[idx]}
                onChange={handleMaterialChange(idx)}
                disabled={saving}
              />
            ),
          },
        ],
      ],
    )
    .reduce((aggr, item) => [...aggr, ...item], []);

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
    [
      {
        label: 'Materials',
        headline: true,
        actions: [
          {
            label: 'Add',
            size: 'xsmall',
            variant: 'outlined',
            compact: true,
            onClick: handleAddMaterial,
            disabled: saving,
          },
        ],
      },
    ],
    ...(loadingMaterials
      ? [
          [
            {
              content: (
                <InfoTable
                  className={classes.loadingMaterials}
                  data={makeFakeRows(4, 1)}
                  loading
                />
              ),
            },
          ],
        ]
      : MATERIALS_SCHEMA.length === 0
      ? [[{ content: <div className={classes.noMaterials}>No materials</div> }]]
      : MATERIALS_SCHEMA),
    [{ label: 'Notes', headline: true }],
    [{ label: 'Additional Notes', name: 'notes', multiline: true }],
  ];

  const load = useCallback(async () => {
    setLoading(true);
    const entry = new ServiceItem();
    entry.setPropertyId(propertyId);
    entry.setPageNumber(page);
    entry.setIsActive(1);
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
  }, [setLoading, setEntries, setCount, setError, setLoaded, page]);

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);

  const handleMaterials = async (
    materials: MaterialType[],
    materialsIds: number[],
    serviceItemId: number,
  ) => {
    const formFields = MATERIAL_SCHEMA[0].map(({ name }) => name as string);
    const ids = materials.map(({ id }) => id);
    await Promise.all(
      materialsIds
        .filter(id => !ids.includes(id))
        .map(async id => {
          const entry = new Material();
          entry.setId(id);
          return await MaterialClientService.Delete(entry);
        }),
    );
    const operations: {
      operation: 'Create' | 'Update';
      entry: Material;
    }[] = [];
    for (let i = 0; i < materials.length; i += 1) {
      const entry = new Material();
      entry.setServiceItemId(serviceItemId);
      const fieldMaskList = ['ServiceItemId'];
      for (const fieldName in materials[i]) {
        if (!fieldName || fieldName === 'id' || !formFields.includes(fieldName))
          continue;
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        entry[methodName](materials[i][fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      entry.setFieldMaskList(fieldMaskList);
      if (materialsIds.includes(materials[i].id)) {
        entry.setId(materials[i].id);
        operations.push({ operation: 'Update', entry });
      } else {
        operations.push({ operation: 'Create', entry });
      }
    }
    await Promise.all(
      operations.map(
        async ({ operation, entry }) =>
          await MaterialClientService[operation](entry),
      ),
    );
  };

  const handleSave = useCallback(
    async (data: Entry) => {
      if (editing) {
        setSaving(true);
        const entry = new ServiceItem();
        entry.setPropertyId(propertyId);
        const fieldMaskList = ['PropertyId'];
        const isNew = !editing.id;
        if (!isNew) {
          entry.setId(editing.id);
        } else {
          const sortOrder = Math.max(
            entries[entries.length - 1].sortOrder + 1,
            entries.length,
          );
          entry.setSortOrder(sortOrder);
          fieldMaskList.push('SortOrder');
        }
        for (const fieldName in data) {
          const { upperCaseProp, methodName } = getRPCFields(fieldName);
          // @ts-ignore
          entry[methodName](data[fieldName]);
          fieldMaskList.push(upperCaseProp);
        }
        entry.setFieldMaskList(fieldMaskList);
        const { id } = await ServiceItemClientService[
          isNew ? 'Create' : 'Update'
        ](entry);
        await handleMaterials(materials, materialsIds, id);
        setSaving(false);
        setEditing(undefined);
        await load();
      }
    },
    [editing, setSaving, entries, setEditing, load, materials, materialsIds],
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
    (editing?: Entry) => async () => {
      setEditing(editing);
      if (editing && editing.id) {
        const entry = new Material();
        entry.setServiceItemId(editing.id);
        setLoadingMaterials(true);
        const { resultsList } = (
          await MaterialClientService.BatchGet(entry)
        ).toObject();
        setMaterials(resultsList);
        setMaterialsIds(resultsList.map(({ id }) => id));
        setLoadingMaterials(false);
      } else {
        setMaterials([]);
        setMaterialsIds([]);
      }
    },
    [setEditing, setMaterials],
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
            label: 'Add',
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
            title={entries.find(({ id }) => id === linkId)?.type}
            serviceItemId={linkId}
            onClose={handleSetLinkId(undefined)}
          />
        </Modal>
      )}
      {editing && (
        <Modal open onClose={handleEditing()} fullScreen>
          <div className={classes.modal}>
            <Form<Entry>
              title={`${editing.id ? 'Edit' : 'Add'} Service Item`}
              schema={SCHEMA}
              data={editing}
              onSave={handleSave}
              onClose={handleEditing()}
              disabled={saving}
              className={classes.form}
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
