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
import { Form, Schema, Options } from '..//Form';
import {
  makeFakeRows,
  getRPCFields,
  formatDate,
  UserClientService,
  timestamp,
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

const SCHEMA_READING: Schema<Entry> = [
  [{ label: 'Refrigerant', headline: true }],
  [
    {
      label: 'Refrigerant Type',
      name: 'refrigerantType',
      options: REFRIGERANT_TYPES,
    },
    { label: 'Tstat brand', name: 'tstatBrand' },
    { label: 'Blower Capacitor', name: 'blowerCapacitor' },
  ],
  [
    { label: 'Blower Amps', name: 'blowerAmps' },
    { label: 'Return Temp DB', name: 'returnDb' },
    { label: 'Supply Temp DB', name: 'supplyTemperature' },
  ],
  [
    { label: 'Compressor Amps', name: 'compressorAmps' },
    { label: 'Pool supply temp', name: 'poolSupplyTemp' },
    { label: 'Pool return temp', name: 'poolReturnTemp' },
  ],
  [
    { label: 'Ambient air temp', name: 'ambientAirTemp' },
    { label: 'Coil Static Drop', name: 'coilStaticDrop' },
    { label: 'Return WB', name: 'returnWb' },
  ],
  [
    { label: 'Evap TD', name: 'evapTd' },
    { label: 'Tesp', name: 'tesp' },
  ],
  [{ label: 'Compressor', headline: true }],
  [
    { label: 'Condenser Fan Amps', name: 'condensingFanAmps' },
    { label: 'Compressor Capacitor', name: 'compressorCapacitor' },
    { label: 'Condenser Fan Capacitor', name: 'condenserFanCapacitor' },
  ],
  [
    { label: 'Suction Pressure', name: 'suctionPressure' },
    { label: 'Head Pressure', name: 'headPressure' },
    { label: 'Discharge Temperature', name: 'dischargeTemperature' },
  ],
  [
    { label: 'Subcool', name: 'subcool' },
    { label: 'Superheat', name: 'superheat' },
    { label: 'Gas Pressure In', name: 'gasPressureIn' },
  ],
  [
    { label: 'Gas Pressure Out', name: 'gasPressureOut' },
    { label: 'LL Temp Drop', name: 'llTempDrop' },
    { label: 'SL Temp Drop', name: 'slTempDrop' },
  ],
  [{ label: 'Notes', headline: true }],
  [{ label: 'Notes', name: 'notes', multiline: true }],
];

const SCHEMA_MAINTENANCE: Schema<MaintenanceEntry> = [
  [{ label: '#1', headline: true }],
  [
    {
      label: 'Condition',
      name: 'conditionRating1',
      options: MAINTENANCE_CONDITIONS,
      required: true,
    },
    { label: 'Notes', name: 'conditionNotes1' },
  ],
  [{ label: '#2', headline: true }],
  [
    {
      label: 'Condition',
      name: 'conditionRating2',
      options: MAINTENANCE_CONDITIONS,
      required: true,
    },
    { label: 'Notes', name: 'conditionNotes2' },
  ],
  [{ label: '#3', headline: true }],
  [
    {
      label: 'Condition',
      name: 'conditionRating3',
      options: MAINTENANCE_CONDITIONS,
      required: true,
    },
    { label: 'Notes', name: 'conditionNotes3' },
  ],
  [{ label: 'Refrigerant', headline: true }],
  [
    { label: 'Thermostat', name: 'thermostat', options: THERMOSTAT_OPTIONS },
    { label: 'Plateform', name: 'plateform', options: PLATEFORM_OPTIONS },
  ],
  [
    {
      label: 'Float switch',
      name: 'floatSwitch',
      options: FLOAT_SWITCH_OPTIONS,
    },
    { label: 'Evaportor Coil', name: 'evaporatorCoil', options: COIL_OPTIONS },
  ],
  [{ label: 'Compressor', headline: true }],
  [
    { label: 'Condenser Coil', name: 'condenserCoil', options: COIL_OPTIONS },
    {
      label: 'Hurricane Pad',
      name: 'hurricanePad',
      options: HURRICANE_PAD_OPTIONS,
    },
  ],
  [
    { label: 'Lineset', name: 'lineset', options: LINESET_OPTIONS },
    { label: 'Drain Line', name: 'drainLine', options: DRAIN_LINE_OPTIONS },
  ],
  [
    { label: 'Gas Type', name: 'gasType', options: GAS_TYPE_OPTIONS },
    { label: 'Burner', name: 'burner', options: BURNER_OPTIONS },
    {
      label: 'Heat Exchanger',
      name: 'heatExchanger',
      options: HEAT_EXCHANGE_OPTIONS,
    },
  ],
];

const sort = (a: Entry, b: Entry) => {
  if (a.date > b.date) return -1;
  if (a.date < b.date) return 1;
  return 0;
};

type Entry = Reading.AsObject;
type MaintenanceEntry = MaintenanceQuestion.AsObject;

interface Props {
  serviceItemId: number;
  loggedUserId: number;
}

export const ServiceItemReadings: FC<Props> = ({
  serviceItemId,
  loggedUserId,
}) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [editedEntry, setEditedEntry] = useState<Entry>();
  const [deletingEntry, setDeletingEntry] = useState<Entry>();
  const [
    editedMaintenanceEntry,
    setEditedMaintenanceEntry,
  ] = useState<MaintenanceEntry>();
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
              [entry.readingId]: entry,
            }),
      }),
      {},
    ) as {
      [key: number]: MaintenanceEntry;
    };
  };

  const load = useCallback(async () => {
    setLoading(true);
    const entry = new Reading();
    entry.setServiceItemId(serviceItemId);
    try {
      const response = await ReadingClientService.BatchGet(entry);
      const { resultsList } = response.toObject();
      const users = await UserClientService.loadUsersByIds(
        resultsList.map(({ userId }) => userId),
      );
      const userArray = users.getResultsList();
      const maintenanceQuestions = await loadMaintenanceQuestions(
        resultsList.map(({ id }) => id),
      );
      setEntries(resultsList.sort(sort));
      setMaintenanceQuestions(maintenanceQuestions);
      setUsers(userArray);
      setLoading(false);
      setLoaded(true);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  }, [
    setLoading,
    loadMaintenanceQuestions,
    setEntries,
    setMaintenanceQuestions,
    setUsers,
    setError,
  ]);

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);

  const setEditing = useCallback(
    (editedEntry?: Entry) => () => {
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
        const isNew = !editedEntry.id;
        setSaving(true);
        const entry = new Reading();
        if (!isNew) {
          entry.setId(editedEntry.id);
        }
        entry.setServiceItemId(serviceItemId);
        entry.setDate(timestamp(true));
        entry.setUserId(loggedUserId);
        const fieldMaskList = ['ServiceItemId', 'Date', 'UserId'];
        for (const fieldName in data) {
          const { upperCaseProp, methodName } = getRPCFields(fieldName);
          // @ts-ignore
          entry[methodName](data[fieldName]);
          fieldMaskList.push(upperCaseProp);
        }
        entry.setFieldMaskList(fieldMaskList);
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
    [editedEntry, setSaving, setEditing, load, setError],
  );

  const handleSaveMaintenance = useCallback(
    async (data: MaintenanceEntry) => {
      if (editedMaintenanceEntry) {
        const isNew = !editedMaintenanceEntry.id;
        setSaving(true);
        const entry = new MaintenanceQuestion();
        if (!isNew) {
          entry.setId(editedMaintenanceEntry.id);
        }
        entry.setReadingId(editedMaintenanceEntry.readingId);
        const fieldMaskList = ['ReadingId'];
        for (const fieldName in data) {
          const { upperCaseProp, methodName } = getRPCFields(fieldName);
          // @ts-ignore
          entry[methodName](data[fieldName]);
          fieldMaskList.push(upperCaseProp);
        }
        entry.setFieldMaskList(fieldMaskList);
        try {
          await MaintenanceQuestionClientService[isNew ? 'Create' : 'Update'](
            entry,
          );
          setSaving(false);
          setEditingMaintenance()();
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
      maintenanceQuestion.setReadingId(deletingEntry.id);
      await MaintenanceQuestionClientService.Delete(maintenanceQuestion);
      const entry = new Reading();
      entry.setId(deletingEntry.id);
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
        const { id, date, userId } = entry;
        const newMaintenanceQuestion = new MaintenanceQuestion();
        newMaintenanceQuestion.setReadingId(id);
        return [
          {
            value: [
              formatDate(date),
              '-',
              maintenanceQuestions[id] ? 'Maintenance' : 'Service',
              userId === 0 && users != []
                ? ''
                : ` - ${users[findUser(userId)].getFirstname()} ${users[
                    findUser(userId)
                  ].getLastname()}`,
            ].join(' '),
            onClick: setEditing(entry),
            actions: [
              <IconButton
                key={0}
                style={{ marginLeft: 4 }}
                size="small"
                onClick={setEditingMaintenance(
                  maintenanceQuestions[id] || newMaintenanceQuestion.toObject(),
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
      {editedMaintenanceEntry !== undefined ? (
        <Form<MaintenanceEntry>
          title={`${editedMaintenanceEntry.id ? 'Edit' : 'Add'} Maintenance`}
          schema={SCHEMA_MAINTENANCE}
          data={editedMaintenanceEntry}
          onSave={handleSaveMaintenance}
          onClose={setEditingMaintenance()}
          disabled={saving}
          error={error ? API_FAILED_GENERAL_ERROR_MSG : undefined}
        />
      ) : editedEntry ? (
        <Form<Entry>
          title={`${editedEntry.id ? 'Edit' : 'Add'} Reading`}
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
                onClick: setEditing({} as Entry),
              },
            ]}
            fixedActions
          />
          <InfoTable data={data} loading={loading} hoverable />
        </>
      )}
      {deletingEntry && (
        <ConfirmDelete
          open
          onClose={setDeleting()}
          onConfirm={handleDelete}
          kind="Reading"
          name={[
            formatDate(deletingEntry.date),
            '-',
            maintenanceQuestions[deletingEntry.id] ? 'Maintenance' : 'Service',
            deletingEntry.userId === 0 && users != []
              ? ''
              : ` - ${users[
                  findUser(deletingEntry.userId)
                ].getFirstname()} ${users[
                  findUser(deletingEntry.userId)
                ].getLastname()}`,
          ]
            .join(' ')
            .trim()}
        />
      )}
    </>
  );
};
