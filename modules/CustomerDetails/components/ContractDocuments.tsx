import React, { PureComponent } from 'react';
import { DocumentClient, Document } from '@kalos-core/kalos-rpc/Document';
import { S3Client, FileObject } from '@kalos-core/kalos-rpc/S3File';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { ENDPOINT } from '../../../constants';
import { makeFakeRows, getCFAppUrl } from '../../../helpers';
import { Documents } from '../../ComponentsLibrary/Documents';

type Entry = Document.AsObject;

interface Props {
  className?: string;
  userID: number;
  contractID?: number;
  onDocumentsLoaded?: (documents: Document[]) => any;
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

  render() {
    const { props } = this;
    const { className, userID, contractID } = props;
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
          onDocumentsLoaded={this.props.onDocumentsLoaded}
        />
      </div>
    );
  }
}
