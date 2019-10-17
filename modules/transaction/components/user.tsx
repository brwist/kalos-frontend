import * as React from 'react';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TransactionDocumentClient } from '@kalos-core/kalos-rpc/TransactionDocument';
import { S3Client } from '@kalos-core/kalos-rpc/S3File';
import { TransactionActivityClient } from '@kalos-core/kalos-rpc/TransactionActivity';
import { TransactionAccount } from '@kalos-core/kalos-rpc/TransactionAccount';
import { TxnCard } from './card';

interface props {
  userId: number;
  departmentId: number;
}

interface state {
  page: number;
  isLoading: boolean;
  transactions: Transaction.AsObject[];
  txnMap: Map<number, Transaction.AsObject>;
  selectedTransaction: Transaction.AsObject;
  layout: string;
}

export class TransactionUserView extends React.PureComponent<props, state> {
  TxnClient: TransactionClient;
  TxnDocClient: TransactionDocumentClient;
  TxnLogClient: TransactionActivityClient;
  S3Client: S3Client;
  FileInput: React.RefObject<HTMLInputElement>;

  constructor(props: props) {
    super(props);
    this.state = {
      page: 0,
      isLoading: false,
      transactions: [],
      selectedTransaction: new Transaction().toObject(),
      txnMap: new Map(),
      layout: 'list',
    };
    this.TxnClient = new TransactionClient();
    this.S3Client = new S3Client();
    this.TxnDocClient = new TransactionDocumentClient();
    this.TxnLogClient = new TransactionActivityClient();
    this.FileInput = React.createRef();

    this.changePage = this.changePage.bind(this);
    this.fetchTxns = this.fetchTxns.bind(this);
    this.openFilePrompt = this.openFilePrompt.bind(this);
  }

  changePage(changeAmount: number) {
    return () => {
      if (!this.state.isLoading) {
        this.setState(
          prevState => ({ page: prevState.page + changeAmount }),
          this.fetchTxns,
        );
      } else {
        console.log('change page request while loading was ignored');
      }
    };
  }

  prevPage = this.changePage(-1);

  nextPage = this.changePage(1);

  async fetchTxns() {
    const reqObj = new Transaction();
    reqObj.setOwnerId(this.props.userId);
    reqObj.setPageNumber(this.state.page);
    this.setState(
      { isLoading: true },
      await (async () => {
        const { resultsList } = (await this.TxnClient.BatchGet(
          reqObj,
        )).toObject();
        this.setState({
          transactions: resultsList,
          isLoading: false,
          txnMap: txnMap(resultsList),
        });
      }),
    );
  }

  deriveCallout(txn: Transaction.AsObject) {
    if (txn.documentsList.length === 0) {
      return (
        <p style={{ backgroundColor: 'lightred' }}>
          This transaction record requires a photo of your receipt
        </p>
      );
    }
  }

  selectTransaction(e: React.SyntheticEvent) {
    const id = parseInt(e.currentTarget.id);
    if (this.state.txnMap.has(id)) {
      const txn = this.state.txnMap.get(id);
      this.setState({
        selectedTransaction: txn!,
      });
    }
  }

  openFilePrompt() {
    this.FileInput.current && this.FileInput.current.click();
  }

  handleNotesChange(val: string) {
    console.log(val);
  }

  async componentDidMount() {
    await this.fetchTxns();
  }

  render() {
    return (
      <div className="flex-col align-self-stretch">
        {this.state.transactions.map(t => (
          <TxnCard
            txn={t}
            key={`${t.id}`}
            userDepartmentID={this.props.departmentId}
          />
        ))}
      </div>
    );
  }
}

function txnMap(txnArr: Transaction.AsObject[]) {
  const res = new Map<number, Transaction.AsObject>();
  for (const t of txnArr) {
    res.set(t.id, t);
  }
  return res;
}
