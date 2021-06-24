import React, { FC, useState, useCallback, useEffect, ReactNode } from 'react';
import uniqueId from 'lodash/uniqueId';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
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
import { InfoTable, Data } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import { Modal } from '../Modal';
import { Field } from '../Field';
import { ActionsProps } from '../Actions';
import { Form, Schema, Options } from '../Form';
import { PlainForm } from '../PlainForm';
import { ConfirmDelete } from '../ConfirmDelete';
import {
  makeFakeRows,
  getRPCFields,
  makeSafeFormObject,
} from '../../../helpers';
import { ServiceItemLinks } from '../ServiceItemLinks';
import { ServiceItemReadings } from '../ServiceItemReadings';
import './styles.less';

const ServiceItemClientService = new ServiceItemClient(ENDPOINT);
const ReadingClientService = new ReadingClient(ENDPOINT);
const MaintenanceQuestionClientService = new MaintenanceQuestionClient(
  ENDPOINT,
);
const MaterialClientService = new MaterialClient(ENDPOINT);

export type Entry = ServiceItem;

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

const MATERIAL_SCHEMA: Schema<Material> = [
  [
    { label: 'Name', name: 'getName' },
    { label: 'Quantity', name: 'getQuantity' },
    { label: 'Part #', name: 'getPartNumber' },
    { label: 'Vendor', name: 'getVendor' },
    { name: 'getId', type: 'hidden' },
  ],
];

export type Repair = {
  id: string;
  serviceItemId: number;
  diagnosis: string;
  description: string;
  price: number;
};

interface Props {
  className?: string;
  userID: number;
  loggedUserId: number;
  propertyId: number;
  title?: string;
  loading?: boolean;
  selectable?: boolean;
  onSelect?: (entries: Entry[]) => void;
  selected?: Entry[];
  repair?: boolean;
  disableRepair?: boolean;
  repairs?: Repair[];
  onRepairsChange?: (repairs: Repair[]) => void;
  actions?: ActionsProps;
  asideContent?: ReactNode;
  viewedAsCustomer?: boolean;
}

const REPAIR_SCHEMA: Schema<Repair> = [
  [
    { name: 'diagnosis', label: 'Diagnosis' },
    { name: 'description', label: 'Description', multiline: true },
    { name: 'price', label: 'Price', type: 'number', startAdornment: '$' },
  ],
];

const sort = (a: Entry, b: Entry) => {
  if (a.getSortOrder() < b.getSortOrder()) return -1;
  if (a.getSortOrder() > b.getSortOrder()) return 1;
  return 0;
};

