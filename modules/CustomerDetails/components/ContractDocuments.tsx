import React, { PureComponent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import PencilIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { DocumentClient, Document } from '@kalos-core/kalos-rpc/Document';
import { S3Client, URLObject, FileObject } from '@kalos-core/kalos-rpc/S3File';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Link } from '../../ComponentsLibrary/Link';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import { makeFakeRows, getCFAppUrl } from '../../../helpers';
import { Prompt } from '../../Prompt/main';

type Entry = Document.AsObject;

interface Props {
  className?: string;
  userID: number;
  contractID: number;
}

interface State {
  entries: Entry[];
  loading: boolean;
  error: boolean;
  deleting?: Entry;
  count: number;
  page: number;
}

export class ContractDocuments extends PureComponent<Props, State> {
  DocumentClient: DocumentClient;

  constructor(props: Props) {
    super(props);
    this.state = {
      entries: [],
      loading: true,
      error: false,
      deleting: undefined,
      count: 0,
      page: 0,
    };
    this.DocumentClient = new DocumentClient(ENDPOINT);
  }

  load = async () => {
    this.setState({ loading: true });
    const { userID } = this.props;
    const entry = new Document();
    entry.setUserId(userID);
    entry.setOrderBy('document_date_created');
    entry.setOrderDir('desc');
    entry.setFieldMaskList(['PropertyId']);
    try {
      const response = await this.DocumentClient.BatchGet(entry);
      const { resultsList: entries, totalCount: count } = response.toObject();
      this.setState({ entries, count, loading: false });
    } catch (e) {
      this.setState({ error: true, loading: false });
    }
  };

  handleEditFilename = (entry: Document.AsObject) => async (
    filename: string,
  ) => {
    try {
      const req = new Document();
      req.setId(entry.id);
      req.setDescription(filename);
      this.DocumentClient.Update(req);
      this.load();
    } catch (err) {
      console.log(err);
    }
  };

  async componentDidMount() {
    await this.load();
  }

  handleDownload = (filename: string, type: number) => async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const S3 = new S3Client(ENDPOINT);
    const url = new URLObject();
    url.setKey(filename);
    url.setBucket(type === 5 ? 'testbuckethelios' : 'kalosdocs-prod');
    const dlURL = await S3.GetDownloadURL(url);
    window.open(dlURL.url, '_blank');
  };

  handleDelete = async () => {
    const { deleting } = this.state;
    if (deleting) {
      try {
        this.handleSetDeleting()();
        this.setState({ loading: true });
        const { filename, type } = deleting;
        const S3 = new S3Client(ENDPOINT);
        const file = new FileObject();
        file.setKey(filename);
        file.setBucket(type === 5 ? 'testbuckethelios' : 'kalosdocs-prod');
        await S3.Delete(file);
        const entry = new Document();
        entry.setId(deleting.id);
        await this.DocumentClient.Delete(entry);
        await this.load();
      } catch (e) {
        this.setState({ error: true, loading: false });
      }
    }
  };

  handleChangePage = (page: number) => {
    this.setState({ page }, this.load);
  };

  handleSetDeleting = (deleting?: Entry) => () => this.setState({ deleting });

  render() {
    const {
      props,
      state,
      handleDownload,
      handleChangePage,
      handleSetDeleting,
      handleDelete,
    } = this;
    const { className, userID, contractID } = props;
    const { entries, loading, error, count, page, deleting } = state;
    const data: Data = loading
      ? makeFakeRows()
      : entries.map(entry => {
          const { propertyId, filename, type, description: value } = entry;
          return [
            {
              value: (
                <Link href="" onClick={handleDownload(filename, type)}>
                  {value}
                </Link>
              ),
              actions: [
                <IconButton
                  key={0}
                  style={{ marginLeft: 4 }}
                  size="small"
                  onClick={() => {
                    document.location.href = [
                      getCFAppUrl('admin:contracts.docemail'),
                      `user_id=${userID}`,
                      `contract_id=${contractID}`,
                      'p=1',
                      `document_id=${entry.id}`,
                    ].join('&');
                  }}
                >
                  <MailIcon />
                </IconButton>,
                <IconButton
                  key={1}
                  style={{ marginLeft: 4 }}
                  size="small"
                  onClick={handleSetDeleting(entry)}
                >
                  <DeleteIcon />
                </IconButton>,
                <Prompt
                  key={2}
                  Icon={PencilIcon}
                  prompt={'Update Filename'}
                  text="Update Filename"
                  defaultValue={entry.description}
                  confirmFn={this.handleEditFilename(entry)}
                />,
              ],
            },
          ];
        });
    return (
      <div className={className}>
        <SectionBar
          title="Documents"
          actions={[
            {
              label: 'Add',
              url: [
                getCFAppUrl('admin:contracts.docaddS3'),
                `user_id=${userID}`,
                `contract_id=${contractID}`,
                'p=1',
              ].join('&'),
            },
          ]}
          pagination={{
            count,
            page,
            rowsPerPage: ROWS_PER_PAGE,
            onChangePage: handleChangePage,
          }}
        >
          <InfoTable
            data={data}
            loading={loading}
            error={error}
            compact
            hoverable
          />
        </SectionBar>
        {deleting && (
          <ConfirmDelete
            open
            onClose={handleSetDeleting()}
            onConfirm={handleDelete}
            kind="Property Document"
            name={deleting.description}
          />
        )}
      </div>
    );
  }
}
