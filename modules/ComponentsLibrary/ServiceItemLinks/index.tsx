import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { PropLinkClient, PropLink } from '@kalos-core/kalos-rpc/PropLink';
import { ENDPOINT } from '../../../constants';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { Modal } from '../Modal';
import { ConfirmDelete } from '../ConfirmDelete';
import { Form, Schema } from '../Form';
import {
  makeFakeRows,
  getRPCFields,
  makeSafeFormObject,
  PropLinkClientService,
} from '../../../helpers';

interface Props {
  kind: string;
  title?: string;
  serviceItemId: number;
  onClose: () => void;
  viewedAsCustomer?: boolean;
}

interface State {
  entries: PropLink[];
  loading: boolean;
  error: boolean;
  saving: boolean;
  editedEntry?: PropLink;
  deletingEntry?: PropLink;
}

const SCHEMA: Schema<PropLink> = [
  [
    {
      label: 'Link',
      name: 'getUrl',
      required: true,
      helperText: 'Be sure to include "http://"',
    },
  ],
  [
    {
      label: 'Description',
      name: 'getDescription',
      helperText: 'Keep this very short: 2 - 4 words',
    },
  ],
];

export class ServiceItemLinks extends PureComponent<Props, State> {
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
  }

  load = async () => {
    this.setState({ loading: true });
    const { serviceItemId } = this.props;
    const entry = new PropLink();
    entry.setPropertyId(serviceItemId);
    try {
      const response = await PropLinkClientService.BatchGet(entry);
      const entries = response.getResultsList();
      this.setState({ entries, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.load();
  }

  setEditing = (editedEntry?: PropLink) => () => this.setState({ editedEntry });

  setDeleting = (deletingEntry?: PropLink) => () =>
    this.setState({ deletingEntry });

  handleSave = async (data: PropLink) => {
    data = makeSafeFormObject(data, new PropLink());
    const { serviceItemId } = this.props;
    const { editedEntry } = this.state;
    if (editedEntry) {
      const isNew = !editedEntry.getId();
      this.setState({ saving: true });
      const entry = data;
      if (!isNew) {
        entry.setId(editedEntry.getId());
      }
      // entry.setPropertyId(serviceItemId);
      const fieldMaskList = ['PropertyId'];
      // for (const fieldName in data) {
      //   const { upperCaseProp, methodName } = getRPCFields(fieldName);
      //   // @ts-ignore
      //   entry[methodName](data[fieldName]);
      //   fieldMaskList.push(upperCaseProp);
      // }
      entry.setFieldMaskList(fieldMaskList);
      try {
        await PropLinkClientService[isNew ? 'Create' : 'Update'](entry);
      } catch (err) {
        console.error(
          `An error occurred while ${
            isNew ? 'creating' : 'updating'
          } a prop link: ${err}`,
        );
      }
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
      entry.setId(deletingEntry.getId());
      try {
        await PropLinkClientService.Delete(entry);
      } catch (err) {
        console.error(`An error occurred while deleting a prop link: ${err}`);
      }
      await this.load();
    }
  };

  render() {
    const { props, state, setEditing, handleSave, handleDelete, setDeleting } =
      this;
    const { kind, title = '', onClose, viewedAsCustomer = false } = props;
    const { entries, loading, saving, editedEntry, deletingEntry } = state;
    const data: Data = loading
      ? makeFakeRows()
      : entries.map(entry => {
          return [
            {
              value: entry.getDescription() || entry.getUrl(),
              onClick: () => window.open(entry.getUrl()),
              actions: [
                <a
                  key="view"
                  href={entry.getUrl()}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconButton style={{ marginLeft: 4 }} size="small">
                    <SearchIcon />
                  </IconButton>
                </a>,
                ...(viewedAsCustomer
                  ? []
                  : [
                      <IconButton
                        key="edit"
                        style={{ marginLeft: 4 }}
                        size="small"
                        onClick={setEditing(entry)}
                      >
                        <EditIcon />
                      </IconButton>,
                      <IconButton
                        key="delete"
                        style={{ marginLeft: 4 }}
                        size="small"
                        onClick={setDeleting(entry)}
                      >
                        <DeleteIcon />
                      </IconButton>,
                    ]),
              ],
            },
          ];
        });
    return (
      <div>
        <SectionBar
          title={`${kind}s`}
          subtitle={title}
          actions={[
            ...(viewedAsCustomer
              ? []
              : [
                  {
                    label: 'Add',
                    onClick: setEditing(new PropLink()),
                  },
                ]),
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
            <Form<PropLink>
              title={`${editedEntry.getId() ? 'Edit' : 'Add'} ${kind}`}
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
            kind={kind}
            name={deletingEntry.getDescription() || deletingEntry.getUrl()}
          />
        )}
      </div>
    );
  }
}
