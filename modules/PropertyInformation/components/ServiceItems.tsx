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
import { makeFakeRows } from '../../../helpers';
import { ServiceItemLinks } from './ServiceItemLinks';

type Entry = ServiceItem.AsObject;

interface Props {
  className?: string;
  userID: number;
  propertyId: number;
}

interface State {
  entries: Entry[];
  loading: boolean;
  error: boolean;
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
      count: 0,
      page: 0,
    };
    this.ServiceItemClient = new ServiceItemClient(ENDPOINT);
  }

  loadEntry = async () => {
    this.setState({ loading: true });
    const { propertyId } = this.props;
    const entry = new ServiceItem();
    entry.setPropertyId(propertyId);
    try {
      const response = await this.ServiceItemClient.BatchGet(entry);
      const { resultsList: entries, totalCount: count } = response.toObject();
      this.setState({ entries, count, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.loadEntry();
  }

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
    await this.loadEntry();
  };

  handleSetLinkId = (linkId?: number) => () => this.setState({ linkId });

  handleChangePage = (page: number) => {
    this.setState({ page }, this.loadEntry);
  };

  render() {
    const {
      props,
      state,
      handleReorder,
      handleSetLinkId,
      handleChangePage,
    } = this;
    const { className } = props;
    const { entries, loading, error, linkId, count, page } = state;
    const data: Data = loading
      ? makeFakeRows()
      : entries.sort(sort).map(({ id, type: value }, idx) => [
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
              <IconButton key={1} style={{ marginLeft: 4 }} size="small">
                <EditIcon />
              </IconButton>,
              <IconButton key={2} style={{ marginLeft: 4 }} size="small">
                <DeleteIcon />
              </IconButton>,
            ],
          },
        ]);
    return (
      <div className={className}>
        <SectionBar
          title="Service Items"
          buttons={[{ label: 'Add Service Item' }]}
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
      </div>
    );
  }
}
