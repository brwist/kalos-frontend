import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { PropLinkClient, PropLink } from '@kalos-core/kalos-rpc/PropLink';
import { ENDPOINT } from '../../../constants';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Modal } from '../../ComponentsLibrary/Modal';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { makeFakeRows, getRPCFields } from '../../../helpers';

type Entry = PropLink.AsObject;

interface Props {
  title?: string;
  serviceItemId: number;
  onClose: () => void;
}

interface State {
  entries: Entry[];
  loading: boolean;
  error: boolean;
  saving: boolean;
  editedEntry?: Entry;
  deletingEntry?: Entry;
}

const SCHEMA: Schema<Entry> = [
  [
    {
      label: 'Link',
      name: 'url',
      required: true,
      helperText: 'Be sure to include "http://"',
    },
  ],
  [
    {
      label: 'Description',
      name: 'description',
      helperText: 'Keep this very short: 2 - 4 words',
    },
  ],
];

export class ServiceItemLinks extends PureComponent<Props, State> {
  SiLinkClient: PropLinkClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      entries: [],
      loading: true,
      error: false,
      saving: false,
      editedEntry: undefined,
      deletingEntry: undefined,
    };
    this.SiLinkClient = new PropLinkClient(ENDPOINT);
  }

  load = async () => {
    this.setState({ loading: true });
    const { serviceItemId } = this.props;
    const entry = new PropLink();
    entry.setPropertyId(serviceItemId);
    try {
      const response = await this.SiLinkClient.BatchGet(entry);
      const entries = response.toObject().resultsList;
      this.setState({ entries, loading: false });
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
      const isNew = !editedEntry.id;
      this.setState({ saving: true });
      const entry = new PropLink();
      if (!isNew) {
        entry.setId(editedEntry.id);
      }
      entry.setPropertyId(serviceItemId);
      const fieldMaskList = ['setPropertyId'];
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        entry[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      entry.setFieldMaskList(fieldMaskList);
      await this.SiLinkClient[isNew ? 'Create' : 'Update'](entry);
      this.setState({ saving: false });
      this.setEditing(undefined)();
      await this.load();
    }
  };

  handleDelete = async () => {
    const { deletingEntry } = this.state;
    this.setDeleting(undefined)();
    if (deletingEntry) {
      this.setState({ loading: true });
      const entry = new PropLink();
      entry.setId(deletingEntry.id);
      await this.SiLinkClient.Delete(entry);
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
    const { title, onClose } = props;
    const { entries, loading, saving, editedEntry, deletingEntry } = state;
    const data: Data = loading
      ? makeFakeRows()
      : entries.map(entry => {
          const { url, description } = entry;
          return [
            {
              value: description || url,
              actions: [
                <a key={0} href={url} target="_blank">
                  <IconButton style={{ marginLeft: 4 }} size="small">
                    <SearchIcon />
                  </IconButton>
                </a>,
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
      <div>
        <SectionBar
          title={`Service Item Links: ${title}`}
          actions={[
            {
              label: 'Add Link',
              onClick: setEditing({} as Entry),
            },
            {
              label: 'Close',
              onClick: onClose,
              variant: 'outlined',
            },
          ]}
          fixedActions
        />
        <InfoTable data={data} loading={loading} hoverable />
        {editedEntry && (
          <Modal open onClose={setEditing(undefined)}>
            <Form<Entry>
              title={`${editedEntry.id ? 'Edit' : 'Add'} Service Item Link`}
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
            kind="Service Item Link"
            name={deletingEntry.description || deletingEntry.url}
          />
        )}
      </div>
    );
  }
}
