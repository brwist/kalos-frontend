import React, {
  FC,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useReducer,
} from 'react';
import { reducer, ACTIONS } from './reducer';
import uniqueId from 'lodash/uniqueId';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Button from '@material-ui/core/Button';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse/Collapse';
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
  EventClientService,
} from '../../../helpers';
import { ServiceItemLinks } from '../ServiceItemLinks';
import { ServiceItemReadings } from '../ServiceItemReadings';
import './styles.less';
import { Event } from '@kalos-core/kalos-rpc/Event';
const ServiceItemClientService = new ServiceItemClient(ENDPOINT);
const ReadingClientService = new ReadingClient(ENDPOINT);
const MaintenanceQuestionClientService = new MaintenanceQuestionClient(
  ENDPOINT,
);
const MaterialClientService = new MaterialClient(ENDPOINT);

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
  eventId: number;
  loading?: boolean;
  selectable?: boolean;
  onSelect?: (entries: number[]) => void;
  selected?: number[];
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

const sort = (a: ServiceItem, b: ServiceItem) => {
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
    eventId,
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
  const [state, dispatch] = useReducer(reducer, {
    entries: [],
    repairs: repairsInitial,
    materials: [],
    materialsIds: [],
    loadingMaterials: false,
    loaded: false,
    loading: true,
    saving: false,
    error: false,
    editing: undefined,
    deletingEntry: undefined,
    linkId: undefined,
    count: 0,
    page: 0,
    readingsDropdowns: [],
  });

  const [selected, setSelected] = useState<number[]>(props.selected || []);
  console.log('selected Ids', selected);

  const handleMaterialChange = useCallback(
    (idx: number) => (data: Material) => {
      const temp = makeSafeFormObject(data, new Material());
      const newMaterials = [...state.materials];
      newMaterials[idx] = temp;
      dispatch({ type: ACTIONS.SET_MATERIALS, data: newMaterials });
    },
    [state.materials],
  );

  const handleAddMaterial = useCallback(() => {
    const newMaterial = new Material();
    newMaterial.setId(Date.now());
    const newMaterials = [...state.materials, newMaterial];
    dispatch({ type: ACTIONS.SET_MATERIALS, data: newMaterials });
  }, [state.materials]);

  const handleRemoveMaterial = useCallback(
    (idx: number) => () => {
      const newMaterials = state.materials.filter((_, idy) => idx !== idy);
      dispatch({ type: ACTIONS.SET_MATERIALS, data: newMaterials });
    },
    [state.materials],
  );

  const MATERIALS_SCHEMA = state.materials
    .map(
      (_, idx): Schema<ServiceItem> => [
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
                    disabled: state.saving,
                  },
                ],
          },
        ],
        [
          {
            content: (
              <PlainForm<Material>
                key={state.materials[idx].getId()}
                schema={MATERIAL_SCHEMA}
                data={state.materials[idx]}
                onChange={handleMaterialChange(idx)}
                disabled={state.saving}
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
                disabled: state.saving,
              },
            ],
      },
    ],
    ...(state.loadingMaterials
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
    dispatch({ type: ACTIONS.SET_LOADING, data: true });
    const entry = new ServiceItem();
    entry.setPropertyId(propertyId);
    entry.setPageNumber(state.page);
    entry.setIsActive(1);
    try {
      const response = await ServiceItemClientService.BatchGet(entry);
      const resultsList = response.getResultsList();
      const mappedResults = resultsList.map(serviceItem => ({
        serviceItemId: serviceItem.getId(),
        active: 0,
      }));
      dispatch({ type: ACTIONS.SET_READINGS_DROPDOWNS, data: mappedResults });

      const count = response.getTotalCount();
      dispatch({ type: ACTIONS.SET_ENTRIES, data: resultsList.sort(sort) });
      dispatch({ type: ACTIONS.SET_COUNT, data: count });
      dispatch({ type: ACTIONS.SET_LOADING, data: false });
      dispatch({ type: ACTIONS.SET_LOADED, data: true });
    } catch (e) {
      dispatch({ type: ACTIONS.SET_ERROR, data: true });
      dispatch({ type: ACTIONS.SET_LOADING, data: false });
    }
  }, [propertyId, state.page]);

  useEffect(() => {
    if (!state.loaded) {
      load();
    }
  }, [state.loaded, load]);

  const handleMaterials = async (
    materials: Material[],
    materialsIds: number[],
    serviceItemId: number,
  ) => {
    console.log('handle materials');
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
    console.log('finished deleting');
    const operations: {
      operation: 'Create' | 'Update';
      entry: Material;
    }[] = [];
    console.log('bfore for loop');
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
        console.log('create');
        const entry = operations[i].entry;
        entry.setId(0);
        entry.setFieldMaskList([
          'Name',
          'Quantity',
          'PartNumber',
          'Vendor',
          'ServiceItemId',
        ]);
        console.log({ entry });
        await MaterialClientService.Create(entry);
      } else {
        console.log('update');
        await MaterialClientService.Update(operations[i].entry);
      }
    }
  };

  const handleSave = useCallback(
    async (data: ServiceItem) => {
      if (state.editing) {
        dispatch({ type: ACTIONS.SET_SAVING, data: true });

        //onst entry = editing;

        let entry = makeSafeFormObject(data, new ServiceItem());
        if (typeof entry.getBrand() === 'function') {
          //for some reason, if the form value hasn't changed,it throws an
          //error, this prevents the error
          entry = state.editing;
        }
        entry.setPropertyId(propertyId);
        const isNew = !state.editing.getId();
        if (!isNew) {
          entry.setId(state.editing.getId());
        } else {
          const sortOrder = Math.max(
            state.entries[state.entries.length - 1].getSortOrder() + 1,
            state.entries.length,
          );
          entry.setSortOrder(sortOrder);
          entry.addFieldMask('SortOrder');
        }
        const id = await ServiceItemClientService[isNew ? 'Create' : 'Update'](
          entry,
        );
        await handleMaterials(state.materials, state.materialsIds, id.getId());
        dispatch({ type: ACTIONS.SET_SAVING, data: false });
        dispatch({ type: ACTIONS.SET_EDITING, data: undefined });
        await load();
      }
    },
    [
      state.editing,
      propertyId,
      state.entries,
      load,
      state.materials,
      state.materialsIds,
    ],
  );

  const handleDelete = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_DELETING_ENTRY, data: undefined });
    const deleting = state.deletingEntry;
    if (deleting) {
      dispatch({ type: ACTIONS.SET_LOADING, data: true });
      const reading = new Reading();
      reading.setServiceItemId(deleting.getId());
      const response = await ReadingClientService.BatchGet(reading);
      const readingIds = response.getResultsList().map(res => res.getId());
      await Promise.all(
        readingIds.map(async (readingId: number) => {
          const maintenanceQuestion = new MaintenanceQuestion();
          maintenanceQuestion.setReadingId(readingId);
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
      const newRepairs = state.repairs.filter(
        ({ serviceItemId }) => serviceItemId !== deleting.getId(),
      );
      dispatch({ type: ACTIONS.SET_REPAIRS, data: newRepairs });
      if (onRepairsChange) {
        onRepairsChange(newRepairs);
      }
      const entry = new ServiceItem();
      entry.setId(deleting.getId());
      await ServiceItemClientService.Delete(entry);
      await load();
    }
  }, [state.deletingEntry, load, state.repairs, onRepairsChange]);

  const handleSelectedChange = useCallback(
    (entry: ServiceItem) => async () => {
      const newSelected: number[] = [
        ...selected.filter(item => {
          return item !== entry.getId();
        }),
      ];
      const isSelected = selected.find(item => {
        return item === entry.getId();
      });
      if (!isSelected) {
        newSelected.push(entry.getId());
      }
      setSelected(newSelected);
      if (onSelect) {
        onSelect(newSelected);
        let fullString = '';
        for (let i = 0; i < newSelected.length; i++) {
          fullString += `${newSelected[i]}`;
          if (i < newSelected.length - 1) {
            fullString += ',';
          }
        }
        const updateEvent = new Event();
        updateEvent.setInvoiceServiceItem(fullString);
        updateEvent.setId(eventId);
        updateEvent.setFieldMaskList(['InvoiceServiceItem']);
        await EventClientService.Update(updateEvent);
      }
    },
    [setSelected, selected, eventId, onSelect],
  );

  const handleReorder = useCallback(
    (idx: number, step: number) => async () => {
      dispatch({ type: ACTIONS.SET_LOADING, data: true });
      const currentItem = state.entries[idx];
      const nextItem = state.entries[idx + step];
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
    [state.entries, load],
  );

  const handleSetLinkId = useCallback(
    (linkId?: number) => () =>
      dispatch({ type: ACTIONS.SET_LINK_ID, data: linkId }),
    [],
  );

  const handleAddRepair = useCallback(
    (entry: ServiceItem) => () => {
      const id = entry.getId();
      const repair: Repair = {
        id: uniqueId(),
        serviceItemId: id,
        diagnosis: '',
        description: '',
        price: 0,
      };
      const newRepairs = [...state.repairs, repair];
      dispatch({ type: ACTIONS.SET_REPAIRS, data: newRepairs });
      if (onRepairsChange) {
        onRepairsChange(newRepairs);
      }
    },
    [state.repairs, onRepairsChange],
  );

  const handleDeleteRepair = useCallback(
    ({ id }: Repair) =>
      () => {
        const newRepairs = state.repairs.filter(item => item.id !== id);
        dispatch({ type: ACTIONS.SET_REPAIRS, data: newRepairs });
        if (onRepairsChange) {
          onRepairsChange(newRepairs);
        }
      },
    [state.repairs, onRepairsChange],
  );

  const handleChangeRepair = useCallback(
    (repair: Repair) => (data: Repair) => {
      const newRepairs = state.repairs.map(item =>
        item === repair ? { ...item, ...data } : item,
      );
      dispatch({ type: ACTIONS.SET_REPAIRS, data: newRepairs });
      if (onRepairsChange) {
        onRepairsChange(newRepairs);
      }
    },
    [state.repairs, onRepairsChange],
  );

  const handleChangePage = useCallback((page: number) => {
    dispatch({ type: ACTIONS.SET_PAGE, data: page });
    dispatch({ type: ACTIONS.SET_LOADED, data: false });
  }, []);

  const handleEditing = useCallback(
    (editing?: ServiceItem) => async () => {
      console.log(editing);
      if (editing === undefined) {
        console.log('we set it to undefined');
        dispatch({ type: ACTIONS.SET_EDITING, data: undefined });
      }

      if (editing && typeof editing.getId === 'function') {
        console.log('we got an acutal value');
        dispatch({ type: ACTIONS.SET_EDITING, data: editing });
      } else if (editing != undefined) {
        console.log('we are creating a new one');
        dispatch({ type: ACTIONS.SET_EDITING, data: new ServiceItem() });
      }
      if (editing && typeof editing.getId === 'function') {
        const entry = new Material();
        entry.setServiceItemId(editing.getId());
        dispatch({ type: ACTIONS.SET_LOADING_MATERIALS, data: true });
        const resultsList = (
          await MaterialClientService.BatchGet(entry)
        ).getResultsList();
        dispatch({ type: ACTIONS.SET_MATERIALS, data: resultsList });
        const ids = resultsList.map(id => id.getId());
        dispatch({ type: ACTIONS.SET_MATERIALS_IDS, data: ids });

        dispatch({ type: ACTIONS.SET_LOADING_MATERIALS, data: false });
      } else {
        dispatch({ type: ACTIONS.SET_MATERIALS, data: [] });
        dispatch({ type: ACTIONS.SET_MATERIALS_IDS, data: [] });
      }
    },
    [],
  );

  const setDeleting = useCallback(
    (deletingEntry?: ServiceItem) => () =>
      dispatch({ type: ACTIONS.SET_DELETING_ENTRY, data: deletingEntry }),
    [],
  );

  const makeData = () => {
    const data: Data = [];
    state.entries.forEach((entry, idx) => {
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
                  value={
                    !!selected.find(item => {
                      if (!item) {
                        return (item as any)['array']['id'] === id; // Fall back in case old local storage is present
                      } else {
                        return item === id;
                      }
                    })
                  }
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
                    disabled={idx === state.entries.length - 1}
                    onClick={handleReorder(idx, 1)}
                  >
                    <ArrowDownwardIcon />
                  </IconButton>
                </>
              )}
              <span>{value}</span>

              <div key="ReadingsDropdown">
                <Collapse
                  key={entry.getId().toString() + 'collapse'}
                  in={
                    state.readingsDropdowns.find(
                      dropdown => dropdown.serviceItemId === entry.getId(),
                    )?.active == 1
                      ? true
                      : false
                  }
                >
                  <div>
                    <ServiceItemReadings
                      {...props}
                      serviceItemId={entry.getId()}
                      eventId={eventId}
                      onClose={() => {
                        let tempDropDowns = state.readingsDropdowns;
                        const dropdown = state.readingsDropdowns.findIndex(
                          dropdown => dropdown.serviceItemId === entry.getId(),
                        );
                        if (tempDropDowns[dropdown]) {
                          if (tempDropDowns[dropdown].active == 0)
                            tempDropDowns[dropdown].active = 1;
                          else tempDropDowns[dropdown].active = 0;
                        }
                        console.log(tempDropDowns);
                        dispatch({
                          type: ACTIONS.SET_READINGS_DROPDOWNS,
                          data: tempDropDowns,
                        });
                      }}
                    />
                  </div>
                </Collapse>
              </div>
            </>
          ),
          actions:
            state.readingsDropdowns.find(
              dropdown => dropdown.serviceItemId === entry.getId(),
            )?.active == 1
              ? []
              : [
                  <Button
                    key={'dropDownbutton' + entry.getId().toString()}
                    onClick={() => {
                      let tempDropDowns = state.readingsDropdowns;
                      const dropdown = state.readingsDropdowns.findIndex(
                        dropdown => dropdown.serviceItemId === entry.getId(),
                      );
                      if (tempDropDowns[dropdown]) {
                        if (tempDropDowns[dropdown].active == 0)
                          tempDropDowns[dropdown].active = 1;
                        else tempDropDowns[dropdown].active = 0;
                      }
                      console.log(tempDropDowns);
                      dispatch({
                        type: ACTIONS.SET_READINGS_DROPDOWNS,
                        data: tempDropDowns,
                      });
                    }}
                  >
                    Readings
                    {state.readingsDropdowns.find(
                      dropdown => dropdown.serviceItemId === entry.getId(),
                    )!.active == 1 ? (
                      <ExpandLess></ExpandLess>
                    ) : (
                      <ExpandMore></ExpandMore>
                    )}
                  </Button>,
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
      state.repairs
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
  const data: Data = state.loading || loadingProp ? makeFakeRows() : makeData();
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
                  disabled: state.loading || loadingProp,
                })),
                {
                  label: 'Add',
                  onClick: handleEditing({} as ServiceItem),
                  disabled: state.loading || loadingProp,
                },
              ]
        }
        pagination={{
          count: state.count,
          page: state.page,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: handleChangePage,
        }}
        asideContent={asideContent}
        asideContentFirst
      >
        {children}
        <InfoTable
          data={data}
          loading={state.loading || loadingProp}
          error={state.error}
          compact
          hoverable
        />
      </SectionBar>
      {state.linkId && (
        <Modal open onClose={handleSetLinkId(undefined)}>
          <ServiceItemLinks
            kind="Service Item Link"
            title={state.entries
              .find(id => id.getId() === state.linkId)
              ?.getType()}
            serviceItemId={state.linkId}
            onClose={handleSetLinkId(undefined)}
            viewedAsCustomer={viewedAsCustomer}
          />
        </Modal>
      )}
      {state.editing && (
        <Modal
          open
          onClose={handleEditing(undefined)}
          //fullScreen={!viewedAsCustomer}
        >
          <div className="ServiceItemsModal">
            <Form<ServiceItem>
              title={`${
                state.editing.getId()
                  ? viewedAsCustomer
                    ? 'View'
                    : 'Edit'
                  : 'Add'
              } Service Item`}
              schema={SCHEMA}
              data={state.editing}
              onSave={handleSave}
              onClose={handleEditing(undefined)}
              disabled={state.saving}
              className="ServiceItemsForm"
              readOnly={viewedAsCustomer}
            />
          </div>
        </Modal>
      )}
      {state.deletingEntry && (
        <ConfirmDelete
          open
          onClose={setDeleting()}
          onConfirm={handleDelete}
          kind="Service Item"
          name={state.deletingEntry.getType()}
        />
      )}
    </div>
  );
};
