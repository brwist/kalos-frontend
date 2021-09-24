import React, { PureComponent } from 'react';
import { format, addHours } from 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { User } from '@kalos-core/kalos-rpc/User';
import { getPropertyAddress, Property } from '@kalos-core/kalos-rpc/Property';
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
  loadContractsByFilter,
  CustomEventsHandler,
  EventClientService,
  ContractsFilter,
  loadPropertiesByFilter,
} from '../../../helpers';
import { OPTION_BLANK } from '../../../constants';
import './serviceCalls.less';
import { Contract } from '@kalos-core/kalos-rpc/Contract';
import { AddServiceCall } from '../../AddServiceCallGeneral/components/AddServiceCall';
import { ServiceRequest } from '../../ComponentsLibrary/ServiceCall/requestIndex';
import RateReviewOutlined from '@material-ui/icons/RateReviewOutlined';

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
  entries: Event[];
  loading: boolean;
  error: boolean;
  deletingEntry?: Event;
  viewingEntry?: Event;
  addingCustomerEntry?: Event;
  addingServiceCall?: boolean;
  editingServiceCall: boolean;
  serviceCallId: number;
  orderByFields: (keyof Event)[];
  orderByDBField: string;
  dir: OrderDir;
  count: number;
  page: number;
  customerProperties: Property[];
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
      addingServiceCall: false,
      editingServiceCall: false,
      serviceCallId: 0,
      dir: 'DESC',
      orderByFields: ['getDateStarted'],
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
      this.setState({
        entries: response.getResultsList().sort(this.sort),
        count: response.getTotalCount(),
        loading: false,
      });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
    let req = new Property();
    if (viewedAsCustomer) {
      const { results } = await loadPropertiesByFilter({
        page: 0,
        filter: { userId: userID },
        sort: {
          orderBy: 'address',
          orderByField: 'getDateCreated',
          orderDir: 'ASC',
        },
        req: req, // TODO Is this order-by field correct?
      });
      this.setState({ customerProperties: results });
    }
  };

  handleOrder = (
    orderByDBField: string,
    orderByFields: (keyof Event)[],
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
      entry.setId(deletingEntry.getId());
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

  sort = (a: Event, b: Event) => {
    const { orderByFields, dir } = this.state;
    const A = orderByFields
      .map(field => a[field].toString() as string)
      .join(' ')
      .trim()
      .toUpperCase();
    const B = orderByFields
      .map(field => b[field].toString() as string)
      .join(' ')
      .trim()
      .toUpperCase();
    if (A > B) return dir === 'ASC' ? 1 : -1;
    if (A < B) return dir === 'ASC' ? -1 : 1;
    return 0;
  };

  setDeleting = (deletingEntry?: Event) => () =>
    this.setState({ deletingEntry });

  setViewing = (viewingEntry?: Event) => () => this.setState({ viewingEntry });

  setAddingCustomerEntry = (addingCustomerEntry?: Event) => () =>
    this.setState({ addingCustomerEntry });
  
  toggleConfirmingAdded = () =>
    this.setState({ confirmingAdded: !this.state.confirmingAdded });

  handleChangePage = (page: number) => {
    this.setState({ page }, this.load);
  };

  handleServiceCallAddToggle = () =>
    this.setState({ addingServiceCall: !this.state.addingServiceCall });

  handleServiceCallEditToggle = () =>
    this.setState({ editingServiceCall: !this.state.editingServiceCall });

  handleRowClick = (id: number, newEdit?: boolean) => () => {
    const { userID, propertyId } = this.props;
    this.setState({ serviceCallId: id});
    if (newEdit) {
      this.handleServiceCallEditToggle();
    } else {
      window.location.href = [
        '/index.cfm?action=admin:service.editServiceCall',
        `id=${id}`,
        `user_id=${userID}`,
        `property_id=${propertyId}`,
      ].join('&');
    }
  };

  handleCustomerAddEvent = async (formData: Event) => {
    const [dateEnded, timeEnded] = format(
      addHours(
        new Date(`${formData.getDateStarted()} ${formData.getTimeStarted()}`),
        1,
      ),
      'yyyy-MM-dd HH:mm',
    ).split(' ');
    let data = new Event();
    data.setTimeEnded(timeEnded);
    data.setName('Online Service Request');
    data.setLogJobStatus('Requested');
    data.setColor('efc281');
    data.setDescription(
      [formData.getDescription(), formData.getNotes()].join(', '),
    );
    data.setNotes('');
    data.setDateEnded(formData.getDateEnded());
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
    return req;
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
              'getDateStarted',
              'getTimeStarted',
            ]),
          },
          {
            name: 'Job Status',
            dir: orderByDBField === 'log_jobStatus' ? dir : undefined,
            onClick: handleOrder('log_jobStatus', ['getLogJobStatus']),
          },
          {
            name: 'Job Type / Subtype',
            dir:
              orderByDBField === 'job_type_id, job_subtype_id'
                ? dir
                : undefined,
            onClick: handleOrder('job_type_id, job_subtype_id', [
              'getJobType',
              'getJobSubtype',
            ]),
          },
          {
            name: 'Job Number',
            dir: orderByDBField === 'log_jobNumber' ? dir : undefined,
            onClick: handleOrder('log_jobNumber', ['getLogJobNumber']),
          },
          {
            name: 'Name',
            dir: orderByDBField === 'name' ? dir : undefined,
            onClick: handleOrder('name', ['getName']),
          },
          {
            name: 'Description',
            dir: orderByDBField === 'description' ? dir : undefined,
            onClick: handleOrder('description', ['getDescription']),
          },
          {
            name: 'Contract Number',
            dir: orderByDBField === 'contract_number' ? dir : undefined,
            onClick: handleOrder('contract_number', ['getContractNumber']),
          },
        ];
    const data: Data = loading
      ? makeFakeRows(viewedAsCustomer ? 4 : 7)
      : entries.map(entry => {
          const dateValue =
            formatDate(entry.getDateStarted()) +
            ' ' +
            formatTime(entry.getTimeStarted()) +
            ' - ' +
            formatTime(entry.getTimeEnded());
          const statusValue = (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  backgroundColor: '#' + entry.getColor(),
                  marginRight: 6,
                  borderRadius: '50%',
                }}
              />
              {entry.getLogJobStatus()}
            </>
          );
          if (viewedAsCustomer)
            return [
              {
                value: dateValue,
                onClick: this.setViewing(entry),
              },
              {
                value: getPropertyAddress(entry.getProperty()),
                onClick: this.setViewing(entry),
              },
              {
                value: entry.getName(),
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
              onClick: handleRowClick(entry.getId()),
            },
            {
              value: statusValue,
              onClick: handleRowClick(entry.getId()),
            },
            {
              value:
                entry.getJobType() +
                (entry.getJobSubtype() ? ' / ' + entry.getJobSubtype() : ''),
              onClick: handleRowClick(entry.getId()),
            },
            {
              value: entry.getLogJobNumber(),
              onClick: handleRowClick(entry.getId()),
            },
            {
              value:
                entry.getName().length > 100
                  ? entry.getName().substr(0, 100) + '...'
                  : entry.getName(),
              onClick: () => this.setState({ showText: entry.getName() }),
            },
            {
              value:
                entry.getDescription().length > 100
                  ? entry.getDescription().substr(0, 100) + '...'
                  : entry.getDescription(),
              onClick: () =>
                this.setState({ showText: entry.getDescription() }),
            },
            {
              value: entry.getContractNumber(),
              actions: [
                <IconButton
                  key={'newEdit'}
                  size="small"
                  onClick={handleRowClick(entry.getId(), true)}
                >
                  <RateReviewOutlined />
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
              onClick: handleRowClick(entry.getId()),
            },
          ];
        });
    const SCHEMA_CUSTOMER_ENTRY: Schema<Event> = [
      [
        {
          name: 'getPropertyId',
          label: 'Property',
          required: true,
          options: [
            { value: '0', label: OPTION_BLANK },
            ...this.state.customerProperties.map(p => ({
              value: p.getId(),
              label: getPropertyAddress(p),
            })),
          ],
        },
      ],
      [
        {
          name: 'getDescription',
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
          name: 'getDateStarted',
          label: 'Date Requested',
          type: 'date',
          required: true,
        },
        {
          name: 'getTimeStarted',
          label: 'Time Requested',
          type: 'time',
          required: true,
        },
      ],
      [
        {
          name: 'getNotes',
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
                    label: 'Add Service Call - New',
                    onClick: this.handleServiceCallAddToggle,
                  },
                  {
                    label: 'Add Service Call',
                    url: [
                      '/index.cfm?action=admin:service.addserviceCall',
                      `user_id=${userID}`,
                      `property_id=${propertyId}`,
                      'unique=207D906B-05C0-B58E-B451566171C79356', // FIXME set proper unique
                    ].join('&'),
                  }
                ]
          }
          pagination={{
            count,
            page,
            rowsPerPage: ROWS_PER_PAGE,
            onPageChange: handleChangePage,
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
              deletingEntry.getJobType() +
              (deletingEntry.getJobSubtype()
                ? ' / ' + deletingEntry.getJobSubtype()
                : '') +
              ' ' +
              formatDate(deletingEntry.getDateStarted()) +
              ' ' +
              formatTime(deletingEntry.getTimeStarted()) +
              ' - ' +
              formatTime(deletingEntry.getTimeEnded())
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
                    value: getPropertyAddress(viewingEntry.getProperty()),
                  },
                ],
                [
                  {
                    label: 'Date/Time',
                    value: `${formatDate(
                      viewingEntry.getDateStarted(),
                    )} ${formatTime(
                      viewingEntry.getTimeStarted(),
                    )} - ${formatTime(viewingEntry.getTimeEnded())}`,
                  },
                ],
                [
                  {
                    label: 'Technician(s) Assigned',
                    value:
                      viewingEntry.getLogTechnicianAssigned() === '0'
                        ? 'Unnassigned'
                        : '...', // TODO
                  },
                ],
                [
                  {
                    label: 'Invoice Number',
                    value: viewingEntry.getLogJobNumber(),
                  },
                ],
                [
                  {
                    label: 'PO',
                    value: viewingEntry.getLogPo(),
                  },
                ],
                [
                  {
                    label: 'Description of Service Needed',
                    value: viewingEntry.getDescription(),
                  },
                ],
                [
                  {
                    label: 'Services Rendered',
                    value: viewingEntry.getLogServiceRendered(), // TODO
                  },
                ],
                ...(viewingEntry.getNotes()
                  ? [
                      [
                        {
                          label: 'Invoice Notes',
                          value: viewingEntry.getNotes(),
                        },
                      ],
                    ]
                  : []),
                ...(!!viewingEntry.getServicesperformedrow1() ||
                !!viewingEntry.getTotalamountrow1()
                  ? [
                      [
                        {
                          label: 'Services Performed (1)',
                          value: viewingEntry.getServicesperformedrow1(),
                        },
                        {
                          label: 'Total Amount (1)',
                          value: viewingEntry.getTotalamountrow1(),
                        },
                      ],
                    ]
                  : []),
                ...(!!viewingEntry.getServicesperformedrow2() ||
                !!viewingEntry.getTotalamountrow2()
                  ? [
                      [
                        {
                          label: 'Services Performed (2)',
                          value: viewingEntry.getServicesperformedrow2(),
                        },
                        {
                          label: 'Total Amount (2)',
                          value: viewingEntry.getTotalamountrow2(),
                        },
                      ],
                    ]
                  : []),
                ...(!!viewingEntry.getServicesperformedrow3() ||
                !!viewingEntry.getTotalamountrow3()
                  ? [
                      [
                        {
                          label: 'Services Performed (3)',
                          value: viewingEntry.getServicesperformedrow3(),
                        },
                        {
                          label: 'Total Amount (3)',
                          value: viewingEntry.getTotalamountrow3(),
                        },
                      ],
                    ]
                  : []),
                ...(!!viewingEntry.getServicesperformedrow4() ||
                !!viewingEntry.getTotalamountrow4()
                  ? [
                      [
                        {
                          label: 'Services Performed (4)',
                          value: viewingEntry.getServicesperformedrow4(),
                        },
                        {
                          label: 'Total Amount (4)',
                          value: viewingEntry.getTotalamountrow4(),
                        },
                      ],
                    ]
                  : []),
                ...(viewingEntry.getMaterialUsed()
                  ? [
                      [
                        {
                          label: 'Material Used',
                          value: viewingEntry.getMaterialUsed(),
                        },
                      ],
                    ]
                  : []),
                ...(+viewingEntry.getDiscountcost() !== 0
                  ? [
                      [
                        {
                          label: 'Invoice Discount',
                          value: usd(+viewingEntry.getDiscountcost()),
                        },
                      ],
                    ]
                  : []),
                ...(+viewingEntry.getLogAmountCharged() !== 0
                  ? [
                      [
                        {
                          label: 'Total Amount',
                          value: usd(+viewingEntry.getLogAmountCharged()),
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
        {this.state.addingServiceCall && (
          <AddServiceCall
            loggedUserId={userID}
            propertyId={propertyId}
            userId={userID}
            openServiceCall={true}
            onClose={() => {this.load(); this.handleServiceCallAddToggle;}}
          />
        )}
        {this.state.editingServiceCall && (
          <Modal open onClose={() => {this.handleServiceCallEditToggle; this.load();}} fullScreen>
            <ServiceRequest
              loggedUserId={userID}
              propertyId={propertyId!}
              userID={userID}
              serviceCallId={this.state.serviceCallId}
            />
          </Modal>
        )}
      </div>
    );
  }
}
