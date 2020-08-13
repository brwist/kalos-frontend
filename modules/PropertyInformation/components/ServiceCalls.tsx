import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { User } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import {
  formatTime,
  formatDate,
  makeFakeRows,
  OrderDir,
  getPropertyAddress,
} from '../../../helpers';

type Entry = Event.AsObject;

interface Props {
  className?: string;
  userID: number;
  propertyId?: number;
  viewedAsCustomer?: boolean;
}

interface State {
  entries: Entry[];
  loading: boolean;
  error: boolean;
  deletingEntry?: Entry;
  orderByFields: (keyof Entry)[];
  orderByDBField: string;
  dir: OrderDir;
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
      deletingEntry: undefined,
      dir: 'ASC',
      orderByFields: ['dateStarted'],
      orderByDBField: 'date_started',
      count: 0,
      page: 0,
    };
    this.EventClient = new EventClient(ENDPOINT);
  }

  load = async () => {
    this.setState({ loading: true });
    const { propertyId, userID } = this.props;
    const { dir, orderByDBField, page } = this.state;
    const entry = new Event();
    const reqCust = new User();
    reqCust.setId(userID);
    entry.setCustomer(reqCust);
    if (propertyId) {
      entry.setPropertyId(propertyId);
    }
    entry.setOrderBy(orderByDBField);
    entry.setOrderDir(dir);
    entry.setPageNumber(page);
    entry.setIsActive(1);
    try {
      const response = await this.EventClient.BatchGet(entry);
      const { resultsList, totalCount: count } = response.toObject();
      this.setState({
        entries: resultsList.sort(this.sort),
        count,
        loading: false,
      });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  handleOrder = (
    orderByDBField: string,
    orderByFields: (keyof Entry)[],
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
      this.load,
    );
  };

  handleDelete = async () => {
    // FIXME: service call is not actually deleted for some reason
    const { deletingEntry } = this.state;
    this.setDeleting()();
    if (deletingEntry) {
      this.setState({ loading: true });
      const entry = new Event();
      entry.setId(deletingEntry.id);
      await this.EventClient.Delete(entry);
      await this.load();
    }
  };

  async componentDidMount() {
    await this.load();
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

  setDeleting = (deletingEntry?: Entry) => () =>
    this.setState({ deletingEntry });

  handleChangePage = (page: number) => {
    this.setState({ page }, this.load);
  };

  handleRowClick = (id: number) => () => {
    const { userID, propertyId } = this.props;
    window.location.href = [
      '/index.cfm?action=admin:service.editServiceCall',
      `id=${id}`,
      `user_id=${userID}`,
      `property_id=${propertyId}`,
    ].join('&');
  };

  render() {
    const {
      props,
      state,
      handleOrder,
      handleChangePage,
      handleRowClick,
      setDeleting,
      handleDelete,
    } = this;
    const { userID, propertyId, className, viewedAsCustomer = false } = props;
    const {
      entries,
      loading,
      error,
      dir,
      orderByDBField,
      count,
      page,
      deletingEntry,
    } = state;
    const columns: Columns = viewedAsCustomer
      ? [
          { name: 'Date / Time' },
          { name: 'Address' },
          { name: 'Bried Description' },
          { name: 'Status' },
        ]
      : [
          {
            name: 'Date / Time',
            dir: orderByDBField === 'date_started' ? dir : undefined,
            onClick: handleOrder('date_started', [
              'dateStarted',
              'timeStarted',
            ]),
          },
          {
            name: 'Job Status',
            dir: orderByDBField === 'log_jobStatus' ? dir : undefined,
            onClick: handleOrder('log_jobStatus', ['logJobStatus']),
          },
          {
            name: 'Job Type / Subtype',
            dir:
              orderByDBField === 'job_type_id, job_subtype_id'
                ? dir
                : undefined,
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
      ? makeFakeRows(viewedAsCustomer ? 4 : 5)
      : entries.map(entry => {
          const {
            id,
            dateStarted,
            timeStarted,
            timeEnded,
            jobType,
            jobSubtype,
            logJobStatus,
            logJobNumber,
            contractNumber,
            color,
            property,
            name,
          } = entry;
          const dateValue =
            formatDate(dateStarted) +
            ' ' +
            formatTime(timeStarted) +
            ' - ' +
            formatTime(timeEnded);
          const statusValue = (
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
          );
          if (viewedAsCustomer)
            return [
              { value: dateValue },
              { value: getPropertyAddress(property) },
              { value: name },
              { value: statusValue },
            ];
          return [
            {
              value: dateValue,
              onClick: handleRowClick(id),
            },
            {
              value: statusValue,
              onClick: handleRowClick(id),
            },
            {
              value: jobType + (jobSubtype ? ' / ' + jobSubtype : ''),
              onClick: handleRowClick(id),
            },
            {
              value: logJobNumber,
              onClick: handleRowClick(id),
            },
            {
              value: contractNumber,
              actions: [
                <IconButton
                  key={2}
                  style={{ marginLeft: 4 }}
                  size="small"
                  onClick={setDeleting(entry)}
                >
                  <DeleteIcon />
                </IconButton>,
              ],
              onClick: handleRowClick(id),
            },
          ];
        });
    return (
      <div className={className}>
        <SectionBar
          title={`${viewedAsCustomer ? 'Active ' : ''}Service Calls`}
          actions={[
            {
              label: 'Add Service Call',
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
          fixedActions
        >
          <InfoTable
            columns={columns}
            data={data}
            loading={loading}
            error={error}
          />
        </SectionBar>
        {deletingEntry && (
          <ConfirmDelete
            open
            onClose={setDeleting()}
            onConfirm={handleDelete}
            kind="Service Call"
            name={
              deletingEntry.jobType +
              (deletingEntry.jobSubtype
                ? ' / ' + deletingEntry.jobSubtype
                : '') +
              ' ' +
              formatDate(deletingEntry.dateStarted) +
              ' ' +
              formatTime(deletingEntry.timeStarted) +
              ' - ' +
              formatTime(deletingEntry.timeEnded)
            }
          />
        )}
      </div>
    );
  }
}
