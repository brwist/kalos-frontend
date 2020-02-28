import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ReadingClient, Reading } from '@kalos-core/kalos-rpc/Reading';
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
  getUsersByIds,
  timestamp,
} from '../../../helpers';

const REFRIGERANT_TYPES: Options = [
  { label: 'R410a', value: '1' },
  { label: 'R22', value: '2' },
  { label: 'Other', value: '3' },
];

type Entry = Reading.AsObject;

interface Props {
  serviceItemId: number;
}

interface State {
  entries: Entry[];
  users: { [key: number]: User.AsObject };
  loading: boolean;
  error: boolean;
  saving: boolean;
  editedEntry?: Entry;
  deletingEntry?: Entry;
}

const SCHEMA: Schema<Entry> = [
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

const sort = (a: Entry, b: Entry) => {
  if (a.date > b.date) return -1;
  if (a.date < b.date) return 1;
  return 0;
};

export class ServiceItemReadings extends PureComponent<Props, State> {
  ReadingClient: ReadingClient;
  UserClient: UserClient;

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
    };
    this.ReadingClient = new ReadingClient(ENDPOINT);
    this.UserClient = new UserClient(ENDPOINT);
  }

  load = async () => {
    this.setState({ loading: true });
    const { serviceItemId } = this.props;
    const entry = new Reading();
    entry.setServiceItemId(serviceItemId);
    try {
      const response = await this.ReadingClient.BatchGet(entry);
      const { resultsList } = response.toObject();
      const users = await getUsersByIds(
        resultsList.map(({ userId }) => userId)
      );
      this.setState({ entries: resultsList.sort(sort), users, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.load();
  }

  setEditing = (editedEntry?: Entry) => () =>
    this.setState({ editedEntry, error: false });

  setDeleting = (deletingEntry?: Entry) => () =>
    this.setState({ deletingEntry });

  handleSave = async (data: Entry) => {
    const { serviceItemId } = this.props;
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
      const fieldMaskList = ['setServiceItemId', 'setDate'];
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

  handleDelete = async () => {
    const { deletingEntry } = this.state;
    this.setDeleting()();
    if (deletingEntry) {
      this.setState({ loading: true });
      const entry = new Reading();
      entry.setId(deletingEntry.id);
      await this.ReadingClient.Delete(entry);
      await this.load();
    }
  };

  render() {
    const {
      props,
      state,
      setEditing,
      handleSave,
      handleDelete,
      setDeleting,
    } = this;
    const {
      entries,
      users,
      loading,
      saving,
      editedEntry,
      deletingEntry,
      error,
    } = state;
    const data: Data = loading
      ? makeFakeRows()
      : entries.map(entry => {
          const { date, userId } = entry;
          return [
            {
              value: [
                formatDate(date),
                userId === 0
                  ? ''
                  : `${users[userId].firstname} ${users[userId].lastname}`,
              ].join(' '),
              actions: [
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
        {editedEntry ? (
          <Form<Entry>
            title={`${editedEntry.id ? 'Edit' : 'Add'} Reading`}
            schema={SCHEMA}
            data={editedEntry}
            onSave={handleSave}
            onClose={setEditing(undefined)}
            disabled={saving}
          >
            {error ? API_FAILED_GENERAL_ERROR_MSG : undefined}
          </Form>
        ) : (
          <>
            <SectionBar
              title="Readings"
              buttons={[
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
            onClose={setDeleting(undefined)}
            onConfirm={handleDelete}
            kind="Reading"
            name={[
              formatDate(deletingEntry.date),
              deletingEntry.userId === 0
                ? ''
                : `${users[deletingEntry.userId].firstname} ${
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
