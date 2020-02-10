import * as React from 'react';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TxnCard } from './card';
import { Loader } from '../../Loader/main';
import { NativeSelect } from '@material-ui/core';
import { S3Client } from '@kalos-core/kalos-rpc/S3File';
import { getEditDistance } from '../../../helpers';

const MISSING_RECEIPT_KEY = 'KALOS MISSING RECIEPT AFFADAVIT';

interface props {
  userID: number;
  departmentId: number;
  userName: string;
  isManager: boolean;
}

interface state {
  page: number;
  isLoading: boolean;
  transactions: Transaction.AsObject[];
  totalCount: number;
}

export class TransactionUserView extends React.PureComponent<props, state> {
  TxnClient: TransactionClient;
  S3Client: S3Client;

  constructor(props: props) {
    super(props);
    this.state = {
      page: 0,
      isLoading: false,
      transactions: [],
      totalCount: 0,
    };
    const endpoint = 'https://core-dev.kalosflorida.com:8443';
    const { userID } = props;
    this.TxnClient = new TransactionClient(userID, endpoint);
    this.S3Client = new S3Client(userID, endpoint);

    this.downloadAffadavit = this.downloadAffadavit.bind(this);
    this.changePage = this.changePage.bind(this);
    this.fetchTxns = this.fetchTxns.bind(this);
    this.fetchAllTxns = this.fetchAllTxns.bind(this);
    this.handleCostCenterChange = this.handleCostCenterChange.bind(this);
  }

  changePage(changeAmount: number) {
    return () => {
      if (!this.state.isLoading) {
        this.setState(
          prevState => ({ page: prevState.page + changeAmount }),
          this.fetchAllTxns,
        );
      } else {
        console.log('change page request while loading was ignored');
      }
    };
  }

  prevPage = this.changePage(-1);

  nextPage = this.changePage(1);

  toggleLoading = (cb?: () => void) => {
    this.setState(
      prevState => ({
        isLoading: !prevState.isLoading,
      }),
      () => {
        cb && cb();
      },
    );
  };

  async fetchTxns(statusID: number) {
    const reqObj = new Transaction();
    reqObj.setOwnerId(this.props.userID);
    reqObj.setPageNumber(this.state.page);
    reqObj.setStatusId(statusID);
    reqObj.setIsActive(1);
    const res = (await this.TxnClient.BatchGet(reqObj)).toObject();
    return res.resultsList;
  }

  async fetchAllTxns() {
    this.setState(
      {
        isLoading: true,
      },
      await (async () => {
        const newTxns = await this.fetchTxns(1);
        const rejectedTxns = await this.fetchTxns(4);
        this.setState({
          transactions: newTxns.concat(rejectedTxns),
          isLoading: false,
        });
      }),
    );
  }

  async downloadAffadavit(e: React.SyntheticEvent<HTMLSelectElement>) {
    if (e.currentTarget.value.length > 0) {
      try {
        const key = `${MISSING_RECEIPT_KEY}${e.currentTarget.value}`;
        await this.S3Client.download(key, 'kalos-transactions');
      } catch (err) {
        console.log(err);
      }
    }
  }

  handleCostCenterChange(txn: Transaction.AsObject) {
    let IDList: number[] = [];
    for (const t of this.state.transactions) {
      if (t.vendor === txn.vendor) {
        IDList = [...IDList, t.id];
      } else {
        const editDistance = getEditDistance(txn.vendor, t.vendor);
        console.log(editDistance);
      }
    }
    const newTxns = this.state.transactions.slice().map(t => {
      if (IDList.includes(t.id)) {
        t.costCenterId = txn.costCenterId;
        return t;
      } else {
        return t;
      }
    });
    this.setState({
      transactions: newTxns,
    });
  }

  async componentDidMount() {
    await this.fetchAllTxns();
  }

  render() {
    const txns = this.state.transactions.sort((a, b) => {
      const dateA = new Date(a.timestamp.split(' ').join('T'));
      const dateB = new Date(b.timestamp.split(' ').join('T'));
      return dateA.getTime() - dateB.getTime();
    });
    const { isLoading } = this.state;
    return (
      <>
        {isLoading && <Loader />}
        {/*!isLoading && (
          <NativeSelect onChange={this.downloadAffadavit}>
            <option value="">Download Missing Receipt Form</option>
            <option value=".pdf">PDF</option>
            <option value=".docx">Word Document</option>
          </NativeSelect>
        )*/}
        {txns.map(t => (
          <TxnCard
            txn={t}
            key={`${t.id}`}
            userID={this.props.userID}
            userName={this.props.userName}
            userDepartmentID={this.props.departmentId}
            fetchFn={this.fetchAllTxns}
            toggleLoading={this.toggleLoading}
            isManager={this.props.isManager}
          />
        ))}
        {txns.length === 0 && !isLoading && (
          <div className="flex-col align-self-stretch align-center">
            <span className="title-text">
              You have no transactions in need of review
            </span>
          </div>
        )}
      </>
    );
  }
}
