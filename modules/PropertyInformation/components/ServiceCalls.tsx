import React, { PureComponent } from 'react';
import { format, addHours } from 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { User } from '@kalos-core/kalos-rpc/User';
import { getPropertyAddress } from '@kalos-core/kalos-rpc/Property';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { Link } from '../../ComponentsLibrary/Link';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { PlainForm } from '../../ComponentsLibrary/PlainForm';
import {
  formatTime,
  formatDate,
  makeFakeRows,
  OrderDir,
  usd,
  timestamp,
  trailingZero,
  PropertyType,
  loadContractsByFilter,
  CustomEventsHandler,
  EventClientService,
} from '../../../helpers';
import { OPTION_BLANK } from '../../../constants';
import './serviceCalls.less';

type Entry = Event.AsObject;

interface Props {
  className?: string;
  userID: number;
  propertyId?: number;
  viewedAsCustomer?: boolean;
}

type ServiceCallFilter = {
  name: string;
  briefDescription: string;
};
interface State {
  entries: Entry[];
  loading: boolean;
  error: boolean;
  deletingEntry?: Entry;
  viewingEntry?: Entry;
  addingCustomerEntry?: Entry;
  orderByFields: (keyof Entry)[];
  orderByDBField: string;
  dir: OrderDir;
  count: number;
  page: number;
  customerProperties: PropertyType[];
  saving: boolean;
  confirmingAdded: boolean;
  showText?: string;
  serviceCallFilter: ServiceCallFilter;
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
      viewingEntry: undefined,
      addingCustomerEntry: undefined,
      dir: 'DESC',
      orderByFields: ['dateStarted'],
      orderByDBField: 'date_started',
      count: 0,
      page: 0,
      customerProperties: [],
      saving: false,
      confirmingAdded: false,
      serviceCallFilter: {
        name: '',
        briefDescription: '',
      },
    };
    this.EventClient = new EventClient(ENDPOINT);
  }

  load = async () => {
    this.setState({ loading: true });
    const { propertyId, userID, viewedAsCustomer } = this.props;
    const { dir, orderByDBField, page, serviceCallFilter } = this.state;
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
    if (serviceCallFilter.name !== '') {
      entry.setName(`%${serviceCallFilter.name}%`);
    }
    if (serviceCallFilter.briefDescription !== '') {
      entry.setDescription(`%${serviceCallFilter.briefDescription}%`);
    }
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
    if (viewedAsCustomer) {
      const { results } = await loadContractsByFilter({
        page: 0,
        filter: { userId: userID },
        sort: { orderBy: 'address', orderByField: 'address', orderDir: 'ASC' },
      });
      this.setState({ customerProperties: results });
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
    CustomEventsHandler.listen(
      'AddServiceCall',
      this.setAddingCustomerEntry(this.makeCustomerEntry()),
    );
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

  setViewing = (viewingEntry?: Entry) => () => this.setState({ viewingEntry });

  setAddingCustomerEntry = (addingCustomerEntry?: Entry) => () =>
    this.setState({ addingCustomerEntry });

  toggleConfirmingAdded = () =>
    this.setState({ confirmingAdded: !this.state.confirmingAdded });

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

  handleCustomerAddEvent = async (formData: Entry) => {
    const { dateStarted, timeStarted, description, notes } = formData;
    const [dateEnded, timeEnded] = format(
      addHours(new Date(`${dateStarted} ${timeStarted}`), 1),
      'yyyy-MM-dd HH:mm',
    ).split(' ');
    const data: Entry = {
      ...formData,
      dateEnded,
      timeEnded,
      name: 'Online Service Request',
      logJobStatus: 'Requested',
      color: 'efc281',
      description: [description, notes].join(', '),
      notes: '',
    };
    console.log(data);
    this.setState({ saving: true });
    await EventClientService.upsertEvent(data);
    this.setState({ saving: false, addingCustomerEntry: undefined });
    this.toggleConfirmingAdded();
    this.load();
  };

  makeCustomerEntry = () => {
    const req = new Event();
    const { propertyId } = this.props;
    if (propertyId) {
      req.setPropertyId(propertyId);
    }
    req.setDescription('0');
    req.setDateStarted(timestamp(true));
    const [valHour, valMinutes] = timestamp().substr(11, 5).split(':');
    let minutes = +valMinutes;
    if (minutes >= 45) {
      minutes = 45;
    } else if (minutes >= 30) {
      minutes = 30;
    } else if (minutes >= 15) {
      minutes = 15;
    } else {
      minutes = 0;
    }
    req.setTimeStarted(`${valHour}:${trailingZero(minutes)}`);
    return req.toObject();
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
      viewingEntry,
      addingCustomerEntry,
      saving,
      confirmingAdded,
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
            name: 'Name',
            dir: orderByDBField === 'name' ? dir : undefined,
            onClick: handleOrder('name', ['name']),
          },
          {
            name: 'Description',
            dir: orderByDBField === 'description' ? dir : undefined,
            onClick: handleOrder('description', ['description']),
          },
          {
            name: 'Contract Number',
            dir: orderByDBField === 'contract_number' ? dir : undefined,
            onClick: handleOrder('contract_number', ['contractNumber']),
          },
        ];
    const data: Data = loading
      ? makeFakeRows(viewedAsCustomer ? 4 : 7)
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
            description,
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
              {
                value: dateValue,
                onClick: this.setViewing(entry),
              },
              {
                value: getPropertyAddress(property),
                onClick: this.setViewing(entry),
              },
              {
                value: name,
                onClick: this.setViewing(entry),
              },
              {
                value: statusValue,
                onClick: this.setViewing(entry),
                actions: [
                  <IconButton
                    key={2}
                    size="small"
                    onClick={this.setViewing(entry)}
                  >
                    <SearchIcon />
                  </IconButton>,
                ],
              },
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
              value: name.length > 100 ? name.substr(0, 100) + '...' : name,
              onClick: () => this.setState({ showText: name }),
            },
            {
              value:
                description.length > 100
                  ? description.substr(0, 100) + '...'
                  : description,
              onClick: () => this.setState({ showText: description }),
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
    const SCHEMA_CUSTOMER_ENTRY: Schema<Entry> = [
      [
        {
          name: 'propertyId',
          label: 'Property',
          required: true,
          options: [
            { value: '0', label: OPTION_BLANK },
            ...this.state.customerProperties.map(p => ({
              value: p.id,
              label: getPropertyAddress(p),
            })),
          ],
        },
      ],
      [
        {
          name: 'description',
          label: 'Service Requested',
          options: [
            { value: '0', label: OPTION_BLANK },
            ...[
              'A/C Repair',
              'A/C Maintenance',
              'Electrical Repair',
              'Free Replacement/Upgrade Estimate',
              'Pool Heater Repair',
              'Construction',
            ].map(value => ({ value, label: value })),
          ],
          required: true,
        },
      ],
      [
        {
          name: 'dateStarted',
          label: 'Date Requested',
          type: 'date',
          required: true,
        },
        {
          name: 'timeStarted',
          label: 'Time Requested',
          type: 'time',
          required: true,
        },
      ],
      [
        {
          name: 'notes',
          label: 'Notes',
          multiline: true,
        },
      ],
    ];
    return (
      <div className={className}>
        <SectionBar
          title={`${viewedAsCustomer ? 'Active ' : ''}Service Calls`}
          actions={
            viewedAsCustomer
              ? [
                  {
                    label: 'Add Service Call',
                    onClick: this.setAddingCustomerEntry(
                      this.makeCustomerEntry(),
                    ),
                  },
                ]
              : [
                  {
                    label: 'Add Service Call',
                    url: [
                      '/index.cfm?action=admin:service.addserviceCall',
                      `user_id=${userID}`,
                      `property_id=${propertyId}`,
                      'unique=207D906B-05C0-B58E-B451566171C79356', // FIXME set proper unique
                    ].join('&'),
                  },
                ]
          }
          pagination={{
            count,
            page,
            rowsPerPage: ROWS_PER_PAGE,
            onChangePage: handleChangePage,
          }}
          fixedActions
        >
          <PlainForm<ServiceCallFilter>
            schema={[
              [
                {
                  label: 'Name',
                  name: 'name',
                  type: 'search',
                },
                {
                  label: 'Description',
                  name: 'briefDescription',
                  type: 'search',
                  actions: [
                    {
                      label: 'Search',
                      onClick: () => this.load(),
                    },
                  ],
                },
              ],
            ]}
            onChange={serviceCallFilter => this.setState({ serviceCallFilter })}
            data={this.state.serviceCallFilter}
            className="ServiceCallsFilter"
          />
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
        {viewingEntry && (
          <Modal open onClose={this.setViewing()} fullScreen>
            <SectionBar
              title="Service Call Details"
              actions={[{ label: 'Close', onClick: this.setViewing() }]}
              fixedActions
            />
            <InfoTable
              data={[
                [
                  {
                    label: 'Address',
                    value: getPropertyAddress(viewingEntry.property),
                  },
                ],
                [
                  {
                    label: 'Date/Time',
                    value: `${formatDate(
                      viewingEntry.dateStarted,
                    )} ${formatTime(viewingEntry.timeStarted)} - ${formatTime(
                      viewingEntry.timeEnded,
                    )}`,
                  },
                ],
                [
                  {
                    label: 'Technician(s) Assigned',
                    value:
                      viewingEntry.logTechnicianAssigned === '0'
                        ? 'Unnassigned'
                        : '...', // TODO
                  },
                ],
                [
                  {
                    label: 'Invoice Number',
                    value: viewingEntry.logJobNumber,
                  },
                ],
                [
                  {
                    label: 'PO',
                    value: viewingEntry.logPo,
                  },
                ],
                [
                  {
                    label: 'Description of Service Needed',
                    value: viewingEntry.description,
                  },
                ],
                [
                  {
                    label: 'Services Rendered',
                    value: viewingEntry.logServiceRendered, // TODO
                  },
                ],
                ...(!!viewingEntry.notes
                  ? [
                      [
                        {
                          label: 'Invoice Notes',
                          value: viewingEntry.notes,
                        },
                      ],
                    ]
                  : []),
                ...(!!viewingEntry.servicesperformedrow1 ||
                !!viewingEntry.totalamountrow1
                  ? [
                      [
                        {
                          label: 'Services Performed (1)',
                          value: viewingEntry.servicesperformedrow1,
                        },
                        {
                          label: 'Total Amount (1)',
                          value: viewingEntry.totalamountrow1,
                        },
                      ],
                    ]
                  : []),
                ...(!!viewingEntry.servicesperformedrow2 ||
                !!viewingEntry.totalamountrow2
                  ? [
                      [
                        {
                          label: 'Services Performed (2)',
                          value: viewingEntry.servicesperformedrow2,
                        },
                        {
                          label: 'Total Amount (2)',
                          value: viewingEntry.totalamountrow2,
                        },
                      ],
                    ]
                  : []),
                ...(!!viewingEntry.servicesperformedrow3 ||
                !!viewingEntry.totalamountrow3
                  ? [
                      [
                        {
                          label: 'Services Performed (3)',
                          value: viewingEntry.servicesperformedrow3,
                        },
                        {
                          label: 'Total Amount (3)',
                          value: viewingEntry.totalamountrow3,
                        },
                      ],
                    ]
                  : []),
                ...(!!viewingEntry.servicesperformedrow4 ||
                !!viewingEntry.totalamountrow4
                  ? [
                      [
                        {
                          label: 'Services Performed (4)',
                          value: viewingEntry.servicesperformedrow4,
                        },
                        {
                          label: 'Total Amount (4)',
                          value: viewingEntry.totalamountrow4,
                        },
                      ],
                    ]
                  : []),
                ...(!!viewingEntry.materialUsed
                  ? [
                      [
                        {
                          label: 'Material Used',
                          value: viewingEntry.materialUsed,
                        },
                      ],
                    ]
                  : []),
                ...(+viewingEntry.discountcost !== 0
                  ? [
                      [
                        {
                          label: 'Invoice Discount',
                          value: usd(+viewingEntry.discountcost),
                        },
                      ],
                    ]
                  : []),
                ...(+viewingEntry.logAmountCharged !== 0
                  ? [
                      [
                        {
                          label: 'Total Amount',
                          value: usd(+viewingEntry.logAmountCharged),
                        },
                      ],
                    ]
                  : []),
              ]}
            />
          </Modal>
        )}
        {addingCustomerEntry && (
          <Modal open onClose={this.setAddingCustomerEntry(undefined)}>
            <Form
              title="Online Service Request"
              data={addingCustomerEntry}
              schema={SCHEMA_CUSTOMER_ENTRY}
              onClose={this.setAddingCustomerEntry(undefined)}
              onSave={this.handleCustomerAddEvent}
              intro={
                <div className="ServiceCallsCustomerIntro">
                  The contact information from your online account will be used
                  for this service request.
                </div>
              }
              disabled={saving}
            />
          </Modal>
        )}
        {confirmingAdded && (
          <Modal open onClose={this.toggleConfirmingAdded}>
            <SectionBar
              title="Thank you!"
              actions={[
                { label: 'Close', onClick: this.toggleConfirmingAdded },
              ]}
            />
            <div className="ServiceCallsCustomerThank">
              <p className="ServiceCallsCustomerThankIntro">
                Your service request is now active on our schedule.
              </p>
              <p>
                A Kalos Services representative will contact you shortly during
                regular business hours to confirm scheduling.
              </p>
              <p>
                For emergency requests please additionally call{' '}
                <Link href="tel:3522437088">352-243-7088</Link>.
              </p>
            </div>
          </Modal>
        )}
        {this.state.showText && (
          <Modal
            open
            onClose={() => this.setState({ showText: undefined })}
            compact
          >
            <SectionBar
              actions={[
                {
                  label: 'Close',
                  onClick: () => this.setState({ showText: undefined }),
                },
              ]}
            />
            <div style={{ padding: '1rem', maxWidth: 320 }}>
              {this.state.showText}
            </div>
          </Modal>
        )}
      </div>
    );
  }
}
