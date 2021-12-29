import React, { FC, useState, useCallback, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';
import { ReadingClient, Reading } from '@kalos-core/kalos-rpc/Reading';
import {
  MaintenanceQuestionClient,
  MaintenanceQuestion,
} from '@kalos-core/kalos-rpc/MaintenanceQuestion';
import { User } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT, API_FAILED_GENERAL_ERROR_MSG } from '../../../constants';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { ConfirmDelete } from '../ConfirmDelete';
import { Form, Schema, Options } from '../Form';
import {
  ServiceItem,
  ServiceItemClient,
} from '@kalos-core/kalos-rpc/ServiceItem';
import {
  makeFakeRows,
  getRPCFields,
  formatDate,
  UserClientService,
  timestamp,
  makeSafeFormObject,
} from '../../../helpers';

const ReadingClientService = new ReadingClient(ENDPOINT);
const MaintenanceQuestionClientService = new MaintenanceQuestionClient(
  ENDPOINT,
);

const REFRIGERANT_TYPES: Options = [
  { label: 'R410a', value: '1' },
  { label: 'R22', value: '2' },
  { label: 'Other', value: '3' },
];

const MAINTENANCE_CONDITIONS: Options = [
  'New',
  'Good',
  'Fair',
  'Poor',
  'Inoperative',
];

const THERMOSTAT_OPTIONS: Options = [
  { label: 'Good', value: 1 },
  { label: 'Physical Damage', value: 2 },
  { label: 'Miscalibrated', value: 3 },
  { label: 'Mercury', value: 4 },
];

const PLATEFORM_OPTIONS: Options = [
  { label: 'Solid', value: 1 },
  { label: 'Mild Damage', value: 2 },
  { label: 'Disruptive Damage', value: 3 },
  { label: 'Replace', value: 4 },
];

const FLOAT_SWITCH_OPTIONS: Options = [
  { label: 'Working', value: 1 },
  { label: 'Not Working', value: 2 },
  { label: 'Not Installed', value: 3 },
];

const COIL_OPTIONS: Options = [
  { label: 'Clean', value: 1 },
  { label: 'Mild Damage', value: 2 },
  { label: 'Dirty', value: 3 },
  { label: 'Blocked', value: 4 },
];

const HURRICANE_PAD_OPTIONS: Options = [
  { label: 'New', value: 1 },
  { label: 'Sinking', value: 2 },
  { label: 'Crumbling', value: 3 },
  { label: 'Replace', value: 4 },
];

const LINESET_OPTIONS: Options = [
  { label: 'New', value: 1 },
  { label: 'Insulation Damaged', value: 2 },
  { label: 'Significant Patina', value: 3 },
  { label: 'Replace', value: 4 },
];

const DRAIN_LINE_OPTIONS: Options = [
  { label: 'Clean', value: 1 },
  { label: 'Mildly Blocked', value: 2 },
  { label: 'Blocked', value: 3 },
  { label: 'Broken', value: 4 },
];

const GAS_TYPE_OPTIONS: Options = [
  { label: 'LP', value: 1 },
  { label: 'Natural gas', value: 2 },
];

const BURNER_OPTIONS: Options = [
  { label: 'Clean', value: 1 },
  { label: 'Mild Damage', value: 2 },
  { label: 'Carbon Buildup', value: 3 },
  { label: 'Major Corrosion', value: 4 },
];

const HEAT_EXCHANGE_OPTIONS: Options = [
  { label: 'Clean', value: 1 },
  { label: 'Mild Damage', value: 2 },
  { label: 'Dirty', value: 3 },
  { label: 'Major Corrosion', value: 4 },
];

