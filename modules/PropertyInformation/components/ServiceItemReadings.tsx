import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';
import { ReadingClient, Reading } from '@kalos-core/kalos-rpc/Reading';
import {
  MaintenanceQuestionClient,
  MaintenanceQuestion,
} from '@kalos-core/kalos-rpc/MaintenanceQuestion';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT, API_FAILED_GENERAL_ERROR_MSG } from '../../../constants';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { Form, Schema, Options } from '../../ComponentsLibrary/Form';
import {
  makeFakeRows,
  getRPCFields,
  formatDate,
  loadUsersByIds,
  timestamp,
} from '../../../helpers';

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

type Entry = Reading.AsObject;
type MaintenanceEntry = MaintenanceQuestion.AsObject;

interface Props {
  serviceItemId: number;
  loggedUserId: number;
}

interface State {
  entries: Entry[];
  users: { [key: number]: User.AsObject };
  loading: boolean;
  error: boolean;
  saving: boolean;
  editedEntry?: Entry;
  deletingEntry?: Entry;
  editedMaintenanceEntry?: MaintenanceEntry;
  maintenanceQuestions: { [key: number]: MaintenanceEntry };
}

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

export class ServiceItemReadings extends PureComponent<Props, State> {
  ReadingClient: ReadingClient;
  UserClient: UserClient;
  MaintenanceQuestionClient: MaintenanceQuestionClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      entries: [],
      users: {},
      loading: true,
      error: false,
      saving: false,
      editedEntry: undefined,
      deletingEntry: undefined,
      maintenanceQuestions: {},
      editedMaintenanceEntry: undefined,
    };
    this.ReadingClient = new ReadingClient(ENDPOINT);
    this.UserClient = new UserClient(ENDPOINT);
    this.MaintenanceQuestionClient = new MaintenanceQuestionClient(ENDPOINT);
  }

  loadMaintenanceQuestions = async (readingIds: number[]) => {
    const maintenanceQuestions = await Promise.all(
      readingIds.map(async id => {
        const entry = new MaintenanceQuestion();
        entry.setReadingId(id);
        try {
          return await this.MaintenanceQuestionClient.Get(entry);
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

  load = async () => {
    this.setState({ loading: true });
    const { serviceItemId } = this.props;
    const entry = new Reading();
    entry.setServiceItemId(serviceItemId);
    try {
      const response = await this.ReadingClient.BatchGet(entry);
      const { resultsList } = response.toObject();
      const users = await loadUsersByIds(
        resultsList.map(({ userId }) => userId),
      );
      const maintenanceQuestions = await this.loadMaintenanceQuestions(
        resultsList.map(({ id }) => id),
      );
      this.setState({
        entries: resultsList.sort(sort),
        maintenanceQuestions,
        users,
        loading: false,
      });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.load();
  }

  setEditing = (editedEntry?: Entry) => () =>
    this.setState({ editedEntry, error: false });

  setEditingMaintenance = (editedMaintenanceEntry?: MaintenanceEntry) => () =>
    this.setState({ editedMaintenanceEntry, error: false });

  setDeleting = (deletingEntry?: Entry) => () =>
    this.setState({ deletingEntry });

  handleSave = async (data: Entry) => {
    const { serviceItemId, loggedUserId } = this.props;
    const { editedEntry } = this.state;
    if (editedEntry) {
      const isNew = !editedEntry.id;
      this.setState({ saving: true });
      const entry = new Reading();
      if (!isNew) {
        entry.setId(editedEntry.id);
      }
      entry.setServiceItemId(serviceItemId);
      entry.setDate(timestamp(true));
      entry.setUserId(loggedUserId);
      const fieldMaskList = ['setServiceItemId', 'setDate', 'setUserId'];
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        entry[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      entry.setFieldMaskList(fieldMaskList);
      try {
        await this.ReadingClient[isNew ? 'Create' : 'Update'](entry);
        this.setState({ saving: false });
        this.setEditing(undefined)();
        await this.load();
      } catch (e) {
        this.setState({ error: true, saving: false });
      }
    }
  };

  handleSaveMaintenance = async (data: MaintenanceEntry) => {
    const { editedMaintenanceEntry } = this.state;
    if (editedMaintenanceEntry) {
      const isNew = !editedMaintenanceEntry.id;
      this.setState({ saving: true });
      const entry = new MaintenanceQuestion();
      if (!isNew) {
        entry.setId(editedMaintenanceEntry.id);
      }
      entry.setReadingId(editedMaintenanceEntry.readingId);
      const fieldMaskList = ['setReadingId'];
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        entry[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      entry.setFieldMaskList(fieldMaskList);
      try {
        await this.MaintenanceQuestionClient[isNew ? 'Create' : 'Update'](
          entry,
        );
        this.setState({ saving: false });
        this.setEditingMaintenance()();
        await this.load();
      } catch (e) {
        this.setState({ error: true, saving: false });
      }
    }
  };

  handleDelete = async () => {
    const { deletingEntry } = this.state;
    this.setDeleting()();
    if (deletingEntry) {
      this.setState({ loading: true });
      const maintenanceQuestion = new MaintenanceQuestion();
      maintenanceQuestion.setReadingId(deletingEntry.id);
      await this.MaintenanceQuestionClient.Delete(maintenanceQuestion);
      const entry = new Reading();
      entry.setId(deletingEntry.id);
      await this.ReadingClient.Delete(entry);
      await this.load();
    }
  };

  render() {
    const {
      state,
      setEditing,
      handleSave,
      handleDelete,
      setDeleting,
      setEditingMaintenance,
      handleSaveMaintenance,
    } = this;
    const {
      entries,
      users,
      loading,
      saving,
      editedEntry,
      deletingEntry,
      error,
      maintenanceQuestions,
      editedMaintenanceEntry,
    } = state;
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
                userId === 0
                  ? ''
                  : ` - ${users[userId].firstname} ${users[userId].lastname}`,
              ].join(' '),
              actions: [
                <IconButton
                  key={0}
                  style={{ marginLeft: 4 }}
                  size="small"
                  onClick={setEditingMaintenance(
                    maintenanceQuestions[id] ||
                      newMaintenanceQuestion.toObject(),
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
      <div style={{ width: 500, marginLeft: 8 }}>
        {editedMaintenanceEntry !== undefined ? (
          <Form<MaintenanceEntry>
            title={`${editedMaintenanceEntry.id ? 'Edit' : 'Add'} Maintenance`}
            schema={SCHEMA_MAINTENANCE}
            data={editedMaintenanceEntry}
            onSave={handleSaveMaintenance}
            onClose={setEditingMaintenance()}
            disabled={saving}
          >
            {error ? API_FAILED_GENERAL_ERROR_MSG : undefined}
          </Form>
        ) : editedEntry ? (
          <Form<Entry>
            title={`${editedEntry.id ? 'Edit' : 'Add'} Reading`}
            schema={SCHEMA_READING}
            data={editedEntry}
            onSave={handleSave}
            onClose={setEditing()}
            disabled={saving}
          >
            {error ? API_FAILED_GENERAL_ERROR_MSG : undefined}
          </Form>
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
            />
            <div
              style={{
                maxHeight: 660,
                overflowY: 'auto',
              }}
            >
              <InfoTable data={data} loading={loading} hoverable />
            </div>
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
              maintenanceQuestions[deletingEntry.id]
                ? 'Maintenance'
                : 'Service',
              deletingEntry.userId === 0
                ? ''
                : ` - ${users[deletingEntry.userId].firstname} ${
                    users[deletingEntry.userId].lastname
                  }`,
            ]
              .join(' ')
              .trim()}
          />
        )}
      </div>
    );
  }
}
