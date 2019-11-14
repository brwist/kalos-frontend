import * as React from 'react';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TxnCard } from './card';
import { TransactionRow, prettyMoney } from './row';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/CloseSharp';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
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
import { CircularProgress, Typography } from '@material-ui/core';

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
  statusID?: 1 | 2 | 3 | 4 | 5;
}

export class TransactionAdminView extends React.Component<props, state> {
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
      count: 0,
    };
    const endpoint = this.props.isProd
      ? 'https://core.kalosflorida.com:8443'
      : 'https://core-dev.kalosflorida.com:8443';
    this.TxnClient = new TransactionClient(endpoint);

    this.changePage = this.changePage.bind(this);
    this.fetchTxns = this.fetchTxns.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.checkFilters = this.checkFilters.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.altChangePage = this.altChangePage.bind(this);
    this.copyPage = this.copyPage.bind(this);
  }

  toggleView() {
    this.setState(prevState => ({ departmentView: !prevState.departmentView }));
  }

  copyPage() {
    const dataStr = this.state.transactions.reduce(
      (acc: string, curr: Transaction.AsObject) => {
        if (acc.length === 0) {
          return `${new Date(
            curr.timestamp.split(' ').join('T'),
          ).toLocaleDateString()},${curr.description},${prettyMoney(
            curr.amount,
          )}`;
        } else {
          return `${acc}\n${new Date(
            curr.timestamp.split(' ').join('T'),
          ).toLocaleDateString()},${curr.description},${prettyMoney(
            curr.amount,
          )}`;
        }
      },
      '',
    );
    const el = document.createElement('textarea');
    el.value = dataStr;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
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
    if (!this.state.isLoading) {
      this.setState({ page: newPage }, this.fetchTxns);
    }
  }

  setFilter<T extends keyof IFilter>(key: T, value: IFilter[T]) {
    if (value === 'Select Month') {
      value = undefined;
    }
    this.setState(
      prevState => ({
        filters: { ...prevState.filters, [key]: value },
        count: 0,
        page: 0,
      }),
      this.fetchTxns,
    );
  }

  clearFilters() {
    this.setState({ filters: {}, page: 0, count: 0 }, this.fetchTxns);
  }

  prevPage = this.changePage(-1);

  nextPage = this.changePage(1);

  applyFilters(obj: Transaction) {
    const { filters } = this.state;
    if (filters.userID) {
      obj.setOwnerId(filters.userID);
    }
    if (filters.costCenterID) {
      obj.setCostCenterId(filters.costCenterID);
    }
    if (filters.departmentID) {
      obj.setDepartmentId(filters.departmentID);
    }
    if (filters.dateCreated) {
      obj.setTimestamp(`2019-${filters.dateCreated}%`);
    }
    return obj;
  }

  checkFilters() {
    return Object.keys(this.state.filters).reduce((acc, curr) => {
      if (acc) {
        return acc;
      } else {
        return !!this.state.filters[curr];
      }
    }, false);
  }

  async fetchTxns() {
    const status = this.state.departmentView ? 2 : 5;
    let reqObj = new Transaction();
    //reqObj.setDepartmentId(this.props.departmentId);
    console.log(this.state.page);
    reqObj.setPageNumber(this.state.page);
    reqObj = this.applyFilters(reqObj);
    //reqObj.setStatusId(status);
    this.setState(
      { isLoading: true },
      await (async () => {
        const res = (await this.TxnClient.BatchGet(reqObj)).toObject();
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

  /*
  shouldComponentUpdate(nextProps: props, nextState: state) {
    return !nextState.isLoading;
  }
  */

  async componentDidMount() {
    await this.fetchTxns();
  }

  render() {
    const txns = this.state.transactions.sort((a, b) => b.id - a.id);
    return (
      <Paper
        style={{
          width: '100%',
          maxHeight: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {this.state.departmentView &&
          !this.state.isLoading &&
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
          <>
            <Toolbar style={{ justifyContent: 'center', position: 'sticky' }}>
              <FormControlLabel
                control={
                  <Switch
                    onChange={this.toggleView}
                    checked={!this.state.departmentView}
                  />
                }
                label="Toggle master view"
              />
              <TablePagination
                component="span"
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
              <FormControl style={{ marginBottom: 10 }}>
                <InputLabel htmlFor="set-month-select">
                  Filter by Month
                </InputLabel>
                <NativeSelect
                  disabled={this.state.isLoading}
                  onChange={e =>
                    this.setFilter('dateCreated', e.currentTarget.value)
                  }
                  inputProps={{ id: 'set-month-select' }}
                >
                  <option>Select Month</option>
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
                disabled={this.state.isLoading}
                selected={this.state.filters.departmentID || 0}
                onSelect={departmentID =>
                  this.setFilter('departmentID', departmentID)
                }
                label="Filter by Department"
                useDevClient
              />
              <CostCenterPicker
                disabled={this.state.isLoading}
                selected={this.state.filters.costCenterID || 0}
                onSelect={costCenterID =>
                  this.setFilter('costCenterID', costCenterID)
                }
                label="Filter by Account"
                useDevClient
              />
              <EmployeePicker
                disabled={this.state.isLoading}
                selected={this.state.filters.userID || 0}
                onSelect={userID => this.setFilter('userID', userID)}
                label="Filter by User"
                useDevClient
              />
              <Tooltip
                title={`Clear filters${
                  !this.checkFilters() ? '(disabled)' : ''
                }`}
              >
                <span>
                  <IconButton
                    onClick={this.clearFilters}
                    disabled={!this.checkFilters()}
                  >
                    <CloseIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Copy current page as CSV">
                <span>
                  <IconButton
                    onClick={this.copyPage}
                    disabled={this.state.isLoading}
                  >
                    <CopyIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Toolbar>
            <Table stickyHeader style={{ maxHeight: '100%' }} size="small">
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
              {!this.state.isLoading && (
                <TableBody>
                  {txns.map(t => (
                    <TransactionRow txn={t} key={`txnRow-${t.id}`} />
                  ))}
                </TableBody>
              )}
            </Table>
            {!this.state.isLoading && this.state.count === 0 && (
              <Typography>0 results</Typography>
            )}
            {this.state.isLoading && (
              <CircularProgress
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginLeft: '-20px',
                  marginTop: '-20px',
                }}
              />
            )}
          </>
        )}
      </Paper>
    );
  }
}
