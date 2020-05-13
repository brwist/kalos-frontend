import React from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import SearchIcon from '@material-ui/icons/SearchSharp';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditSharp';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { TableSkeleton } from '../../Tables/Skeleton';
import { ENDPOINT } from '../../../constants';
import Divider from '@material-ui/core/Divider';

// add any prop types here
interface props {
  selector: React.ReactElement;
  containerStyle?: React.CSSProperties;
}

// map your state here
interface state {
  searchStr: string;
  searchBy:
    | 'First Name'
    | 'Last Name'
    | 'Business Name'
    | 'Primary Phone'
    | 'Email';
  count: number;
  page: number;
  isLoading: boolean;
  customers: User.AsObject[];
}

const headers = [
  'First Name',
  'Last Name',
  'Business Name',
  'Primary Phone',
  'Email',
  '',
];

export class CustomerSearch extends React.PureComponent<props, state> {
  Client: UserClient;
  constructor(props: props) {
    super(props);
    this.state = {
      searchStr: '',
      searchBy: 'Last Name',
      count: 0,
      page: 0,
      isLoading: false,
      customers: [],
    };
    this.Client = new UserClient(ENDPOINT);
    this.updateSearchStr = this.updateSearchStr.bind(this);
    this.updateSearchTarget = this.updateSearchTarget.bind(this);
    this.doFetchUsers = this.doFetchUsers.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.changePage = this.changePage.bind(this);
  }
  async fetchUsers() {
    const { searchBy, searchStr, page } = this.state;
    const req = new User();
    if (searchBy === 'Last Name') {
      req.setLastname(`%${searchStr}%`);
    } else if (searchBy === 'Business Name') {
      req.setBusinessname(`%${searchStr}%`);
    } else if (searchBy === 'Primary Phone') {
      req.setPhone(`%${searchStr}%`);
    } else if (searchBy === 'Email') {
      req.setEmail(`%${searchStr}%`);
    } else if (searchBy === 'First Name') {
      req.setFirstname(`%${searchStr}%`);
    }
    req.setIsEmployee(0);
    req.setIsActive(1);
    req.setPageNumber(page);
    const res = (await this.Client.BatchGet(req)).toObject();
    this.setState({
      customers: res.resultsList,
      isLoading: false,
      count: res.totalCount,
    });
  }
  doFetchUsers() {
    this.setState({ isLoading: true }, this.fetchUsers);
  }
  updateSearchStr(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      searchStr: e.currentTarget.value,
    });
  }
  updateSearchTarget(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      //@ts-ignore
      searchBy: e.currentTarget.value,
    });
  }
  changePage(event: unknown, newPage: number) {
    if (!this.state.isLoading) {
      this.setState({ page: newPage }, this.doFetchUsers);
    }
  }
  componentDidMount() {
    this.doFetchUsers();
  }
  renderToolbar() {
    return (
      <Toolbar style={{ width: '100%' }}>
        <Grid
          container
          justify="space-evenly"
          alignItems="flex-end"
          wrap="nowrap"
        >
          <Grid item>{this.props.selector}</Grid>
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
            onChangePage={this.changePage}
            rowsPerPageOptions={[25]}
          />
          <Grid item>
            <InputLabel htmlFor="search-target-picker">Search By</InputLabel>
            <NativeSelect
              inputProps={{ id: 'search-target-picker' }}
              value={this.state.searchBy}
              onChange={this.updateSearchTarget}
            >
              {headers.map((h) => (
                <option value={h} key={`${h}_select`}>
                  {h}
                </option>
              ))}
            </NativeSelect>
          </Grid>
          <Grid item>
            <TextField
              onChange={this.updateSearchStr}
              value={this.state.searchStr}
              placeholder="Enter search string..."
            />
            <Button
              style={{ marginLeft: 10 }}
              onClick={this.doFetchUsers}
              startIcon={<SearchIcon />}
              variant="contained"
              color="primary"
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    );
  }

  goToUserDetail(u: User.AsObject) {
    window.location.href = `https://app.kalosflorida.com/index.cfm?action=admin:customers.details&id=${u.id}`;
  }

  goToEditUser(u: User.AsObject) {
    window.location.href = `https://app.kalosflorida.com/index.cfm?action=admin:customers.edit&id=${u.id}`;
  }

  render() {
    if (this.state.isLoading) {
      return (
        <TableSkeleton
          headers={headers}
          toolbar={this.renderToolbar()}
          style={this.props.containerStyle}
        />
      );
    } else {
      return (
        <Paper elevation={7} style={this.props.containerStyle}>
          {this.renderToolbar()}
          <Divider />
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((h) => (
                  <TableCell key={`${h}_header`}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.customers.map((u) => (
                <TableRow
                  key={`${u.id}-${u.dateCreated}`}
                  hover
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.goToUserDetail(u)}
                >
                  <TableCell>{u.firstname}</TableCell>
                  <TableCell>{u.lastname}</TableCell>
                  <TableCell>{u.businessname}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      href={`https://app.kalosflorida.com/index.cfm?action=admin:customers.edit&id=${u.id}`}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {this.state.customers.length === 0 && !this.state.isLoading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No Results
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      );
    }
  }
}
