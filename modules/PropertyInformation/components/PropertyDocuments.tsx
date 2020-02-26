import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import { DocumentClient, Document } from '@kalos-core/kalos-rpc/Document';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ENDPOINT } from '../../../constants';
import { makeFakeRows } from '../../../helpers';

interface Props {
  className?: string;
  userID: number;
  propertyId: number;
}

interface State {
  documents: Document.AsObject[];
  loading: boolean;
  error: boolean;
}

export class PropertyDocuments extends PureComponent<Props, State> {
  DocumentClient: DocumentClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      documents: [],
      loading: true,
      error: false,
    };
    this.DocumentClient = new DocumentClient(ENDPOINT);
  }

  loadEntry = async () => {
    const { userID, propertyId } = this.props;
    const entry = new Document();
    entry.setUserId(userID);
    entry.setPropertyId(propertyId);
    try {
      const response = await this.DocumentClient.BatchGet(entry);
      const documents = response.toObject().resultsList;
      this.setState({ documents, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.loadEntry();
  }

  render() {
    const { className } = this.props;
    const { documents, loading, error } = this.state;
    const data: Data = loading
      ? makeFakeRows()
      : documents.map(({ description: value }) => [
          {
            value,
            actions: [
              <IconButton key={0} style={{ marginLeft: 4 }} size="small">
                <MailIcon />
              </IconButton>,
              <IconButton key={1} style={{ marginLeft: 4 }} size="small">
                <DeleteIcon />
              </IconButton>,
            ],
          },
        ]);
    return (
      <div className={className}>
        <SectionBar title="Property Documents" buttons={[{ label: 'Add' }]} />
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
