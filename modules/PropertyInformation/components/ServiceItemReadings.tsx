import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ReadingClient, Reading } from '@kalos-core/kalos-rpc/Reading';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../../constants';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Modal } from '../../ComponentsLibrary/Modal';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import {
  makeFakeRows,
  getRPCFields,
  formatDate,
  getUsersByIds,
} from '../../../helpers';

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
  //   [
  //     {
  //       label: 'Link',
  //       name: 'date',
  //       required: true,
  //       helperText: 'Be sure to include "http://"',
  //     },
  //   ],
  //   [
  //     {
  //       label: 'Description',
  //       name: 'description',
  //       helperText: 'Keep this very short: 2 - 4 words',
  //     },
  //   ],
];

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
      const entries = response.toObject().resultsList;
      const users = await getUsersByIds(entries.map(({ userId }) => userId));
      this.setState({ entries, users, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.load();
  }

  setEditing = (editedEntry?: Entry) => () => this.setState({ editedEntry });

  setDeleting = (deletingEntry?: Entry) => () =>
    this.setState({ deletingEntry });

  handleSave = async (data: Entry) => {
    const { serviceItemId } = this.props;
    const { editedEntry } = this.state;
    if (editedEntry) {
      //   const isNew = !editedEntry.id;
      //   this.setState({ saving: true });
      //   const entry = new PropLink();
      //   if (!isNew) {
      //     entry.setId(editedEntry.id);
      //   }
      //   entry.setPropertyId(serviceItemId);
      //   const fieldMaskList = ['setPropertyId'];
      //   for (const fieldName in data) {
      //     const { upperCaseProp, methodName } = getRPCFields(fieldName);
      //     // @ts-ignore
      //     entry[methodName](data[fieldName]);
      //     fieldMaskList.push(upperCaseProp);
      //   }
      //   entry.setFieldMaskList(fieldMaskList);
      //   await this.SiLinkClient[isNew ? 'Create' : 'Update'](entry);
      //   this.setState({ saving: false });
      //   this.setEditing(undefined)();
      await this.load();
    }
  };

  handleDelete = async () => {
    const { deletingEntry } = this.state;
    this.setDeleting(undefined)();
    if (deletingEntry) {
      //   this.setState({ loading: true });
      //   const entry = new PropLink();
      //   entry.setId(deletingEntry.id);
      //   await this.SiLinkClient.Delete(entry);
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
      <div style={{ width: 400, marginLeft: 8 }}>
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
        {editedEntry && (
          <Modal open onClose={setEditing(undefined)}>
            <Form<Entry>
              title={`${editedEntry.id ? 'Edit' : 'Add'} Reading`}
              schema={SCHEMA}
              data={editedEntry}
              onSave={handleSave}
              onClose={setEditing(undefined)}
              disabled={saving}
            />
          </Modal>
        )}
        {deletingEntry && (
          <ConfirmDelete
            open
            onClose={setDeleting(undefined)}
            onConfirm={handleDelete}
            kind="Reading"
            name={formatDate(deletingEntry.date)}
          />
        )}
      </div>
    );
  }
}
