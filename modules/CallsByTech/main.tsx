import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import {
  EventType,
  getCustomerNameAndBusinessName,
  getPropertyAddress,
  getCustomerPhone,
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
    const { results: calls } = await loadEventsByFilter({
      page: -1,
      filter: {
        dateStarted: `${this.state.searchForm.date} 00:00:00`,
        logTechnicianAssigned: `%${this.state.searchForm.employeeId}%`,
      },
      sort: {
        orderBy: 'time_started',
        orderByField: 'timeStarted',
        orderDir: 'ASC',
      },
    });
    this.setState({ calls });
    await this.toggleLoading();
  };

  async componentDidMount() {
    await UserClientService.refreshToken();
  }

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
                    value: `${formatTime(c.timeStarted)} - ${formatTime(
                      c.timeEnded,
                    )}`,
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: getCustomerNameAndBusinessName(c.customer),
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: getPropertyAddress(c.property),
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: getCustomerPhone(c.customer),
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: c.id,
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: `${c.jobType} / ${c.jobSubtype}`,
                    onClick: this.toggleEditing(c),
                  },
                  {
                    value: c.logJobStatus,
                    onClick: this.toggleEditing(c),
                    actions: c.customer
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
        {editing && editing.customer && (
          <Modal open onClose={this.toggleEditing()} fullScreen>
            <ServiceCall
              loggedUserId={this.props.userId}
              propertyId={editing.propertyId}
              userID={editing.customer.id}
              serviceCallId={editing.id}
              onClose={this.toggleEditing()}
            />
          </Modal>
        )}
      </PageWrapper>
    );
  }
}
