import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import { DocumentClient, Document } from '@kalos-core/kalos-rpc/Document';
import { S3Client, URLObject } from '@kalos-core/kalos-rpc/S3File';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Link } from '../../ComponentsLibrary/Link';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import { makeFakeRows } from '../../../helpers';

type Entry = Document.AsObject;

interface Props {
  className?: string;
  userID: number;
  propertyId: number;
}

interface State {
  entries: Entry[];
  loading: boolean;
  error: boolean;
  count: number;
  page: number;
}

export class PropertyDocuments extends PureComponent<Props, State> {
  DocumentClient: DocumentClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      entries: [],
      loading: true,
      error: false,
      count: 0,
      page: 0,
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
      const { resultsList: entries, totalCount: count } = response.toObject();
      this.setState({ entries, count, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.loadEntry();
  }

  handleDownload = (filename: string) => async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    const S3 = new S3Client(ENDPOINT);
    const url = new URLObject();
    url.setKey(filename);
    url.setBucket('kalosdocs-prod');
    const dlURL = await S3.GetDownloadURL(url);
    window.open(dlURL.url, '_blank');
  };

  handleChangePage = (page: number) => {
    this.setState({ page }, this.loadEntry);
  };

  render() {
    const { props, state, handleDownload, handleChangePage } = this;
    const { className } = props;
    const { entries, loading, error, count, page } = state;
    const data: Data = loading
      ? makeFakeRows()
      : entries.map(({ filename, description: value }) => [
          {
            value: (
              <Link href="" onClick={handleDownload(filename)}>
                {value}
              </Link>
            ),
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
        <SectionBar
          title="Property Documents"
          buttons={[{ label: 'Add' }]}
          pagination={{
            count,
            page,
            rowsPerPage: ROWS_PER_PAGE,
            onChangePage: handleChangePage,
          }}
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
