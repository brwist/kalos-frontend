import * as React from 'react';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TxnCard } from './card';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ChevronLeft from '@material-ui/icons/ChevronLeftSharp';
import ChevronRight from '@material-ui/icons/ChevronRightSharp';
import { User } from '@kalos-core/kalos-rpc/User';
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
  totalCount: number;
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
      totalCount: 0,
    };
    this.TxnClient = new TransactionClient();

    this.changePage = this.changePage.bind(this);
    this.fetchTxns = this.fetchTxns.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.getPageCount = this.getPageCount.bind(this);
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

  clearFilters() {
    this.setState({ filters: {} });
  }

  getPageCount() {
    return Math.ceil(this.state.totalCount / 25);
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

  async fetchTxns() {
    const status = this.state.departmentView ? 2 : 5;
    const departmentId = this.state.departmentView
      ? this.props.departmentId
      : this.state.filters.departmentID || 0;
    let reqObj = new Transaction();
    reqObj.setDepartmentId(departmentId);
    reqObj.setPageNumber(this.state.page);
    //reqObj.setStatusId(status);
    reqObj = this.applyFilters(reqObj);
    this.setState(
      { isLoading: true },
      await (async () => {
        const res = (await this.TxnClient.BatchGet(reqObj)).toObject();
        this.setState({
          transactions: res.resultsList,
          totalCount: res.totalCount,
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
      <Grid container direction="column" alignItems="center" justify="center">
        {!this.state.departmentView && (
          <>
            <Grid
              container
              direction="row"
              justify="space-around"
              alignItems="center"
            >
              <FormControl style={{ marginBottom: 10 }}>
                <InputLabel htmlFor="set-month-select">
                  Filter by Month
                </InputLabel>
                <NativeSelect
                  onChange={e =>
                    this.setFilter('dateCreated', e.currentTarget.value)
                  }
                  value={this.state.filters.dateCreated || '00'}
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
                onSelect={(userID: number) => this.setFilter('userID', userID)}
                label="Filter by User"
                sort={sortUsers}
              />
            </Grid>
            <Grid
              container
              direction="row"
              style={{ width: '100%' }}
              justify="space-evenly"
              alignItems="center"
            >
              <IconButton onClick={this.prevPage}>
                <ChevronLeft />
              </IconButton>
              <Typography component="span">
                Page {this.state.page + 1} of {this.getPageCount()}
              </Typography>
              <IconButton onClick={this.nextPage}>
                <ChevronRight />
              </IconButton>
            </Grid>
          </>
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
        {this.state.transactions.length > 5 && (
          <Grid
            container
            direction="row"
            style={{ width: '100%' }}
            justify="space-evenly"
            alignItems="center"
          >
            <IconButton onClick={this.prevPage}>
              <ChevronLeft />
            </IconButton>
            <Typography component="span">
              Page {this.state.page + 1} of {this.getPageCount()}
            </Typography>
            <IconButton onClick={this.nextPage}>
              <ChevronRight />
            </IconButton>
          </Grid>
        )}
      </Grid>
    );
  }
}

function sortUsers(a: User.AsObject, b: User.AsObject) {
  return a.lastname.charCodeAt(0) - b.lastname.charCodeAt(0);
}
