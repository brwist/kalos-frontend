import * as React from 'react';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TxnCard } from './card';
import { TransactionRow } from './row';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { DepartmentPicker } from '../../Pickers/Department';
import { CostCenterPicker } from '../../Pickers/CostCenter';
import { EmployeePicker } from '../../Pickers/Employee';

interface props {
  userID: number;
  departmentId: number;
  userName: string;
  isSU: boolean;
  isProd?: boolean;
}

interface state {
  page: number;
  isLoading: boolean;
  transactions: Transaction.AsObject[];
  layout: string;
  filters: IFilter;
  departmentView: boolean;
  count: number;
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

export class TransactionAdminView extends React.Component<props, state> {
  TxnClient: TransactionClient;

  constructor(props: props) {
    super(props);
    this.state = {
      page: 1,
      isLoading: false,
      departmentView: !this.props.isSU,
      transactions: [],
      layout: 'list',
      filters: {},
      count: 0,
    };
    const endpoint = this.props.isProd
      ? 'https://core.kalosflorida.com:8443'
      : 'https://core-dev.kalosflorida.com:8443';
    this.TxnClient = new TransactionClient(endpoint);

    this.changePage = this.changePage.bind(this);
    this.fetchTxns = this.fetchTxns.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.altChangePage = this.altChangePage.bind(this);
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

  altChangePage(event: unknown, newPage: number) {
    console.log(newPage);
    if (!this.state.isLoading) {
      this.setState({ page: newPage }, this.fetchTxns);
    }
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
    //reqObj.setDepartmentId(this.props.departmentId);
    console.log(this.state.page);
    reqObj.setPageNumber(this.state.page);
    //reqObj.setStatusId(status);
    this.setState(
      { isLoading: true },
      await (async () => {
        const res = (await this.TxnClient.BatchGet(reqObj)).toObject();
        console.log(res);
        this.setState({
          transactions: res.resultsList,
          count: res.totalCount,
          isLoading: false,
        });
      }),
    );
  }

  copyText(text: string): void {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  shouldComponentUpdate(nextProps: props, nextState: state) {
    return !nextState.isLoading;
  }

  async componentDidMount() {
    await this.fetchTxns();
  }

  render() {
    const txns = this.state.transactions.sort((a, b) => b.id - a.id);
    return (
      <>
        <FormControlLabel
          control={
            <Switch
              onChange={this.toggleView}
              checked={!this.state.departmentView}
            />
          }
          label="Toggle master view"
        />
        {this.state.departmentView &&
          txns.map(t => (
            <TxnCard
              txn={t}
              key={`${t.id}`}
              userID={this.props.userID}
              userName={this.props.userName}
              userDepartmentID={this.props.departmentId}
              isAdmin
            />
          ))}
        {!this.state.departmentView && (
          <Paper style={{ width: '100%', overflowX: 'auto' }}>
            <TablePagination
              component="div"
              style={{ display: 'flex', justifyContent: 'center' }}
              count={this.state.count}
              rowsPerPage={25}
              page={this.state.page}
              backIconButtonProps={{
                'aria-label': 'previous page',
              }}
              nextIconButtonProps={{
                'aria-label': 'next page',
              }}
              onChangePage={this.altChangePage}
              rowsPerPageOptions={[25]}
            />
            <Toolbar style={{ justifyContent: 'center' }}>
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
                  <option value="00">Select Month</option>
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
                useDevClient
              />
              <CostCenterPicker
                selected={this.state.filters.costCenterID || 0}
                onSelect={costCenterID =>
                  this.setFilter('costCenterID', costCenterID)
                }
                label="Filter by Account"
                useDevClient
              />
              <EmployeePicker
                selected={this.state.filters.userID || 0}
                onSelect={userID => this.setFilter('userID', userID)}
                label="Filter by User"
                useDevClient
              />
            </Toolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Purchaser</TableCell>
                  <TableCell>Purchase Type</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {txns.map(t => (
                  <TransactionRow txn={t} key={`txnRow-${t.id}`} />
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              style={{ display: 'flex', justifyContent: 'center' }}
              count={this.state.count}
              rowsPerPage={25}
              page={this.state.page}
              backIconButtonProps={{
                'aria-label': 'previous page',
              }}
              nextIconButtonProps={{
                'aria-label': 'next page',
              }}
              onChangePage={this.altChangePage}
              rowsPerPageOptions={[25]}
            />
          </Paper>
        )}
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
