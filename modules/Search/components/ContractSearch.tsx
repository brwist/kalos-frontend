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
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import { ContractClient, Contract } from '@kalos-core/kalos-rpc/Contract';
import { TableSkeleton } from '../../Tables/Skeleton';
import Divider from '@material-ui/core/Divider';
import { ENDPOINT } from '../../../constants';

// add any prop types here
interface props {
  selector: React.ReactElement;
  containerStyle?: React.CSSProperties;
}

// map your state here
interface state {
  searchStr: string;
  searchBy: 'Contract Number' | 'Start Date' | 'End Date';
  count: number;
  page: number;
  isLoading: boolean;
  contracts: Contract.AsObject[];
}

const headers = [
  'Contract Number',
  'Last Name',
  'Business Name',
  'Start Date',
  'End Date',
];
export class ContractSearch extends React.PureComponent<props, state> {
  Client: ContractClient;
  constructor(props: props) {
    super(props);
    this.state = {
      searchStr: '',
      searchBy: 'Contract Number',
      count: 0,
      page: 0,
      isLoading: false,
      contracts: [],
    };
    this.Client = new ContractClient(ENDPOINT);
    this.updateSearchStr = this.updateSearchStr.bind(this);
    this.updateSearchTarget = this.updateSearchTarget.bind(this);
    this.doFetchContracts = this.doFetchContracts.bind(this);
    this.fetchContracts = this.fetchContracts.bind(this);
    this.changePage = this.changePage.bind(this);
  }
  async fetchContracts() {
    const { searchBy, searchStr, page } = this.state;
    const req = new Contract();
    if (searchStr !== '') {
      if (searchBy === 'Contract Number') {
        req.setNumber(`%${searchStr}%`);
      } else if (searchBy === 'Start Date') {
        req.setDateStarted(`%${searchStr}%`);
      } else if (searchBy === 'End Date') {
        req.setDateEnded(`%${searchStr}%`);
      }
    }

    req.setIsActive(0);
    req.setPageNumber(page);
    const res = (await this.Client.BatchGet(req)).toObject();
    this.setState({
      contracts: res.resultsList,
      isLoading: false,
      count: res.totalCount,
    });
  }
  doFetchContracts() {
    this.setState({ isLoading: true }, this.fetchContracts);
  }
  updateSearchStr(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      searchStr: e.currentTarget.value,
    });
  }
  updateSearchTarget(e: React.ChangeEvent<HTMLSelectElement>) {
    //@ts-ignore
    this.setState({
      searchBy: e.currentTarget.value,
    });
  }
  changePage(event: unknown, newPage: number) {
    if (!this.state.isLoading) {
      this.setState({ page: newPage }, this.doFetchContracts);
    }
  }
  componentDidMount() {
    this.doFetchContracts();
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
              <option value="Contract Number">Contract Number</option>
              <option value="Start Date">Start Date</option>
              <option value="End Date">End Date</option>
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
              onClick={this.doFetchContracts}
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
  goToContractDetail(p: Contract.AsObject) {
    window.location.href = `https://app.kalosflorida.com/index.cfm?action=admin:Contracts.details&user_id=${p.userId}&Contract_id=${p.id}`;
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
                {headers.map(h => (
                  <TableCell key={`${h}_header`}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.contracts.map(c => (
                <TableRow
                  key={`${c.id}-${c.dateCreated}`}
                  hover
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.goToContractDetail(c)}
                >
                  <TableCell>{c.number}</TableCell>
                  <TableCell>TODO</TableCell>
                  <TableCell>TODO</TableCell>
                  <TableCell>{c.dateStarted.split(' ')[0]}</TableCell>
                  <TableCell>{c.dateEnded.split(' ')[0]}</TableCell>
                </TableRow>
              ))}
              {this.state.contracts.length === 0 && !this.state.isLoading && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
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
