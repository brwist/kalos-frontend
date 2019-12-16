import * as React from 'react';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TxnCard } from './card';

interface props {
  userID: number;
  departmentId: number;
  userName: string;
  isProd?: boolean;
}

interface state {
  page: number;
  isLoading: boolean;
  transactions: Transaction.AsObject[];
  layout: string;
}

export class TransactionUserView extends React.PureComponent<props, state> {
  TxnClient: TransactionClient;

  constructor(props: props) {
    super(props);
    this.state = {
      page: 0,
      isLoading: false,
      transactions: [],
      layout: 'list',
    };
    this.TxnClient = new TransactionClient(
      'https://core-dev.kalosflorida.com:8443',
    );

    this.changePage = this.changePage.bind(this);
    this.fetchTxns = this.fetchTxns.bind(this);
    this.fetchAllTxns = this.fetchAllTxns.bind(this);
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
        console.log(newTxns);
        const rejectedTxns = await this.fetchTxns(4);
        console.log(rejectedTxns);
        this.setState({
          transactions: newTxns.concat(rejectedTxns),
          isLoading: false,
        });
      }),
    );
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
    if (txns.length > 0) {
      return (
        <>
          {txns.map(t => (
            <TxnCard
              txn={t}
              key={`${t.id}`}
              userID={this.props.userID}
              userName={this.props.userName}
              userDepartmentID={this.props.departmentId}
              fetchFn={this.fetchAllTxns}
            />
          ))}
        </>
      );
    } else {
      return (
        <div className="flex-col align-self-stretch align-center">
          <span className="title-text">
            You have no transactions in need of review
          </span>
        </div>
      );
    }
  }
}