export const ServiceItems: FC<Props> = props => {
  const {
    propertyId,
    className,
    title = 'Service Items',
    selectable,
    onSelect,
    selected: selectedInitial,
    repair,
    disableRepair = false,
    repairs: repairsInitial = [],
    onRepairsChange,
    children,
    loading: loadingProp = false,
    actions = [],
    asideContent,
    viewedAsCustomer = false,
  } = props;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>(repairsInitial);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialsIds, setMaterialsIds] = useState<number[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [editing, setEditing] = useState<ServiceItem>();
  const [deletingEntry, setDeletingEntry] = useState<ServiceItem>();
  const [saving, setSaving] = useState<boolean>(false);
  const [linkId, setLinkId] = useState<number>();
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [selected, setSelected] = useState<ServiceItem[]>(
    selectedInitial || [],
  );

  const handleMaterialChange = useCallback(
    (idx: number) => (data: Material) => {
      const temp = makeSafeFormObject(data, new Material());
      console.log(temp);
      const newMaterials = [...materials];
      newMaterials[idx] = temp;
      setMaterials(newMaterials);
    },
    [materials, setMaterials],
  );

  const handleAddMaterial = useCallback(() => {
    const newMaterial = new Material();
    newMaterial.setId(Date.now());
    const newMaterials = [...materials, newMaterial];
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
            actions: viewedAsCustomer
              ? undefined
              : [
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
              <PlainForm<Material>
                key={materials[idx].getId()}
                schema={MATERIAL_SCHEMA}
                data={materials[idx]}
                onChange={handleMaterialChange(idx)}
                disabled={saving}
                readOnly={viewedAsCustomer}
              />
            ),
          },
        ],
      ],
    )
    .reduce((aggr, item) => [...aggr, ...item], []);

  const SCHEMA: Schema<ServiceItem> = [
    [
      { label: 'System Description', name: 'getType', required: true },
      {
        label: 'System Type',
        name: 'getSystemReadingsTypeId',
        required: true,
        options: SYSTEM_READINGS_TYPE_OPTIONS,
      },
    ],
    [
      { label: 'Start Date', name: 'getStartDate' },
      { label: 'Item Location', name: 'getLocation' },
    ],
    [{ label: '#1', headline: true }],
    [
      { label: 'Item', name: 'getItem' },
      { label: 'Brand', name: 'getBrand' },
      { label: 'Model #', name: 'getModel' },
      { label: 'Serial #', name: 'getSerial' },
    ],
    [{ label: '#2', headline: true }],
    [
      { label: 'Item', name: 'getItem2' },
      { label: 'Brand', name: 'getBrand2' },
      { label: 'Model #', name: 'getModel2' },
      { label: 'Serial #', name: 'getSerial2' },
    ],
    [{ label: '#3', headline: true }],
    [
      { label: 'Item', name: 'getItem3' },
      { label: 'Brand', name: 'getBrand3' },
      { label: 'Model #', name: 'getModel3' },
      { label: 'Serial #', name: 'getSerial3' },
    ],
    [{ label: 'Filter', headline: true }],
    [
      { label: 'Width', name: 'getFilterWidth' },
      { label: 'Length', name: 'getFilterLength' },
      { label: 'Thickness', name: 'getFilterThickness' },
      { label: 'Quantity', name: 'getFilterQty' },
    ],
    [
      { label: 'Part #', name: 'getFilterPartNumber' },
      { label: 'Vendor', name: 'getFilterVendor' },
    ],
    [
      {
        label: 'Materials',
        headline: true,
        actions: viewedAsCustomer
          ? undefined
          : [
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
                  className="ServiceItemsLoadingMaterials"
                  data={makeFakeRows(4, 1)}
                  loading
                />
              ),
            },
          ],
        ]
      : MATERIALS_SCHEMA.length === 0
      ? [
          [
            {
              content: (
                <InfoTable className="ServiceItemsNoMaterials" data={[]} />
              ),
            },
          ],
        ]
      : MATERIALS_SCHEMA),
    [{ label: 'Notes', headline: true }],
    [{ label: 'Additional Notes', name: 'getNotes', multiline: true }],
  ];

  const load = useCallback(async () => {
    setLoading(true);
    const entry = new ServiceItem();
    entry.setPropertyId(propertyId);
    entry.setPageNumber(page);
    entry.setIsActive(1);
    try {
      const response = await ServiceItemClientService.BatchGet(entry);
      const resultsList = response.getResultsList();
      const count = response.getTotalCount();
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
    materials: Material[],
    materialsIds: number[],
    serviceItemId: number,
  ) => {
    console.log('we called handle material');
    const ids = materials.map(id => id.getId());
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
      let entry = materials[i];
      entry.setServiceItemId(serviceItemId);
      if (materialsIds.includes(materials[i].getId())) {
        entry.setId(materials[i].getId());
        operations.push({ operation: 'Update', entry });
      } else {
        operations.push({ operation: 'Create', entry });
      }
    }
    for (let i = 0; i < operations.length; i++) {
      if (operations[i].operation == 'Create') {
        await MaterialClientService.Create(operations[i].entry);
      } else {
        await MaterialClientService.Update(operations[i].entry);
      }
    }
  };

  const handleSave = useCallback(
    async (data: ServiceItem) => {
      if (editing) {
        setSaving(true);
        console.log(editing);

        //onst entry = editing;

        let entry = makeSafeFormObject(data, new ServiceItem());
        if (typeof entry.getBrand() === 'function') {
          //for some reason, if the form value hasn't changed,it throws an
          //error, this prevents the error
          entry = editing;
        }
        entry.setPropertyId(propertyId);
        const isNew = !editing.getId();
        if (!isNew) {
          entry.setId(editing.getId());
        } else {
          const sortOrder = Math.max(
            entries[entries.length - 1].getSortOrder() + 1,
            entries.length,
          );
          entry.setSortOrder(sortOrder);
          entry.addFieldMask('SortOrder');
        }
        console.log(entry);
        const id = await ServiceItemClientService[isNew ? 'Create' : 'Update'](
          entry,
        );
        await handleMaterials(materials, materialsIds, id.getId());
        setSaving(false);
        setEditing(undefined);
        await load();
      }
    },
    [
      editing,
      setSaving,
      propertyId,
      entries,
      setEditing,
      load,
      materials,
      materialsIds,
    ],
  );

  const handleDelete = useCallback(async () => {
    setDeletingEntry(undefined);
    if (deletingEntry) {
      setLoading(true);
      const reading = new Reading();
      reading.setServiceItemId(deletingEntry.getId());
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
      const newRepairs = repairs.filter(
        ({ serviceItemId }) => serviceItemId !== deletingEntry.getId(),
      );
      setRepairs(newRepairs);
      if (onRepairsChange) {
        onRepairsChange(newRepairs);
      }
      const entry = new ServiceItem();
      entry.setId(deletingEntry.getId());
      await ServiceItemClientService.Delete(entry);
      await load();
    }
  }, [
    setDeletingEntry,
    deletingEntry,
    setLoading,
    load,
    repairs,
    setRepairs,
    onRepairsChange,
  ]);

  const handleSelectedChange = useCallback(
    (entry: Entry) => () => {
      const newSelected: Entry[] = [
        ...selected.filter(item => item.getId() !== entry.getId()),
      ];
      const isSelected = selected.find(item => item.getId() === entry.getId());
      if (!isSelected) {
        newSelected.push(entry);
      }
      setSelected(newSelected);
      if (onSelect) {
        onSelect(newSelected);
      }
    },
    [setSelected, selected, onSelect],
  );

  const handleReorder = useCallback(
    (idx: number, step: number) => async () => {
      setLoading(true);
      const currentItem = entries[idx];
      const nextItem = entries[idx + step];
      const entry = new ServiceItem();
      entry.setFieldMaskList(['SortOrder']);
      entry.setId(currentItem.getId());
      entry.setSortOrder(nextItem.getSortOrder());
      await ServiceItemClientService.Update(entry);
      entry.setId(nextItem.getId());
      entry.setSortOrder(currentItem.getSortOrder());
      await ServiceItemClientService.Update(entry);
      await load();
    },
    [setLoading, entries, load],
  );

  const handleSetLinkId = useCallback(
    (linkId?: number) => () => setLinkId(linkId),
    [setLinkId],
  );

  const handleAddRepair = useCallback(
    (entry: Entry) => () => {
      const id = entry.getId();
      const repair: Repair = {
        id: uniqueId(),
        serviceItemId: id,
        diagnosis: '',
        description: '',
        price: 0,
      };
      const newRepairs = [...repairs, repair];
      setRepairs(newRepairs);
      if (onRepairsChange) {
        onRepairsChange(newRepairs);
      }
    },
    [setRepairs, repairs],
  );

  const handleDeleteRepair = useCallback(
    ({ id }: Repair) => () => {
      const newRepairs = repairs.filter(item => item.id !== id);
      setRepairs(newRepairs);
      if (onRepairsChange) {
        onRepairsChange(newRepairs);
      }
    },
    [setRepairs, repairs],
  );

  const handleChangeRepair = useCallback(
    (repair: Repair) => (data: Repair) => {
      const newRepairs = repairs.map(item =>
        item === repair ? { ...item, ...data } : item,
      );
      setRepairs(newRepairs);
      if (onRepairsChange) {
        onRepairsChange(newRepairs);
      }
    },
    [setRepairs, repairs, onRepairsChange],
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
      if (editing && editing.getId()) {
        const entry = new Material();
        entry.setServiceItemId(editing.getId());
        setLoadingMaterials(true);
        const resultsList = (
          await MaterialClientService.BatchGet(entry)
        ).getResultsList();
        setMaterials(resultsList);
        setMaterialsIds(resultsList.map(id => id.getId()));
        setLoadingMaterials(false);
      } else {
        setMaterials([]);
        setMaterialsIds([]);
      }
      console.log('we are editing');
    },
    [setEditing, setMaterials],
  );

  const setDeleting = useCallback(
    (deletingEntry?: Entry) => () => setDeletingEntry(deletingEntry),
    [setDeletingEntry],
  );

  const makeData = () => {
    const data: Data = [];
    entries.forEach((entry, idx) => {
      // const { id, type: value } = entry;
      const id = entry.getId();
      const value = entry.getType();
      data.push([
        {
          value: (
            <>
              {selectable && (
                <Field
                  name="name"
                  type="checkbox"
                  value={!!selected.find(item => item.getId() === id)}
                  onChange={handleSelectedChange(entry)}
                  className="ServiceItemsCheckbox"
                />
              )}
              {!viewedAsCustomer && (
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
                </>
              )}
              <span>{value}</span>
            </>
          ),
          actions: [
            ...(repair
              ? [
                  <IconButton
                    key={3}
                    style={{ marginLeft: 4 }}
                    size="small"
                    onClick={handleAddRepair(entry)}
                    disabled={disableRepair}
                  >
                    <AddIcon />
                  </IconButton>,
                ]
              : []),
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
              {viewedAsCustomer ? <SearchIcon /> : <EditIcon />}
            </IconButton>,
            ...(viewedAsCustomer
              ? []
              : [
                  <IconButton
                    key={2}
                    style={{ marginLeft: 4 }}
                    size="small"
                    onClick={setDeleting(entry)}
                  >
                    <DeleteIcon />
                  </IconButton>,
                ]),
          ],
        },
      ]);
      repairs
        .filter(({ serviceItemId }) => serviceItemId === id)
        .forEach(repair => {
          data.push([
            {
              value: (
                <PlainForm<Repair>
                  key={repair.id}
                  schema={REPAIR_SCHEMA}
                  data={repair}
                  onChange={handleChangeRepair(repair)}
                  className="ServiceItemsRepairs"
                />
              ),
              actions: [
                <IconButton
                  key={0}
                  style={{ marginLeft: 4 }}
                  size="small"
                  onClick={handleDeleteRepair(repair)}
                >
                  <DeleteIcon />
                </IconButton>,
              ],
            },
          ]);
        });
    });
    return data;
  };
  const data: Data = loading || loadingProp ? makeFakeRows() : makeData();
  return (
    <div className={className}>
      <SectionBar
        title={title}
        actions={
          viewedAsCustomer
            ? undefined
            : [
                ...actions.map(item => ({
                  ...item,
                  disabled: loading || loadingProp,
                })),
                {
                  label: 'Add',
                  onClick: handleEditing({} as ServiceItem),
                  disabled: loading || loadingProp,
                },
              ]
        }
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handleChangePage,
        }}
        asideContent={asideContent}
        asideContentFirst
      >
        {children}
        <InfoTable
          data={data}
          loading={loading || loadingProp}
          error={error}
          compact
          hoverable
        />
      </SectionBar>
      {linkId && (
        <Modal open onClose={handleSetLinkId(undefined)}>
          <ServiceItemLinks
            kind="Service Item Link"
            title={entries.find(id => id.getId() === linkId)?.getType()}
            serviceItemId={linkId}
            onClose={handleSetLinkId(undefined)}
            viewedAsCustomer={viewedAsCustomer}
          />
        </Modal>
      )}
      {editing && (
        <Modal open onClose={handleEditing()} fullScreen={!viewedAsCustomer}>
          <div className="ServiceItemsModal">
            <Form<Entry>
              title={`${
                editing.getId() ? (viewedAsCustomer ? 'View' : 'Edit') : 'Add'
              } Service Item`}
              schema={SCHEMA}
              data={editing}
              onSave={handleSave}
              onClose={handleEditing()}
              disabled={saving}
              className="ServiceItemsForm"
              readOnly={viewedAsCustomer}
            />
            {!viewedAsCustomer && editing.getId() && (
              <div className="ServiceItemsReadings">
                <ServiceItemReadings
                  {...props}
                  serviceItemId={editing.getId()}
                />
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
          name={deletingEntry.getType()}
        />
      )}
    </div>
  );
};