const SCHEMA_MAINTENANCE: Schema<MaintenanceEntry> = [
  [{ label: '#1', headline: true }],
  [
    {
      label: 'Condition',
      name: 'getConditionRating1',
      options: MAINTENANCE_CONDITIONS,
      required: true,
    },
    { label: 'Notes', name: 'getConditionNotes1' },
  ],
  [{ label: '#2', headline: true }],
  [
    {
      label: 'Condition',
      name: 'getConditionRating2',
      options: MAINTENANCE_CONDITIONS,
      required: true,
    },
    { label: 'Notes', name: 'getConditionNotes2' },
  ],
  [{ label: '#3', headline: true }],
  [
    {
      label: 'Condition',
      name: 'getConditionRating3',
      options: MAINTENANCE_CONDITIONS,
      required: true,
    },
    { label: 'Notes', name: 'getConditionNotes3' },
  ],
  [{ label: 'Refrigerant', headline: true }],
  [
    { label: 'Thermostat', name: 'getThermostat', options: THERMOSTAT_OPTIONS },
    { label: 'Plateform', name: 'getPlateform', options: PLATEFORM_OPTIONS },
  ],
  [
    {
      label: 'Float switch',
      name: 'getFloatSwitch',
      options: FLOAT_SWITCH_OPTIONS,
    },
    {
      label: 'Evaportor Coil',
      name: 'getEvaporatorCoil',
      options: COIL_OPTIONS,
    },
  ],
  [{ label: 'Compressor', headline: true }],
  [
    {
      label: 'Condenser Coil',
      name: 'getCondenserCoil',
      options: COIL_OPTIONS,
    },
    {
      label: 'Hurricane Pad',
      name: 'getHurricanePad',
      options: HURRICANE_PAD_OPTIONS,
    },
  ],
  [
    { label: 'Lineset', name: 'getLineset', options: LINESET_OPTIONS },
    { label: 'Drain Line', name: 'getDrainLine', options: DRAIN_LINE_OPTIONS },
  ],
  [
    { label: 'Gas Type', name: 'getGasType', options: GAS_TYPE_OPTIONS },
    { label: 'Burner', name: 'getBurner', options: BURNER_OPTIONS },
    {
      label: 'Heat Exchanger',
      name: 'getHeatExchanger',
      options: HEAT_EXCHANGE_OPTIONS,
    },
  ],
];

const sort = (a: Entry, b: Entry) => {
  if (a.getDate() > b.getDate()) return -1;
  if (a.getDate() < b.getDate()) return 1;
  return 0;
};

type Entry = Reading;
type MaintenanceEntry = MaintenanceQuestion;

interface Props {
  eventId: number;
  propertyId: number;
  loggedUserId: number;
}

