import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DateFnsUtils from '@date-io/date-fns';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event';
import { ENDPOINT } from '../../constants';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

interface state {
  selectedID: number;
  date: string;
  defaultDate: string;
  calls: Event.AsObject[];
  employees: User.AsObject[];
  isLoading: boolean;
}

export class CallsByTech extends React.PureComponent<{}, state> {
  EventClient: EventClient;
  UserClient: UserClient;
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedID: 0,
      date: '',
      defaultDate: new Date().toISOString(),
      calls: [],
      employees: [],
      isLoading: false,
    };
    this.EventClient = new EventClient(ENDPOINT);
    this.UserClient = new UserClient(ENDPOINT);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.fetchAllEmployees = this.fetchAllEmployees.bind(this);
    this.fetchCalls = this.fetchCalls.bind(this);
    this.getDateString = this.getDateString.bind(this);
    this.handleEmployeeSelect = this.handleEmployeeSelect.bind(this);
  }

  toggleLoading(): Promise<boolean> {
    return new Promise(resolve => {
      this.setState(
        prevState => ({
          isLoading: !prevState.isLoading,
        }),
        () => resolve(true),
      );
    });
  }

  handleDateChange(date: MaterialUiPickersDate) {
    if (date) {
      this.setState(
        () => ({
          date: date.toISOString(),
        }),
        async () => {
          await this.clearCalls();
          if (this.state.selectedID !== 0) {
            await this.fetchCalls();
          }
        },
      );
    }
  }

  handleEmployeeSelect(e: React.SyntheticEvent<HTMLSelectElement>) {
    const id = parseInt(e.currentTarget.value);
    if (id) {
      this.setState(
        {
          selectedID: id,
        },
        async () => {
          if (this.state.date !== '') {
            await this.clearCalls();
            await this.fetchCalls();
          }
        },
      );
    }
  }

  renderIndicator() {
    let message = '';
    if (this.state.isLoading) {
      message = 'Loading, please wait...';
    } else if (this.state.selectedID === 0) {
      message = 'Select an Employee to continue';
    } else if (this.state.date === '') {
      message = 'Select a date';
    } else if (this.state.calls.length === 0) {
      message = 'No results';
    }
    return (
      <Typography component="h1" variant="h3" style={{ marginTop: '5%' }}>
        {message}
      </Typography>
    );
  }

  getDateString() {
    const dateObj = new Date(this.state.date);
    let month = `${dateObj.getMonth() + 1}`;
    if (month.length === 1) {
      month = `0${month}`;
    }
    let day = `${dateObj.getDate()}`;
    if (day.length === 1) {
      day = `0${day}`;
    }
    return `${dateObj.getFullYear()}-${month}-${day}`;
  }

  async fetchAllEmployees(page = 0) {
    const reqObj = new User();
    reqObj.setIsEmployee(1);
    reqObj.setIsActive(1);
    reqObj.setPageNumber(page);
    const res = (await this.UserClient.BatchGet(reqObj)).toObject();
    this.setState(
      prevState => ({
        employees: prevState.employees.concat(res.resultsList),
      }),
      async () => {
        if (this.state.employees.length !== res.totalCount) {
          page = page + 1;
          await this.fetchAllEmployees(page);
        } else {
          await this.toggleLoading();
        }
      },
    );
  }

  clearCalls() {
    return new Promise(resolve => {
      this.setState(
        {
          calls: [],
        },
        resolve,
      );
    });
  }

  async fetchCalls(page = 0) {
    if (page === 0) {
      await this.toggleLoading();
    }
    const reqObj = new Event();
    reqObj.setDateStarted(`${this.getDateString()} 00:00:00`);
    reqObj.setPageNumber(page);
    reqObj.setLogTechnicianAssigned(`%${this.state.selectedID}%`);
    const res = (await this.EventClient.BatchGet(reqObj)).toObject();
    this.setState(
      prevState => ({
        calls: prevState.calls.concat(res.resultsList),
      }),
      async () => {
        if (this.state.calls.length !== res.totalCount) {
          page = page + 1;
          await this.fetchCalls(page);
        } else {
          await this.toggleLoading();
        }
      },
    );
  }

  async componentDidMount() {
    await this.toggleLoading();
    await this.UserClient.GetToken('test', 'test');
    await this.fetchAllEmployees();
  }

  render() {
    return (
      <Grid container direction="column" alignItems="center">
        <Grid
          container
          item
          direction="row"
          alignItems="center"
          justify="space-evenly"
        >
          <Typography>Service Calls by Employee</Typography>
          <FormControl>
            <InputLabel htmlFor="employee-select">Employee</InputLabel>
            <NativeSelect
              value={this.state.selectedID}
              inputProps={{ id: 'employee-select' }}
              onChange={this.handleEmployeeSelect}
              disabled={this.state.isLoading}
            >
              <option value={0}>Select an Employee</option>
              {this.state.employees
                .sort(
                  (a, b) => a.lastname.charCodeAt(0) - b.lastname.charCodeAt(0),
                )
                .map(emp => (
                  <option
                    key={`${emp.id}-${emp.lastname}`}
                    value={emp.id}
                  >{`${emp.lastname}, ${emp.firstname}`}</option>
                ))}
            </NativeSelect>
          </FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date Started"
              value={this.state.date || this.state.defaultDate}
              onChange={this.handleDateChange}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Business</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Zip</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Job #</TableCell>
              <TableCell>Job Type</TableCell>
              <TableCell>Job Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.calls
              .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
              .map(c => (
                <TableRow
                  hover
                  onClick={() => {
                    if (c.customer) {
                      const url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${c.id}&property_id=${c.propertyId}&user_id=${c.customer.id}`;
                      const win = window.open(url, '_blank');
                      if (win) {
                        win.focus();
                      }
                    }
                  }}
                  key={c.name}
                >
                  <TableCell>
                    {c.timeStarted} - {c.timeEnded}
                  </TableCell>
                  <TableCell>
                    {c.customer
                      ? `${c.customer.firstname} ${c.customer.lastname}`
                      : ''}
                  </TableCell>
                  <TableCell>
                    {c.customer ? c.customer.businessname : ''}
                  </TableCell>
                  <TableCell>{c.property ? c.property.address : ''}</TableCell>
                  <TableCell>{c.property ? c.property.city : ''}</TableCell>
                  <TableCell>{c.property ? c.property.zip : ''}</TableCell>
                  <TableCell>{c.customer ? c.customer.phone : ''}</TableCell>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>
                    {c.jobType} / {c.jobSubtype}
                  </TableCell>
                  <TableCell>{c.logJobStatus}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {this.renderIndicator()}
      </Grid>
    );
  }
}
