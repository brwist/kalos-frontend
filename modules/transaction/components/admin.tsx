import * as React from 'react';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TxnCard } from './card';
import {
  Toolbar,
  NativeSelect,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { DepartmentPicker } from '../../Pickers/Department';
import { CostCenterPicker } from '../../Pickers/CostCenter';
import { EmployeePicker } from '../../Pickers/Employee';

interface props {
  userID: number;
  departmentId: number;
  userName: string;
  isSU: boolean;
}

interface state {
  page: number;
  isLoading: boolean;
  transactions: Transaction.AsObject[];
  layout: string;
  filters: IFilter;
  departmentView: boolean;
}

interface IFilter {
  [key: string]: number | string | undefined;
  userID?: number;
  dateCreated?: string;
  dateSubmitted?: string;
  approvedByID?: number;
  costCenterID?: number;
  departmentID?: number;
}

export class TransactionAdminView extends React.PureComponent<props, state> {
  TxnClient: TransactionClient;

  constructor(props: props) {
    super(props);
    this.state = {
      page: 0,
      isLoading: false,
      departmentView: !this.props.isSU,
      transactions: [],
      layout: 'list',
      filters: {},
    };
    this.TxnClient = new TransactionClient();

    this.changePage = this.changePage.bind(this);
    this.fetchTxns = this.fetchTxns.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.toggleView = this.toggleView.bind(this);
  }

  toggleView() {
    this.setState(prevState => ({ departmentView: !prevState.departmentView }));
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

  setFilter<T extends keyof IFilter>(key: T, value: IFilter[T]) {
    this.setState(
      prevState => ({ filters: { ...prevState.filters, [key]: value } }),
      this.fetchTxns,
    );
  }

  prevPage = this.changePage(-1);

  nextPage = this.changePage(1);

  async fetchTxns() {
    const status = this.state.departmentView ? 2 : 5;
    const reqObj = new Transaction();
    reqObj.setDepartmentId(this.props.departmentId);
    reqObj.setPageNumber(this.state.page);
    reqObj.setStatusId(status);
    this.setState(
      { isLoading: true },
      await (async () => {
        const { resultsList } = (await this.TxnClient.BatchGet(
          reqObj,
        )).toObject();
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
    const txns = this.state.transactions.sort((a, b) => b.id - a.id);
    return (
      <>
        {!this.state.departmentView && (
          <Toolbar>
            <FormControl style={{ marginBottom: 10 }}>
              <InputLabel htmlFor="set-month-select">
                Filter by Month
              </InputLabel>
              <NativeSelect
                onChange={e =>
                  this.setFilter('dateCreated', e.currentTarget.value)
                }
                inputProps={{ id: 'set-month-select' }}
              >
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </NativeSelect>
            </FormControl>
            <DepartmentPicker
              selected={this.state.filters.departmentID || 0}
              onSelect={departmentID =>
                this.setFilter('departmentID', departmentID)
              }
              label="Filter by Department"
            />
            <CostCenterPicker
              selected={this.state.filters.costCenterID || 0}
              onSelect={costCenterID =>
                this.setFilter('costCenterID', costCenterID)
              }
              label="Filter by Account"
            />
            <EmployeePicker
              selected={this.state.filters.userID || 0}
              onSelect={userID => this.setFilter('userID', userID)}
              label="Filter by User"
            />
          </Toolbar>
        )}
        {txns.map(t => (
          <TxnCard
            txn={t}
            key={`${t.id}`}
            userID={this.props.userID}
            userName={this.props.userName}
            userDepartmentID={this.props.departmentId}
            isAdmin
          />
        ))}
        {this.state.transactions.length === 0 && (
          <div className="flex-col align-self-stretch align-center">
            <span className="title-text">
              There are no transactions in need of review
            </span>
          </div>
        )}
      </>
    );
  }
}
