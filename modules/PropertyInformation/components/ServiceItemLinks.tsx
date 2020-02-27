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
}

const SCHEMA: Schema<Entry>[] = [
  {
    label: 'Link',
    name: 'url',
    required: true,
    helperText: 'Be sure to include "http://"',
  },
  {
    label: 'Description',
    name: 'description',
    helperText: 'Keep this very short: 2 - 4 words',
  },
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

  handleSave = async (data: Entry) => {
    const { editedEntry } = this.state;
    if (editedEntry) {
      this.setState({ saving: true });
      const entry = new PropLink();
      entry.setId(editedEntry.id);
      const fieldMaskList = [];
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        entry[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      entry.setFieldMaskList(fieldMaskList);
      await this.SiLinkClient.Update(entry);
      await this.load();
      this.setState({ saving: false });
      this.setEditing(undefined)();
    }
  };

  render() {
    const { props, state, setEditing, handleSave } = this;
    const { title, onClose } = props;
    const { entries, loading, saving, editedEntry } = state;
    const data: Data = loading
      ? makeFakeRows()
      : entries.map(entry => {
          const { id, url, description } = entry;
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
                <IconButton key={2} style={{ marginLeft: 4 }} size="small">
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
          buttons={[
            {
              label: 'Add Link',
            },
            { label: 'Close', onClick: onClose },
          ]}
        />
        <InfoTable data={data} loading={loading} hoverable />
        {editedEntry && (
          <Modal open onClose={setEditing(undefined)}>
            <Form<Entry>
              title="Edit Service Item Link"
              schema={SCHEMA}
              data={editedEntry}
              onSave={handleSave}
              onClose={setEditing(undefined)}
              disabled={saving}
            />
          </Modal>
        )}
      </div>
    );
  }
}
