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
    const endpoint = this.props.isProd
      ? 'https://core.kalosflorida.com:8443'
      : 'https://core-dev.kalosflorida.com:8443';
    console.log(endpoint);
    this.TxnClient = new TransactionClient(endpoint);

    this.changePage = this.changePage.bind(this);
    this.fetchTxns = this.fetchTxns.bind(this);
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
    reqObj.setOwnerId(this.props.userID);
    reqObj.setPageNumber(this.state.page);
    this.setState(
      { isLoading: true },
      await (async () => {
        const { resultsList } = (
          await this.TxnClient.BatchGet(reqObj)
        ).toObject();
        this.setState({
          transactions: resultsList,
          isLoading: false,
        });
      }),
    );
  }

  async componentDidMount() {
    await this.fetchTxns();
  }

  render() {
    const txns = this.state.transactions
      .filter(t => t.statusId !== 2)
      .sort((a, b) => b.id - a.id);
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
