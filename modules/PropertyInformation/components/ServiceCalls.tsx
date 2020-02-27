import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import {
  InfoTable,
  Data,
  Columns,
  Dir,
} from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { formatTime, formatDate, makeFakeRows } from '../../../helpers';

type Entry = Event.AsObject;

interface Props {
  className?: string;
  userID: number;
  propertyId: number;
}

interface State {
  entries: Entry[];
  loading: boolean;
  error: boolean;
  orderByFields: (keyof Entry)[];
  orderByDBField: string;
  dir: Dir;
  count: number;
  page: number;
}

export class ServiceCalls extends PureComponent<Props, State> {
  EventClient: EventClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      entries: [],
      loading: true,
      error: false,
      dir: 'ASC',
      orderByFields: ['dateStarted'],
      orderByDBField: 'date_started',
      count: 0,
      page: 0,
    };
    this.EventClient = new EventClient(ENDPOINT);
  }

  loadEntry = async () => {
    this.setState({ loading: true });
    const { propertyId } = this.props;
    const { dir, orderByDBField, page } = this.state;
    const entry = new Event();
    entry.setPropertyId(propertyId);
    entry.setOrderBy(orderByDBField);
    entry.setOrderDir(dir);
    entry.setPageNumber(page);
    try {
      const response = await this.EventClient.BatchGet(entry);
      const { resultsList: entries, totalCount: count } = response.toObject();
      this.setState({ entries, count, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  handleOrder = (
    orderByDBField: string,
    orderByFields: (keyof Entry)[]
  ) => () => {
    this.setState(
      {
        page: 0,
        orderByFields,
        orderByDBField,
        dir:
          orderByDBField !== this.state.orderByDBField
            ? 'ASC'
            : this.state.dir === 'ASC'
            ? 'DESC'
            : 'ASC',
      },
      () => this.loadEntry()
    );
  };

  async componentDidMount() {
    await this.loadEntry();
  }

  sort = (a: Entry, b: Entry) => {
    const { orderByFields, dir } = this.state;
    const A = orderByFields
      .map(field => a[field] as string)
      .join(' ')
      .trim()
      .toUpperCase();
    const B = orderByFields
      .map(field => b[field] as string)
      .join(' ')
      .trim()
      .toUpperCase();
    if (A > B) return dir === 'ASC' ? 1 : -1;
    if (A < B) return dir === 'ASC' ? -1 : 1;
    return 0;
  };

  handleChangePage = (page: number) => {
    this.setState({ page }, this.loadEntry);
  };

  render() {
    const { props, state, handleOrder, sort, handleChangePage } = this;
    const { userID, propertyId, className } = props;
    const { entries, loading, error, dir, orderByDBField, count, page } = state;
    const columns: Columns = [
      {
        name: 'Date / Time',
        dir: orderByDBField === 'date_started' ? dir : undefined,
        onClick: handleOrder('date_started', ['dateStarted', 'timeStarted']),
      },
      {
        name: 'Job Status',
        dir: orderByDBField === 'log_jobStatus' ? dir : undefined,
        onClick: handleOrder('log_jobStatus', ['logJobStatus']),
      },
      {
        name: 'Job Type / Subtype',
        dir: orderByDBField === 'job_type_id, job_subtype_id' ? dir : undefined,
        onClick: handleOrder('job_type_id, job_subtype_id', [
          'jobType',
          'jobSubtype',
        ]),
      },
      {
        name: 'Job Number',
        dir: orderByDBField === 'log_jobNumber' ? dir : undefined,
        onClick: handleOrder('log_jobNumber', ['logJobNumber']),
      },
      {
        name: 'Contract Number',
        dir: orderByDBField === 'contract_number' ? dir : undefined,
        onClick: handleOrder('contract_number', ['contractNumber']),
      },
    ];
    const data: Data = loading
      ? makeFakeRows(5)
      : entries
          .sort(sort)
          .map(
            ({
              dateStarted,
              timeStarted,
              timeEnded,
              jobType,
              jobSubtype,
              logJobStatus,
              logJobNumber,
              contractNumber,
              color,
            }) => [
              {
                value:
                  formatDate(dateStarted) +
                  ' ' +
                  formatTime(timeStarted) +
                  ' - ' +
                  formatTime(timeEnded),
              },
              {
                value: (
                  <>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        backgroundColor: '#' + color,
                        marginRight: 6,
                        borderRadius: '50%',
                      }}
                    />
                    {logJobStatus}
                  </>
                ),
              },
              { value: jobType + (jobSubtype ? ' / ' + jobSubtype : '') },
              { value: logJobNumber },
              {
                value: contractNumber,
                actions: [
                  <IconButton key={2} style={{ marginLeft: 4 }} size="small">
                    <DeleteIcon />
                  </IconButton>,
                ],
              },
            ]
          );
    return (
      <div className={className}>
        <SectionBar
          title="Service Calls"
          buttons={[
            {
              label: 'New Service Call',
              url: [
                '/index.cfm?action=admin:service.addserviceCall',
                `user_id=${userID}`,
                `property_id=${propertyId}`,
                'unique=207D906B-05C0-B58E-B451566171C79356', // FIXME set proper unique
              ].join('&'),
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
          columns={columns}
          data={data}
          loading={loading}
          error={error}
          compact
          hoverable
        />
      </div>
    );
  }
}
