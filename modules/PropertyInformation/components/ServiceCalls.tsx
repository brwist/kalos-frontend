import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { ENDPOINT } from '../../../constants';
import {
  InfoTable,
  Data as InfoTableData,
} from '../../ComponentsLibrary/InfoTable';
// import { Modal } from './Modal';
// import { Form, Schema } from './Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { formatTime, formatDate } from '../../../helpers';

// const SCHEMA: Schema<Property.AsObject>[] = [
//   { label: 'First Name', name: 'firstname', helperText: PROP_LEVEL },
//   { label: 'Last Name', name: 'lastname', helperText: PROP_LEVEL },
//   { label: 'Business Name', name: 'businessname', helperText: PROP_LEVEL },
//   { label: 'Primary Phone', name: 'phone', helperText: PROP_LEVEL },
//   { label: 'Alternate Phone', name: 'altphone', helperText: PROP_LEVEL },
//   { label: 'Email', name: 'email', helperText: PROP_LEVEL },
//   { label: 'Address', name: 'address', required: true, multiline: true },
//   { label: 'City', name: 'city', required: true },
//   { label: 'State', name: 'state', options: USA_STATES, required: true },
//   { label: 'Zip Code', name: 'zip', required: true },
//   { label: 'Zoning', name: 'isResidential', options: RESIDENTIAL },
//   { label: 'Subdivision', name: 'subdivision' },
//   { label: 'Directions', name: 'directions', multiline: true },
//   { label: 'Latitude', name: 'geolocationLat' },
//   { label: 'Longitude', name: 'geolocationLng' },
//   { label: 'Notes', name: 'notes', multiline: true },
// ];

interface Props {
  className?: string;
  userID: number;
  propertyId: number;
  //   editing: boolean;
  //   onCloseEdit: () => void;
}

interface State {
  serviceCalls: Event.AsObject[];
  loading: boolean;
  error: boolean;
  //   saving: boolean;
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
      // saving: false,
    };
    this.EventClient = new EventClient(ENDPOINT);
  }

  loadEntry = async () => {
    const { propertyId } = this.props;
    const entry = new Event();
    entry.setPropertyId(propertyId);
    try {
      const response = await this.EventClient.BatchGet(entry);
      const serviceCalls = response.toObject().resultsList;
      this.setState({ serviceCalls, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.loadEntry();
  }

  //   handleSave = async (data: Property.AsObject) => {
  //     const { propertyId, userID, onCloseEdit } = this.props;
  //     this.setState({ saving: true });
  //     const entry = new Property();
  //     entry.setId(propertyId);
  //     entry.setUserId(userID);
  //     const fieldMaskList = [];
  //     for (const key in data) {
  //       const upperCaseProp = `${key[0].toUpperCase()}${key.slice(1)}`;
  //       const methodName = `set${upperCaseProp}`;
  //       //@ts-ignore
  //       entry[methodName](data[key]);
  //       fieldMaskList.push(upperCaseProp);
  //     }
  //     entry.setFieldMaskList(fieldMaskList);
  //     const userProperty = await this.PropertyClient.Update(entry);
  //     this.setState(() => ({
  //       userProperty,
  //       saving: false,
  //     }));
  //     onCloseEdit();
  //   };

  render() {
    const { className } = this.props;
    const { serviceCalls, loading, error } = this.state;
    const infoTableData: InfoTableData = loading
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
                value: (
                  <>
                    {formatDate(dateStarted) +
                      ' ' +
                      formatTime(timeStarted) +
                      ' - ' +
                      formatTime(timeEnded)}
                    <br />
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
          data={infoTableData}
          loading={loading}
          error={error}
          compact
          hoverable
        />
        {/* <Modal open={editing} onClose={onCloseEdit}>
          <Form<Property.AsObject>
            schema={SCHEMA}
            data={userProperty}
            onSave={this.handleSave}
            onClose={onCloseEdit}
            disabled={saving}
          />
        </Modal> */}
      </div>
    );
  }
}
