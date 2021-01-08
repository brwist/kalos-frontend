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
import { Documents } from '../../ComponentsLibrary/Documents';
import { Form } from '../../ComponentsLibrary/Form';

type Entry = Document.AsObject;

interface Props {
  className?: string;
  userID: number;
  contractID?: number;
}

type DocumentUpload = {
  filename: '';
  description: '';
};

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
    entry.setPageNumber(this.state.page);
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
    console.log(page);
    this.setState({ page }, this.load);
  };

  handleSetDeleting = (deleting?: Entry) => () => this.setState({ deleting });

  render() {
    const { props, state, handleSetDeleting, handleDelete } = this;
    const { className, userID, contractID } = props;
    const { deleting } = state;
    return (
      <div className={className}>
        <Documents
          userId={userID}
          fieldMask={['PropertyId']}
          contractId={contractID || 0}
          title="Documents"
          addUrl={[
            getCFAppUrl('admin:contracts.docaddS3'),
            `user_id=${userID}`,
            ...(contractID ? [`contract_id=${contractID}`] : []),
            'p=1',
          ].join('&')}
        />
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
