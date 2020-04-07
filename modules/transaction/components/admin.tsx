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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { AccountPicker, DepartmentPicker } from '../../Pickers';
import { EmployeePicker } from '../../Pickers/Employee';
import { TxnStatusPicker } from '../../Pickers/TransactionStatus';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  TransactionActivityClient,
  TransactionActivity,
} from '@kalos-core/kalos-rpc/TransactionActivity';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { User } from '@kalos-core/kalos-rpc/User';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { ENDPOINT } from '../../../constants';
import { range } from '../../../helpers';

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
  [key: string]: number | string | ISort | undefined;
  userID?: number;
  dateCreated?: string;
  yearCreated: string;
  dateSubmitted?: string;
  approvedByID?: number;
  costCenterID?: number;
  departmentID?: number;
  statusID?: number;
  sort: ISort;
}

interface ISort {
  sortBy: sortString;
  sortDir: 'asc' | 'desc';
}

type sortString =
  | 'description'
  | 'timestamp'
  | 'owner_id'
  | 'cost_center_id'
  | 'department_id'
  | 'job_number'
  | 'amount';

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
        yearCreated: `${new Date().getFullYear()}`,
        sort: {
          sortBy: 'timestamp',
          sortDir: 'asc',
        },
      },
      count: 0,
    };
    this.TxnClient = new TransactionClient(ENDPOINT);
    this.EventClient = new EventClient(ENDPOINT);
    this.PropertyClient = new PropertyClient(ENDPOINT);

    this.fetchTxns = this.fetchTxns.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.checkFilters = this.checkFilters.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.altChangePage = this.altChangePage.bind(this);
    this.handleSubmitPage = this.handleSubmitPage.bind(this);
    this.copyPage = this.copyPage.bind(this);
    this.makeAddJobNumber = this.makeAddJobNumber.bind(this);
    this.makeUpdateNotes = this.makeUpdateNotes.bind(this);
    this.makeUpdateCostCenter = this.makeUpdateCostCenter.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.setSort = this.setSort.bind(this);
    this.sortTxns = this.sortTxns.bind(this);
  }

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
          )},${curr.ownerName},${curr.vendor}`;
        } else {
          return `${acc}\n${new Date(
            curr.timestamp.split(' ').join('T'),
          ).toLocaleDateString()},${curr.description},${prettyMoney(
            curr.amount,
          )},${curr.ownerName},${curr.vendor}`;
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
    this.setState(
      {
        filters: {
          yearCreated: `${new Date().getFullYear()}`,
          sort: {
            sortBy: 'timestamp',
            sortDir: 'asc',
          },
        },
        page: 0,
        count: 0,
      },
      this.fetchTxns,
    );
  }

  makeAddJobNumber(id: number) {
    return async (jobString: string) => {
      try {
        let jobNumber;
        if (jobString.includes('-')) {
          jobNumber = parseInt(jobString.split('-')[1]);
        } else {
          jobNumber = parseInt(jobString);
        }
        const txn = new Transaction();
        txn.setId(id);
        txn.setJobId(jobNumber);
        txn.setFieldMaskList(['JobId']);
        await this.TxnClient.Update(txn);
        await this.fetchTxns();
      } catch (err) {
        alert('Job number could not be set');
        console.log(err);
      }
    };
  }

  makeUpdateNotes(id: number) {
    return async (notes: string) => {
      const txn = new Transaction();
      txn.setId(id);
      txn.setNotes(notes);
      txn.setFieldMaskList(['Notes']);
      await this.TxnClient.Update(txn);
      await this.fetchTxns();
    };
  }

  makeUpdateCostCenter(id: number) {
    return async (costCenterID: number) => {
      const txn = new Transaction();
      txn.setId(id);
      txn.setCostCenterId(costCenterID);
      txn.setFieldMaskList(['CostCenterId']);
      await this.TxnClient.Update(txn);
      await this.fetchTxns();
    };
  }

  makeUpdateStatus(id: number, statusID: number, description: string) {
    return async (reason?: string) => {
      const client = new TransactionClient(ENDPOINT);
      const txn = new Transaction();
      txn.setId(id);
      txn.setStatusId(statusID);
      txn.setFieldMaskList(['StatusId']);
      await client.Update(txn);
      await this.makeLog(`${description} ${reason || ''}`, id);
    };
  }

  makeUpdateDepartment(id: number) {
    return async (departmentID: number) => {
      const txn = new Transaction();
      txn.setId(id);
      txn.setDepartmentId(departmentID);
      txn.setFieldMaskList(['DepartmentId']);
      await this.TxnClient.Update(txn);
    };
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
      obj.setTimestamp(`${filters.yearCreated}-${filters.dateCreated}%`);
    } else {
      obj.setTimestamp(`${filters.yearCreated}-%`);
    }
    if (filters.statusID) {
      obj.setStatusId(filters.statusID);
    }
    obj.setOrderBy(filters.sort.sortBy);
    obj.setOrderDir(filters.sort.sortDir);
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
    reqObj.setIsActive(1);
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

  setSort(sortBy: sortString) {
    this.setState(prevState => {
      console.log(
        sortBy,
        prevState.filters.sort.sortBy,
        prevState.filters.sort.sortBy === sortBy,
      );
      let newDir: 'desc' | 'asc' = 'desc';
      if (
        prevState.filters.sort.sortDir === newDir &&
        prevState.filters.sort.sortBy === sortBy
      ) {
        newDir = 'asc';
      }
      console.log(newDir);
      return {
        filters: {
          ...prevState.filters,
          sort: {
            sortDir: newDir,
            sortBy,
          },
        },
      };
    }, this.fetchTxns);
  }

  copyText(text: string): void {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
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

  async makeLog(description: string, id: number) {
    const client = new TransactionActivityClient(ENDPOINT);
    const activity = new TransactionActivity();
    activity.setIsActive(1);
    activity.setTimestamp(timestamp());
    activity.setUserId(this.props.userID);
    activity.setDescription(description);
    activity.setTransactionId(id);
    await client.Create(activity);
  }

  componentDidUpdate(prevProps: props, prevState: state) {
    if (prevState.departmentView !== this.state.departmentView) {
      this.fetchTxns();
    }
  }

  getYearList() {
    let start = 2019;
    let options: React.ReactNode[] = [];
    const end = new Date().getFullYear();

    while (start <= end) {
      options = options.concat(
        <option key={`year_${start}`} value={`${start}`}>
          {start}
        </option>,
      );
      start = start + 1;
    }
    return options;
  }

  async componentDidMount() {
    await this.fetchTxns();
  }

  sortTxns() {
    const { sortBy, sortDir } = this.state.filters.sort;
    console.log(sortBy, sortDir);
    if (sortBy === 'timestamp') {
      return this.state.transactions.sort((a, b) => {
        const dateA = new Date(a.timestamp.split(' ')[0]);
        const dateB = new Date(b.timestamp.split(' ')[0]);

        if (sortDir === 'asc') {
          return dateA.valueOf() - dateB.valueOf();
        } else {
          return dateB.valueOf() - dateA.valueOf();
        }
      });
    }

    if (sortBy === 'amount') {
      return this.state.transactions.sort((a, b) => {
        if (sortDir === 'asc') {
          return a.amount - b.amount;
        } else {
          return b.amount - a.amount;
        }
      });
    }

    if (sortBy === 'cost_center_id') {
      return this.state.transactions.sort((a, b) => {
        if (sortDir === 'asc') {
          return a.costCenterId - b.costCenterId;
        } else {
          return b.costCenterId - a.costCenterId;
        }
      });
    }

    if (sortBy === 'job_number') {
      return this.state.transactions.sort((a, b) => {
        if (sortDir === 'asc') {
          return a.jobId - b.jobId;
        } else {
          return b.jobId - a.jobId;
        }
      });
    }

    if (sortBy === 'description') {
      return this.state.transactions.sort((a, b) => {
        if (sortDir === 'asc') {
          return a.vendor.localeCompare(b.vendor);
        } else {
          return b.vendor.localeCompare(a.vendor);
        }
      });
    }

    return this.state.transactions;
  }

  render() {
    const txns = this.sortTxns();
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
          <Toolbar
            style={{
              justifyContent: 'space-evenly',
              position: 'sticky',
              width: '100%',
            }}
          >
            <TablePagination
              component="span"
              count={this.state.count}
              rowsPerPage={50}
              page={this.state.page}
              backIconButtonProps={{
                'aria-label': 'previous page',
              }}
              nextIconButtonProps={{
                'aria-label': 'next page',
              }}
              onChangePage={this.altChangePage}
              rowsPerPageOptions={[50]}
            />
            <FormControl style={{ marginBottom: 10 }}>
              <InputLabel htmlFor="set-year-select">Filter by Year</InputLabel>
              <NativeSelect
                disabled={this.state.isLoading}
                onChange={e =>
                  this.setFilter('yearCreated', e.currentTarget.value)
                }
                inputProps={{ id: 'set-year-select' }}
                value={this.state.filters.yearCreated}
              >
                {this.getYearList()}
              </NativeSelect>
            </FormControl>
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
                renderItem={i => (
                  <option value={i.id}>
                    {i.description} - {i.value}
                  </option>
                )}
              />
            )}
            <TxnStatusPicker
              disabled={this.state.isLoading}
              selected={this.state.filters.statusID || 0}
              onSelect={statusID => this.setFilter('statusID', statusID)}
              label="Filter by Status"
            />
            <AccountPicker
              disabled={this.state.isLoading}
              selected={this.state.filters.costCenterID || 0}
              onSelect={costCenterID =>
                this.setFilter('costCenterID', costCenterID)
              }
              sort={(a, b) => a.description.localeCompare(b.description)}
              renderItem={i => (
                <option value={i.id}>
                  {i.description} ({i.id})
                </option>
              )}
            />
            <EmployeePicker
              disabled={this.state.isLoading}
              selected={this.state.filters.userID || 0}
              onSelect={userID => this.setFilter('userID', userID)}
              label="Filter by User"
              test={employeeTest}
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
          <Table stickyHeader style={{ maxHeight: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sortDirection={this.state.filters.sort.sortDir}
                  style={{ padding: 4 }}
                >
                  <TableSortLabel
                    active={this.state.filters.sort.sortBy === 'timestamp'}
                    direction={this.state.filters.sort.sortDir}
                    onClick={() => this.setSort('timestamp')}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" style={{ padding: 4 }}>
                  Purchaser
                </TableCell>
                <TableCell
                  align="center"
                  sortDirection={this.state.filters.sort.sortDir}
                  style={{ padding: 4 }}
                >
                  <TableSortLabel
                    active={this.state.filters.sort.sortBy === 'cost_center_id'}
                    direction={this.state.filters.sort.sortDir}
                    onClick={() => this.setSort('cost_center_id')}
                  >
                    Account
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" style={{ padding: 4 }}>
                  Department
                </TableCell>
                <TableCell align="center" style={{ padding: 4 }}>
                  Job #
                </TableCell>
                <TableCell
                  style={{ padding: 4 }}
                  align="right"
                  sortDirection={this.state.filters.sort.sortDir}
                >
                  <TableSortLabel
                    active={this.state.filters.sort.sortBy === 'amount'}
                    direction={this.state.filters.sort.sortDir}
                    onClick={() => this.setSort('amount')}
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="center"
                  sortDirection={this.state.filters.sort.sortDir}
                  style={{ padding: 4 }}
                >
                  <TableSortLabel
                    active={this.state.filters.sort.sortBy === 'description'}
                    direction={this.state.filters.sort.sortDir}
                    onClick={() => this.setSort('description')}
                  >
                    Description
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" colSpan={2} style={{ padding: 4 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!this.state.isLoading &&
                txns.map(t => (
                  <TransactionRow
                    txn={t}
                    key={`txnRow-${t.id}`}
                    acceptOverride={
                      this.props.userID === 213 || this.props.userID === 336
                    }
                    departmentView={this.state.departmentView}
                    enter={this.makeUpdateStatus(t.id, 5, 'recorded')}
                    accept={this.makeUpdateStatus(t.id, 3, 'accepted')}
                    reject={this.makeUpdateStatus(t.id, 4, 'rejected')}
                    refresh={this.fetchTxns}
                    addJobNumber={this.makeAddJobNumber(t.id)}
                    updateNotes={this.makeUpdateNotes(t.id)}
                    updateCostCenter={this.makeUpdateCostCenter(t.id)}
                    updateDepartment={this.makeUpdateDepartment(t.id)}
                    toggleLoading={this.toggleLoading}
                  />
                ))}
              {this.state.isLoading &&
                range(0, 50).map(i => (
                  <TableRow key={`${i}_txn_skeleton_row`}>
                    <TableCell align="center" style={{ height: 85 }}>
                      <Skeleton variant="text" width={40} height={16} />
                    </TableCell>
                    <TableCell align="center" style={{ height: 85 }}>
                      <Skeleton variant="text" width={40} height={16} />
                    </TableCell>
                    <TableCell align="center" style={{ height: 85 }}>
                      <Skeleton variant="text" width={40} height={16} />
                    </TableCell>
                    <TableCell align="center" style={{ height: 85 }}>
                      <Skeleton variant="text" width={40} height={16} />
                    </TableCell>
                    <TableCell align="center" style={{ height: 85 }}>
                      <Skeleton variant="text" width={40} height={16} />
                    </TableCell>
                    <TableCell align="center" style={{ height: 85 }}>
                      <Skeleton variant="text" width={40} height={16} />
                    </TableCell>
                    <TableCell align="center" style={{ height: 85 }}>
                      <Skeleton variant="text" width={40} height={16} />
                    </TableCell>
                    <TableCell align="center" style={{ height: 85 }}>
                      <Skeleton variant="text" width={40} height={16} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {!this.state.isLoading && this.state.count === 0 && (
            <Typography>0 results</Typography>
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
