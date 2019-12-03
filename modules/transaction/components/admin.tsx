import * as React from 'react';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TransactionRow, prettyMoney } from './row';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/CloseSharp';
import SubmitIcon from '@material-ui/icons/SendSharp';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { DepartmentPicker } from '../../Pickers/Department';
import { CostCenterPicker } from '../../Pickers/CostCenter';
import { EmployeePicker } from '../../Pickers/Employee';
import { TxnStatusPicker } from '../../Pickers/TransactionStatus';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {
  TransactionActivityClient,
  TransactionActivity,
} from '@kalos-core/kalos-rpc/TransactionActivity';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { User } from '@kalos-core/kalos-rpc/User';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';

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
  statusID?: number;
}

export class TransactionAdminView extends React.Component<props, state> {
  TxnClient: TransactionClient;
  EventClient: EventClient;
  PropertyClient: PropertyClient;

  constructor(props: props) {
    super(props);
    this.state = {
      page: 0,
      isLoading: false,
      departmentView: !this.props.isSU,
      transactions: [],
      filters: {
        statusID: this.props.isSU ? 3 : 2,
      },
      count: 0,
    };
    const endpoint = 'https://core-dev.kalosflorida.com:8443';
    this.TxnClient = new TransactionClient(endpoint);
    this.EventClient = new EventClient(endpoint);
    this.PropertyClient = new PropertyClient(endpoint);

    this.fetchTxns = this.fetchTxns.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.checkFilters = this.checkFilters.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.altChangePage = this.altChangePage.bind(this);
    this.handleSubmitPage = this.handleSubmitPage.bind(this);
    this.copyPage = this.copyPage.bind(this);
  }

