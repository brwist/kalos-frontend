import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { ENDPOINT } from '../../../constants';
import {
  InfoTable,
  Data,
  Columns,
  Dir,
} from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { formatTime, formatDate } from '../../../helpers';

interface Props {
  className?: string;
  userID: number;
  propertyId: number;
}

interface State {
  serviceCalls: Event.AsObject[];
  loading: boolean;
  error: boolean;
  orderBy: string;
  dir: Dir;
}

const sort = (a: Event.AsObject, b: Event.AsObject) => {
  if (a.logJobNumber < b.logJobNumber) return -1;
  if (a.logJobNumber > b.logJobNumber) return 1;
  return 0;
};

export class ServiceCalls extends PureComponent<Props, State> {
  EventClient: EventClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      serviceCalls: [],
      loading: true,
      error: false,
      dir: 'ASC',
      orderBy: 'date_started',
    };
    this.EventClient = new EventClient(ENDPOINT);
  }

  loadEntry = async () => {
    this.setState({ loading: true });
    const { propertyId } = this.props;
    const { dir, orderBy } = this.state;
    const entry = new Event();
    entry.setPropertyId(propertyId);
    entry.setOrderBy(orderBy);
    entry.setOrderDir(dir);
    try {
      const response = await this.EventClient.BatchGet(entry);
      const serviceCalls = response.toObject().resultsList;
      this.setState({ serviceCalls, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  handleOrder = (orderBy: string) => () => {
    this.setState(
      {
        orderBy,
        dir:
          orderBy !== this.state.orderBy
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

  render() {
    const { handleOrder, props, state } = this;
    const { className } = props;
    const { serviceCalls, loading, error, dir, orderBy } = state;
    const columns: Columns = [
      {
        name: 'Date / Time',
        dir: orderBy === 'date_started' ? dir : undefined,
        onClick: handleOrder('date_started'),
      },
      {
        name: 'Job Status',
        dir: orderBy === 'log_jobStatus' ? dir : undefined,
        onClick: handleOrder('log_jobStatus'),
      },
      {
        name: 'Job Type / Subtype',
        dir: orderBy === 'job_type_id, job_subtype_id' ? dir : undefined,
        onClick: handleOrder('job_type_id, job_subtype_id'),
      },
      {
        name: 'Job Number',
        dir: orderBy === 'log_jobNumber' ? dir : undefined,
        onClick: handleOrder('log_jobNumber'),
      },
      {
        name: 'Contract Number',
        dir: orderBy === 'contract_number' ? dir : undefined,
        onClick: handleOrder('contract_number'),
      },
    ];
    const data: Data = loading
      ? [[{ value: '' }], [{ value: '' }], [{ value: '' }]]
      : serviceCalls
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
          buttons={[{ label: 'New Service Call' }]}
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
