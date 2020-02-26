import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { PropLinkClient, PropLink } from '@kalos-core/kalos-rpc/PropLink';
import { ENDPOINT } from '../../../constants';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { makeFakeRows } from '../../../helpers';

interface Props {
  title?: string;
  serviceItemId: number;
}

interface State {
  entries: PropLink.AsObject[];
  loading: boolean;
  error: boolean;
}

export class ServiceItemsLinks extends PureComponent<Props, State> {
  SiLinkClient: PropLinkClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      entries: [],
      loading: true,
      error: false,
    };
    this.SiLinkClient = new PropLinkClient(ENDPOINT);
  }

  load = async () => {
    this.setState({ loading: true });
    const { serviceItemId } = this.props;
    const entry = new PropLink();
    entry.setPropertyId(serviceItemId);
    try {
      const response = await this.SiLinkClient.BatchGet(entry);
      const entries = response.toObject().resultsList;
      this.setState({ entries, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.load();
  }

  render() {
    const { title } = this.props;
    const { entries, loading } = this.state;
    const data: Data = loading
      ? makeFakeRows()
      : entries.map(({ url, description }) => [
          {
            value: description || url,
            actions: [
              <IconButton key={0} style={{ marginLeft: 4 }} size="small">
                <SearchIcon />
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
      <div>
        <SectionBar
          title={`Service Item Links: ${title}`}
          buttons={[{ label: 'Add Link' }]}
        />
        <InfoTable data={data} loading={loading} hoverable />
      </div>
    );
  }
}
