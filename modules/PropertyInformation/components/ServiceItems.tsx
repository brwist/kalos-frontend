import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {
  ServiceItemClient,
  ServiceItem,
} from '@kalos-core/kalos-rpc/ServiceItem';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { makeFakeRows, getRPCFields } from '../../../helpers';
import { ServiceItemLinks } from './ServiceItemLinks';

type Entry = ServiceItem.AsObject;

const SCHEMA: Schema<Entry> = [
  [
    { label: 'System Description', name: 'type', required: true },
    { label: 'Start Date', name: 'startDate' },
    { label: 'Item Location', name: 'location' },
  ],
  [{ label: 'Item #1', headline: true }],
  [
    { label: 'Item', name: 'item' },
    { label: 'Brand', name: 'brand' },
    { label: 'Model #', name: 'model' },
    { label: 'Serial #', name: 'serial' },
  ],
  [{ label: 'Item #2', headline: true }],
  [
    { label: 'Item', name: 'item2' },
    { label: 'Brand', name: 'brand2' },
    { label: 'Model #', name: 'model2' },
    { label: 'Serial #', name: 'serial2' },
  ],
  [{ label: 'Item #3', headline: true }],
  [
    { label: 'Item', name: 'item3' },
    { label: 'Brand', name: 'brand3' },
    { label: 'Model #', name: 'model3' },
    { label: 'Serial #', name: 'serial3' },
  ],
  [{ label: 'Filter', headline: true }],
  [
    { label: 'Width', name: 'filterWidth' },
    { label: 'Length', name: 'filterLength' },
    { label: 'Thickness', name: 'filterThickness' },
    { label: 'Quantity', name: 'filterQty' },
  ],
  [
    { label: 'Part #', name: 'filterPartNumber' },
    { label: 'Vendor', name: 'filterVendor' },
  ],
  [{ label: 'Notes', headline: true }],
  [{ label: 'Additional Notes', name: 'notes', multiline: true }],
];

interface Props {
  className?: string;
  userID: number;
  propertyId: number;
}

interface State {
  entries: Entry[];
  loading: boolean;
  error: boolean;
  editing?: Entry;
  deletingEntry?: Entry;
  saving: boolean;
  linkId?: number;
  count: number;
  page: number;
}

const sort = (a: Entry, b: Entry) => {
  if (a.sortOrder < b.sortOrder) return -1;
  if (a.sortOrder > b.sortOrder) return 1;
  return 0;
};

export class ServiceItems extends PureComponent<Props, State> {
  ServiceItemClient: ServiceItemClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      entries: [],
      loading: true,
      error: false,
      editing: undefined,
      deletingEntry: undefined,
      saving: false,
      count: 0,
      page: 0,
    };
    this.ServiceItemClient = new ServiceItemClient(ENDPOINT);
  }

  load = async () => {
    this.setState({ loading: true });
    const { propertyId } = this.props;
    const entry = new ServiceItem();
    entry.setPropertyId(propertyId);
    try {
      const response = await this.ServiceItemClient.BatchGet(entry);
      const { resultsList, totalCount: count } = response.toObject();
      this.setState({ entries: resultsList.sort(sort), count, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.load();
  }

  handleSave = async (data: Entry) => {
    const { propertyId } = this.props;
    const { editing, entries } = this.state;
    if (editing) {
      this.setState({ saving: true });
      const entry = new ServiceItem();
      entry.setPropertyId(propertyId);
      const fieldMaskList = ['setPropertyId'];
      const isNew = !editing.id;
      if (!isNew) {
        entry.setId(editing.id);
      } else {
        const sortOrder = Math.max(
          entries[entries.length - 1].sortOrder + 1,
          entries.length
        );
        entry.setSortOrder(sortOrder);
        fieldMaskList.push('setSortOrder');
      }
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        entry[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      entry.setFieldMaskList(fieldMaskList);
      await this.ServiceItemClient[isNew ? 'Create' : 'Update'](entry);
      this.setState({ saving: false });
      this.setEditing()();
      await this.load();
    }
  };

  handleDelete = async () => {
    const { propertyId } = this.props;
    const { deletingEntry } = this.state;
    this.setDeleting()();
    if (deletingEntry) {
      this.setState({ loading: true });
      const entry = new ServiceItem();
      entry.setId(deletingEntry.id);
      entry.setPropertyId(propertyId);
      entry.setFieldMaskList(['setPropertyId']);
      await this.ServiceItemClient.Delete(entry);
      await this.load();
    }
  };

  handleReorder = (idx: number, step: number) => async () => {
    this.setState({ loading: true });
    const { entries } = this.state;
    const currentItem = entries[idx];
    const nextItem = entries[idx + step];
    const entry = new ServiceItem();
    entry.setFieldMaskList(['SortOrder']);
    entry.setId(currentItem.id);
    entry.setSortOrder(nextItem.sortOrder);
    await this.ServiceItemClient.Update(entry);
    entry.setId(nextItem.id);
    entry.setSortOrder(currentItem.sortOrder);
    await this.ServiceItemClient.Update(entry);
    await this.load();
  };

  handleSetLinkId = (linkId?: number) => () => this.setState({ linkId });

  handleChangePage = (page: number) => this.setState({ page }, this.load);

  setEditing = (editing?: Entry) => () => this.setState({ editing });

  setDeleting = (deletingEntry?: Entry) => () =>
    this.setState({ deletingEntry });

  render() {
    const {
      props,
      state,
      handleReorder,
      handleSetLinkId,
      handleChangePage,
      setEditing,
      handleSave,
      setDeleting,
      handleDelete,
    } = this;
    const { className } = props;
    const {
      entries,
      loading,
      error,
      linkId,
      count,
      page,
      editing,
      saving,
      deletingEntry,
    } = state;
    const data: Data = loading
      ? makeFakeRows()
      : entries.map((entry, idx) => {
          const { id, type: value } = entry;
          return [
            {
              value: (
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
                  <span>{value}</span>
                </>
              ),
              actions: [
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
      <div className={className}>
        <SectionBar
          title="Service Items"
          buttons={[
            {
              label: 'Add Service Item',
              onClick: setEditing({} as Entry),
            },
          ]}
          pagination={{
            count,
            page,
            rowsPerPage: ROWS_PER_PAGE,
            onChangePage: handleChangePage,
          }}
        />
        <InfoTable
          data={data}
          loading={loading}
          error={error}
          compact
          hoverable
        />
        {linkId && (
          <Modal open onClose={handleSetLinkId(undefined)}>
            <ServiceItemLinks
              title={entries.find(({ id }) => id === linkId)?.type}
              serviceItemId={linkId}
              onClose={handleSetLinkId(undefined)}
            />
          </Modal>
        )}
        {editing && (
          <Modal open onClose={setEditing()}>
            <Form<Entry>
              title={`${editing.id ? 'Edit' : 'Add'} Service Item`}
              schema={SCHEMA}
              data={editing}
              onSave={handleSave}
              onClose={setEditing()}
              disabled={saving}
            />
          </Modal>
        )}
        {deletingEntry && (
          <ConfirmDelete
            open
            onClose={setDeleting()}
            onConfirm={handleDelete}
            kind="Service Item"
            name={deletingEntry.type}
          />
        )}
      </div>
    );
  }
}
