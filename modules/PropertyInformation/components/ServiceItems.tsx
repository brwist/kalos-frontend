import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  ServiceItemClient,
  ServiceItem,
} from '@kalos-core/kalos-rpc/ServiceItem';
import { ENDPOINT } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { makeFakeRows } from '../../../helpers';

interface Props {
  className?: string;
  userID: number;
  propertyId: number;
}

interface State {
  serviceItems: ServiceItem.AsObject[];
  loading: boolean;
  error: boolean;
}

const sort = (a: ServiceItem.AsObject, b: ServiceItem.AsObject) => {
  if (a.sortOrder < b.sortOrder) return -1;
  if (a.sortOrder > b.sortOrder) return 1;
  return 0;
};

export class ServiceItems extends PureComponent<Props, State> {
  ServiceItemClient: ServiceItemClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      serviceItems: [],
      loading: true,
      error: false,
    };
    this.ServiceItemClient = new ServiceItemClient(ENDPOINT);
  }

  loadEntry = async () => {
    const { propertyId } = this.props;
    const entry = new ServiceItem();
    entry.setPropertyId(propertyId);
    try {
      const response = await this.ServiceItemClient.BatchGet(entry);
      const serviceItems = response.toObject().resultsList;
      this.setState({ serviceItems, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.loadEntry();
  }

  render() {
    const { className } = this.props;
    const { serviceItems, loading, error } = this.state;
    const data: Data = loading
      ? makeFakeRows()
      : serviceItems.sort(sort).map(({ type: value }) => [
          {
            value,
            actions: [
              <IconButton key={0} style={{ marginLeft: 4 }} size="small">
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
        />
        <InfoTable
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
