import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
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
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TablePagination from '@material-ui/core/TablePagination';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { User } from '@kalos-core/kalos-rpc/User';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { TableSkeleton } from '../Tables/Skeleton';
import { timestamp } from '../../helpers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

// add any prop types here
interface props {
  containerStyle?: React.CSSProperties;
}

// map your state here
interface state {
  searchStr: string;
  searchBy:
    | 'Job Number'
    | 'Start Date'
    | 'Business Name'
    | 'Lastname'
    | 'Address'
    | 'City'
    | 'Zip Code';
  count: number;
  page: number;
  isLoading: boolean;
  events: Event.AsObject[];
  accountingMode: boolean;
  date?: MaterialUiPickersDate;
}

const headers = [
  'Start Date',
  'Customer Name',
  'Business Name',
  'Address',
  'Job Number',
  'Job Type / Subtype',
  'Job Status',
];

export class ServiceCallSearch extends React.PureComponent<props, state> {
  Client: EventClient;
  constructor(props: props) {
    super(props);
    this.state = {
      searchStr: timestamp(true),
      searchBy: 'Start Date',
      count: 0,
      page: 0,
      isLoading: false,
      accountingMode: false,
      events: [],
    };
    const endpoint = 'https://core-dev.kalosflorida.com:8443';
    this.Client = new EventClient(0, endpoint);
    this.updateSearchStr = this.updateSearchStr.bind(this);
    this.updateSearchTarget = this.updateSearchTarget.bind(this);
    this.doFetchEvents = this.doFetchEvents.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
    this.changePage = this.changePage.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }
  async fetchEvents() {
    const { searchBy, searchStr, page } = this.state;
    const req = new Event();
    console.log(searchStr, searchBy);
    if (searchStr !== '') {
      if (searchBy === 'Job Number') {
        console.log(`%${searchStr}%`);
        req.setLogJobNumber(`%${searchStr}%`);
      } else if (searchBy === 'Start Date') {
        req.setDateStarted(`%${searchStr}%`);
      } else if (searchBy === 'Address') {
        const p = new Property();
        p.setAddress(`%${searchStr}%`);
        req.setProperty(p);
      } else if (searchBy === 'Zip Code') {
        const p = new Property();
        p.setZip(`%${searchStr}%`);
        req.setProperty(p);
      } else if (searchBy === 'City') {
        const p = new Property();
        p.setCity(`%${searchStr}%`);
        req.setProperty(p);
      } else if (searchBy === 'Business Name') {
        const u = new User();
        u.setBusinessname(`%${searchStr}%`);
        req.setCustomer(u);
      } else if (searchBy === 'Lastname') {
        const u = new User();
        u.setLastname(`%${searchStr}%`);
        req.setCustomer(u);
      }
    }

    req.setOrderBy('date_started');
    req.setOrderDir('desc');
    req.setIsActive(1);
    req.setPageNumber(page);
    const res = (await this.Client.BatchGet(req)).toObject();
    this.setState({
      events: res.resultsList,
      isLoading: false,
      count: res.totalCount,
    });
  }
  doFetchEvents() {
    this.setState({ isLoading: true }, this.fetchEvents);
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
  onDateChange(d: MaterialUiPickersDate) {
    if (d) {
      const year = d.getFullYear();
      let month = (d.getMonth() + 1).toString();
      let day = d.getDate().toString();
      if (month.length === 1) {
        month = `0${month}`;
      }
      if (day.length === 1) {
        day = `0${day}`;
      }
      console.log(`${year}-${month}-${day}`);
      this.setState({
        searchStr: `${year}-${month}-${day}`,
        date: d,
      });
    }
  }
  changePage(event: unknown, newPage: number) {
    if (!this.state.isLoading) {
      this.setState({ page: newPage }, this.doFetchEvents);
    }
  }
  componentDidMount() {
    this.doFetchEvents();
  }
  renderToolbar() {
    return (
      <Toolbar style={{ padding: 5 }}>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={6} lg={3} style={{ marginBottom: 5 }}>
            <InputLabel htmlFor="search-target-picker">Search By</InputLabel>
            <NativeSelect
              inputProps={{ id: 'search-target-picker' }}
              value={this.state.searchBy}
              onChange={this.updateSearchTarget}
            >
              <option value="Job Number">Job Number</option>
              <option value="Start Date">Start Date</option>
              <option value="Business Name">Business Name</option>
              <option value="Lastname">Customer Last Name</option>
              <option value="Address">Property Address</option>
              <option value="City">Property City</option>
              <option value="Zip Code">Property Zip Code</option>
            </NativeSelect>
          </Grid>
          <Grid item xs={12} lg={3} style={{ marginBottom: 5 }}>
            {this.state.searchBy !== 'Start Date' && (
              <TextField
                onChange={this.updateSearchStr}
                value={this.state.searchStr}
                placeholder="Enter search string..."
              />
            )}
            {this.state.searchBy === 'Start Date' && (
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  format="yyyy-MM-dd"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date Started"
                  value={this.state.date || new Date()}
                  onChange={this.onDateChange}
                />
              </MuiPickersUtilsProvider>
            )}
            <Button
              style={{ marginLeft: 10 }}
              onClick={this.doFetchEvents}
              variant="contained"
              color="primary"
            >
              Search
            </Button>
          </Grid>
          <TablePagination
            style={{ marginBottom: 5 }}
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
        </Grid>
      </Toolbar>
    );
  }
  render() {
    if (this.state.isLoading) {
      return (
        <ThemeProvider theme={customTheme.lightTheme}>
          <TableSkeleton
            headers={headers}
            toolbar={this.renderToolbar()}
            style={this.props.containerStyle}
          />
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={customTheme.lightTheme}>
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
                {this.state.events
                  .filter(e => e.propertyId !== 0)
                  .map(e => (
                    <TableRow
                      key={`${e.id}-${e.dateCreated}`}
                      hover
                      style={{ cursor: 'pointer' }}
                      onClick={openServiceCall(e)}
                    >
                      <TableCell>{e.dateStarted.split(' ')[0]}</TableCell>
                      <TableCell>{getCustomerName(e.customer)}</TableCell>
                      <TableCell>{getBusinessName(e.customer)}</TableCell>
                      <TableCell>{getPropertyAddress(e.property)}</TableCell>
                      <TableCell>{e.id}</TableCell>
                      <TableCell>
                        {e.jobType} / {e.jobSubtype}
                      </TableCell>
                      <TableCell>{e.logJobStatus}</TableCell>
                    </TableRow>
                  ))}
                {this.state.events.length === 0 && !this.state.isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No Results
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </ThemeProvider>
      );
    }
  }
}

function getCustomerName(c?: User.AsObject): string {
  let res = '';
  if (c) {
    res = `${c.firstname} ${c.lastname}`;
  }
  return res;
}

function getBusinessName(c?: User.AsObject): string {
  let res = '';
  if (c) {
    res = c.businessname;
  }
  return res;
}

function getPropertyAddress(p?: Property.AsObject): string {
  let res = '';
  if (p) {
    res = `${p.address}, ${p.city}, ${p.state} ${p.zip}`;
  }
  return res;
}

function openServiceCall(e: Event.AsObject) {
  return () => {
    const url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${
      e.id
    }&user_id=${e.customer ? e.customer.id : 0}&property_id=${e.propertyId}`;
    window.location.href = url;
  };
}