  toggleView() {
    this.setState(prevState => ({
      departmentView: !prevState.departmentView,
      filters: {
        ...prevState.filters,
        statusID: prevState.departmentView ? 3 : 2,
      },
    }));
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
    if (filters.statusID) {
      obj.setStatusId(filters.statusID);
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

  makeGoToServiceCall(id: string) {
    return async () => {
      const eventID = parseInt(id);
      if (eventID) {
        let url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${eventID}`;
        const evtReq = new Event();
        evtReq.setId(eventID);
        const evt = await this.EventClient.Get(evtReq);
        url = `${url}&property_id=${evt.propertyId}`;
        const propertyReq = new Property();
        propertyReq.setId(evt.propertyId);
        const property = await this.PropertyClient.Get(propertyReq);
        url = `${url}&user_id=${property.userId}`;
        const el = document.createElement('a');
        el.target = '_blank';
        el.href = url;
        el.click();
        el.remove();
      }
    };
  }

  async fetchTxns() {
    let reqObj = new Transaction();
    reqObj = this.applyFilters(reqObj);
    if (this.state.departmentView) {
      reqObj.setDepartmentId(this.props.departmentId);
    }
    reqObj.setPageNumber(this.state.page);
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

  makeUpdateStatus(id: number, statusID: number, description: string) {
    return async (reason?: string) => {
      const client = new TransactionClient(
        'https://core-dev.kalosflorida.com:8443',
      );
      const txn = new Transaction();
      txn.setId(id);
      txn.setStatusId(statusID);
      txn.setFieldMaskList(['StatusId']);
      await client.Update(txn);
      await this.makeLog(`${description} ${reason}`);
    };
  }

  async handleSubmitPage() {
    const ok = confirm(
      `Are you sure you want to mark the current page as ${
        this.state.departmentView ? 'accepted' : 'recorded'
      }?`,
    );
    if (ok) {
      const fns = this.state.transactions
        .map(t =>
          this.makeUpdateStatus(
            t.id,
            this.state.departmentView ? 3 : 5,
            this.state.departmentView ? 'accepted' : 'recorded',
          ),
        )
        .map(f => f());
      this.setState({ isLoading: true }, async () => {
        try {
          await Promise.all(fns);
          await this.fetchTxns();
        } catch (err) {
          console.log(err);
          alert('An error has occurred');
          this.setState({ isLoading: false });
        }
      });
    }
  }

  async makeLog(description: string) {
    const client = new TransactionActivityClient(
      'https://core-dev.kalosflorida.com:8443',
    );
    const activity = new TransactionActivity();
    activity.setIsActive(1);
    activity.setTimestamp(timestamp());
    console.log(timestamp());
    activity.setUserId(this.props.userID);
    activity.setDescription(description);
    await client.Create(activity);
  }

  componentDidUpdate(prevProps: props, prevState: state) {
    if (prevState.departmentView !== this.state.departmentView) {
      this.fetchTxns();
    }
  }

  async componentDidMount() {
    await this.fetchTxns();
  }

  render() {
    const txns = this.state.transactions.sort((a, b) => b.id - a.id);
    let employeeTest;
    if (this.state.departmentView) {
      employeeTest = makeEmployeeTest(this.props.departmentId);
    }
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
        {this.props.isSU && (
          <FormControlLabel
            control={
              <Switch
                checked={this.state.departmentView}
                onChange={this.toggleView}
              />
            }
            label={
              this.state.departmentView
                ? 'Showing transacations for your department'
                : 'Showing all transactions'
            }
          />
        )}

        <>
          <Toolbar style={{ justifyContent: 'center', position: 'sticky' }}>
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
            {!this.state.departmentView && (
              <DepartmentPicker
                disabled={this.state.isLoading}
                selected={this.state.filters.departmentID || 0}
                onSelect={departmentID =>
                  this.setFilter('departmentID', departmentID)
                }
                label="Filter by Department"
                useDevClient
              />
            )}
            <TxnStatusPicker
              disabled={this.state.isLoading}
              selected={this.state.filters.statusID || 0}
              onSelect={statusID => this.setFilter('statusID', statusID)}
              label="Filter by Status"
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
              test={employeeTest}
              useDevClient
            />
            <Tooltip
              title={`Clear filters${!this.checkFilters() ? '(disabled)' : ''}`}
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
            <Tooltip
              title={
                this.state.departmentView
                  ? 'Mark current page as approved'
                  : 'Mark current page as entered'
              }
            >
              <span>
                <IconButton
                  onClick={this.handleSubmitPage}
                  disabled={this.state.isLoading}
                >
                  <SubmitIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Toolbar>
          <Table stickyHeader style={{ maxHeight: '100%' }} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Transaction Date</TableCell>
                <TableCell align="center">Purchaser</TableCell>
                <TableCell align="center">Account Type</TableCell>
                <TableCell align="center">Department</TableCell>
                <TableCell align="center">Job Number</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            {!this.state.isLoading && (
              <TableBody>
                {txns.map(t => (
                  <TransactionRow
                    txn={t}
                    key={`txnRow-${t.id}`}
                    departmentView={this.state.departmentView}
                    enter={this.makeUpdateStatus(t.id, 5, 'recorded')}
                    accept={this.makeUpdateStatus(t.id, 3, 'accepted')}
                    reject={this.makeUpdateStatus(t.id, 4, 'rejected')}
                    refresh={this.fetchTxns}
                  />
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
      </Paper>
    );
  }
}

function makeEmployeeTest(departmentID: number) {
  return (user: User.AsObject) => {
    return user.employeeDepartmentId === departmentID;
  };
}

function timestamp() {
  const dateObj = new Date();
  let month = `${dateObj.getMonth() + 1}`;
  if (month.length === 1) {
    month = `0${month}`;
  }
  let day = `${dateObj.getDate()}`;
  if (day.length === 1) {
    day = `0${day}`;
  }
  let hour = `${dateObj.getHours()}`;
  if (hour.length === 1) {
    hour = `0${hour}`;
  }
  let minute = `${dateObj.getMinutes()}`;
  if (minute.length === 1) {
    minute = `0${minute}`;
  }

  return `${dateObj.getFullYear()}-${month}-${day} ${hour}:${minute}:00`;
}
