import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import {
  formatTime,
  makeFakeRows,
  loadEventsByFilter,
  UserClientService,
} from '../../helpers';
import { InfoTable } from '../ComponentsLibrary/InfoTable';
import { Modal } from '../ComponentsLibrary/Modal';
import { ServiceCall } from '../ComponentsLibrary/ServiceCall';
import { Form, Schema } from '../ComponentsLibrary/Form';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { getPropertyAddress } from '../../@kalos-core/kalos-rpc/Property';
import { Event as EventType } from '../../@kalos-core/kalos-rpc/Event';

interface Props extends PageWrapperProps {
  userId: number;
}

type SearchForm = {
  employeeId: string;
  date: string;
};

interface state {
  calls: EventType[];
  isLoading: boolean;
  editing?: EventType;
  searchForm: SearchForm;
}

const SCHEMA_SEARCH: Schema<SearchForm> = [
  [
    {
      name: 'employeeId',
      label: 'Employee',
      type: 'technician',
      required: true,
    },
    {
      name: 'date',
      label: 'Date Started',
      type: 'date',
      required: true,
    },
  ],
];

export class CallsByTech extends React.PureComponent<Props, state> {
  constructor(props: Props) {
    super(props);
    this.state = {
      calls: [],
      isLoading: false,
      searchForm: {
        employeeId: '',
        date: '',
      },
    };
  }

  toggleLoading = (): Promise<boolean> =>
    new Promise(resolve => {
      this.setState(
        prevState => ({
          isLoading: !prevState.isLoading,
        }),
        () => resolve(true),
      );
    });

  toggleEditing = (editing?: EventType) => () => this.setState({ editing });

  search = (searchForm: SearchForm) =>
    this.setState({ searchForm }, this.loadEvents);

  loadEvents = async () => {
    await this.toggleLoading();
    let newEvent = new EventType();
    const { resultsList: calls } = await loadEventsByFilter({
      page: -1,
      filter: {
        dateStarted: `${this.state.searchForm.date} 00:00:00`,
        logTechnicianAssigned: `%${this.state.searchForm.employeeId}%`,
      },
      sort: {
        orderBy: 'time_started',
        orderByField: 'getTimeStarted',
        orderDir: 'ASC',
      },
      req: newEvent,
    });
    this.setState({ calls });
    await this.toggleLoading();
  };

  async componentDidMount() {}

  render() {
    const { editing, isLoading } = this.state;
    return (
      <PageWrapper {...this.props} userID={this.props.userId}>
        <Form<SearchForm>
          title="Service Calls by Employee"
          schema={SCHEMA_SEARCH}
          data={{
            employeeId: '',
            date: new Date().toISOString().substr(0, 10),
          }}
          onSave={this.search}
          submitLabel="Search"
          onClose={null}
        />
        <InfoTable
          loading={isLoading}
          columns={[
            { name: 'Time' },
            { name: 'Customer' },
            { name: 'Address' },
            { name: 'Phone' },
            { name: 'Job #' },
            { name: 'Job Type' },
            { name: 'Job Status' },
          ]}
          data={
            isLoading
              ? makeFakeRows(7, 5)
              : this.state.calls.map(c => [
                  {
                    value: `${formatTime(c.getTimeStarted())} - ${formatTime(
                      c.getTimeEnded(),
                    )}`,
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: UserClientService.getCustomerNameAndBusinessName(
                      c.getCustomer()!,
                    ),
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: getPropertyAddress(c.getProperty()),
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: UserClientService.getCustomerPhone(c.getCustomer()!),
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: c.getId(),
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: `${c.getJobType()} / ${c.getJobSubtype()}`,
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: c.getLogJobStatus(),
                    onClick: this.toggleEditing(c),
                    actions: c.getCustomer()
                      ? [
                          <IconButton
                            key="edit"
                            size="small"
                            onClick={this.toggleEditing(c)}
                          >
                            <EditIcon />
                          </IconButton>,
                        ]
                      : [],
                  },
                ])
          }
        />
        {editing && editing.getCustomer() && (
          <Modal open onClose={this.toggleEditing()} fullScreen>
            <ServiceCall
              loggedUserId={this.props.userId}
              propertyId={editing.getPropertyId()}
              userID={editing.getCustomer()!.getId()}
              serviceCallId={editing.getId()}
              onClose={this.toggleEditing()}
            />
          </Modal>
        )}
      </PageWrapper>
    );
  }
}