export const ServiceCallReadings: FC<Props> = ({
  eventId,
  loggedUserId,
  propertyId,
}) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [existingServiceItems, setExistingServiceItems] = useState<
    ServiceItem[]
  >([]);
  const [editedEntry, setEditedEntry] = useState<Entry>();
  const [deletingEntry, setDeletingEntry] = useState<Entry>();
  const [editedMaintenanceEntry, setEditedMaintenanceEntry] =
    useState<MaintenanceEntry>();
  const [maintenanceQuestions, setMaintenanceQuestions] = useState<{
    [key: number]: MaintenanceEntry;
  }>({});

  const loadMaintenanceQuestions = async (readingIds: number[]) => {
    const maintenanceQuestions = await Promise.all(
      readingIds.map(async id => {
        const entry = new MaintenanceQuestion();
        entry.setReadingId(id);
        try {
          return await MaintenanceQuestionClientService.Get(entry);
        } catch (e) {
          return null;
        }
      }),
    );
    return maintenanceQuestions.reduce(
      (aggr, entry) => ({
        ...aggr,
        ...(entry === null
          ? {}
          : {
              [entry.getReadingId()]: entry,
            }),
      }),
      {},
    ) as {
      [key: number]: MaintenanceEntry;
    };
  };
  const SCHEMA_READING: Schema<Entry> = [
    [
      {
        label: 'Selected Service Item',
        name: 'getServiceItemId',
        required: true,
        options: existingServiceItems.map(item => {
          return { label: item.getType(), value: item.getId() };
        }),
      },
    ],
    [{ label: 'Refrigerant', headline: true }],
    [
      {
        label: 'Refrigerant Type',
        name: 'getRefrigerantType',
        options: REFRIGERANT_TYPES,
      },
      { label: 'Tstat brand', name: 'getTstatBrand' },
      { label: 'Blower Capacitor', name: 'getBlowerCapacitor' },
    ],
    [
      { label: 'Blower Amps', name: 'getBlowerAmps' },
      { label: 'Return Temp DB', name: 'getReturnDb' },
      { label: 'Supply Temp DB', name: 'getSupplyTemperature' },
    ],
    [
      { label: 'Compressor Amps', name: 'getCompressorAmps' },
      { label: 'Pool supply temp', name: 'getPoolSupplyTemp' },
      { label: 'Pool return temp', name: 'getPoolReturnTemp' },
    ],
    [
      { label: 'Ambient air temp', name: 'getAmbientAirTemp' },
      { label: 'Coil Static Drop', name: 'getCoilStaticDrop' },
      { label: 'Return WB', name: 'getReturnWb' },
    ],
    [
      { label: 'Evap TD', name: 'getEvapTd' },
      { label: 'Tesp', name: 'getTesp' },
    ],
    [{ label: 'Compressor', headline: true }],
    [
      { label: 'Condenser Fan Amps', name: 'getCondensingFanAmps' },
      { label: 'Compressor Capacitor', name: 'getCompressorCapacitor' },
      { label: 'Condenser Fan Capacitor', name: 'getCondenserFanCapacitor' },
    ],
    [
      { label: 'Suction Pressure', name: 'getSuctionPressure' },
      { label: 'Head Pressure', name: 'getHeadPressure' },
      { label: 'Discharge Temperature', name: 'getDischargeTemperature' },
    ],
    [
      { label: 'Subcool', name: 'getSubcool' },
      { label: 'Superheat', name: 'getSuperheat' },
      { label: 'Gas Pressure In', name: 'getGasPressureIn' },
    ],
    [
      { label: 'Gas Pressure Out', name: 'getGasPressureOut' },
      { label: 'LL Temp Drop', name: 'getLlTempDrop' },
      { label: 'SL Temp Drop', name: 'getSlTempDrop' },
    ],
    [{ label: 'Notes', headline: true }],
    [{ label: 'Notes', name: 'getNotes', multiline: true }],
  ];
  const load = useCallback(async () => {
    setLoading(true);
    const serviceItemReq = new ServiceItem();
    serviceItemReq.setIsActive(1);
    serviceItemReq.setPropertyId(propertyId);
    const ServiceItemClientService = new ServiceItemClient(ENDPOINT);
    const serviceItems = await ServiceItemClientService.BatchGet(
      serviceItemReq,
    );
    setExistingServiceItems(serviceItems.getResultsList());
    const entry = new Reading();
    entry.setEventId(eventId);
    //entry.setServiceItemId(serviceItemId);
    try {
      const response = await ReadingClientService.BatchGet(entry);
      const resultsList = response.getResultsList();
      const users = await UserClientService.loadUsersByIds(
        resultsList.map(user => user.getUserId()),
      );
      console.log(users);
      const userArray = users.getResultsList();
      const maintenanceQuestions = await loadMaintenanceQuestions(
        resultsList.map(id => id.getId()),
      );
      console.log(maintenanceQuestions);
      setEntries(resultsList.sort(sort));
      setMaintenanceQuestions(maintenanceQuestions);
      setUsers(userArray);
      setLoading(false);
      setLoaded(true);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  }, [eventId, propertyId]);

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);

  const setEditing = useCallback(
    (editedEntry?: Entry) => () => {
      console.log(editedEntry);
      setEditedEntry(editedEntry);
      setError(false);
    },
    [setEditedEntry, setError],
  );

  const setEditingMaintenance = useCallback(
    (editedMaintenanceEntry?: MaintenanceEntry) => () => {
      setEditedMaintenanceEntry(editedMaintenanceEntry);
      setError(false);
    },
    [setEditedMaintenanceEntry, setError],
  );

  const setDeleting = useCallback(
    (deletingEntry?: Entry) => () => setDeletingEntry(deletingEntry),
    [setDeletingEntry],
  );

  const handleSave = useCallback(
    async (data: Entry) => {
      if (editedEntry) {
        const isNew = !editedEntry.getId();
        setSaving(true);
        const entry = makeSafeFormObject(data, new Reading());
        if (!isNew) {
          entry.setId(editedEntry.getId());
        }
        entry.setEventId(eventId);
        entry.setDate(timestamp(true));
        entry.setUserId(loggedUserId);
        try {
          await ReadingClientService[isNew ? 'Create' : 'Update'](entry);
          setSaving(false);
          setEditing()();
          await load();
        } catch (e) {
          setError(true);
          setSaving(false);
        }
      }
    },
    [editedEntry, eventId, loggedUserId, setEditing, load],
  );

  const handleSaveMaintenance = useCallback(
    async (data: MaintenanceEntry) => {
      if (editedMaintenanceEntry) {
        const isNew = !editedMaintenanceEntry.getId();
        setSaving(true);

        const entry = makeSafeFormObject(data, new MaintenanceQuestion());
        if (!isNew) {
          entry.setId(editedMaintenanceEntry.getId());
        }
        entry.setReadingId(editedMaintenanceEntry.getReadingId());
        try {
          await MaintenanceQuestionClientService[isNew ? 'Create' : 'Update'](
            entry,
          );
          setSaving(false);
          setEditingMaintenance();
          await load();
        } catch (e) {
          setError(true);
          setSaving(false);
        }
      }
    },
    [editedMaintenanceEntry, setSaving, setEditingMaintenance, load, setError],
  );

  const handleDelete = useCallback(async () => {
    setDeleting()();
    if (deletingEntry) {
      setLoading(true);
      const maintenanceQuestion = new MaintenanceQuestion();
      maintenanceQuestion.setReadingId(deletingEntry.getId());
      await MaintenanceQuestionClientService.Delete(maintenanceQuestion);
      const entry = new Reading();
      entry.setId(deletingEntry.getId());
      await ReadingClientService.Delete(entry);
      await load();
    }
  }, [setDeleting, deletingEntry, load]);
  const findUser = (value: number) => {
    if (users) {
      for (let i = 0; i < users.length; i += 1) {
        if (users[i].getId() === value) {
          return i;
        }
      }
      return -1;
    }
    return -1;
  };
  const data: Data = loading
    ? makeFakeRows()
    : entries.map(entry => {
        const newMaintenanceQuestion = new MaintenanceQuestion();
        const serviceItem = existingServiceItems.find(
          value => value.getId() === entry.getServiceItemId(),
        );
        newMaintenanceQuestion.setReadingId(entry.getId());
        return [
          {
            value: [serviceItem?.getType()],
          },
          {
            value: [
              formatDate(entry.getDate()),
              '-',
              maintenanceQuestions[entry.getId()] ? 'Maintenance' : 'Service',
              entry.getUserId() === 0 && users != []
                ? ''
                : ` - ${users[
                    findUser(entry.getUserId())
                  ].getFirstname()} ${users[
                    findUser(entry.getUserId())
                  ].getLastname()}`,
            ].join(' '),
            onClick: setEditing(entry),
            actions: [
              <IconButton
                key={0}
                style={{ marginLeft: 4 }}
                size="small"
                onClick={setEditingMaintenance(
                  maintenanceQuestions[entry.getId()] || newMaintenanceQuestion,
                )}
              >
                <BuildIcon />
              </IconButton>,
              <IconButton
                key={1}
                style={{ marginLeft: 4 }}
                size="small"
                onClick={setEditing(entry)}
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
    <>
      {editedMaintenanceEntry ? (
        <Form<MaintenanceEntry>
          title={`${
            editedMaintenanceEntry.getId() != 0 ? 'Edit' : 'Add'
          } Maintenance`}
          schema={SCHEMA_MAINTENANCE}
          data={editedMaintenanceEntry}
          onSave={handleSaveMaintenance}
          onClose={setEditingMaintenance()}
          disabled={saving}
          error={error ? API_FAILED_GENERAL_ERROR_MSG : undefined}
        />
      ) : editedEntry ? (
        <Form<Entry>
          title={`${editedEntry.getId() ? 'Edit' : 'Add'} Reading`}
          schema={SCHEMA_READING}
          data={editedEntry}
          onSave={handleSave}
          onClose={setEditing()}
          disabled={saving}
          error={error ? API_FAILED_GENERAL_ERROR_MSG : undefined}
        />
      ) : (
        <>
          <SectionBar
            title="Readings"
            actions={[
              {
                label: 'Add',
                onClick: setEditing(new Reading()),
              },
            ]}
            fixedActions
          />
          <InfoTable
            columns={[{ name: 'Service Item' }, { name: 'Reading Info' }]}
            data={data}
            loading={loading}
            hoverable
          />
        </>
      )}
      {deletingEntry && (
        <ConfirmDelete
          open
          onClose={setDeleting()}
          onConfirm={handleDelete}
          kind="Reading"
          name={[
            formatDate(deletingEntry.getDate()),
            '-',
            maintenanceQuestions[deletingEntry.getId()]
              ? 'Maintenance'
              : 'Service',
            deletingEntry.getUserId() === 0 && users != []
              ? ''
              : ` - ${users[
                  findUser(deletingEntry.getUserId())
                ].getFirstname()} ${users[
                  findUser(deletingEntry.getUserId())
                ].getLastname()}`,
          ]
            .join(' ')
            .trim()}
        />
      )}
    </>
  );
};
