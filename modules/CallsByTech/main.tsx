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
import {
  DatePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event';

interface state {
  selectedID: number;
  date: string;
  calls: Event.AsObject[];
  callsPage: number;
  callTotalCount: number;
  employees: User.AsObject[];
  employeePage: number;
  employeeTotalCount: number;
}

export class CallsByTech extends React.PureComponent<{}, state> {
  EventClient: EventClient;
  UserClient: UserClient;
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedID: 0,
      date: new Date().toISOString(),
      calls: [],
      callsPage: 0,
      callTotalCount: 0,
      employees: [],
      employeePage: 0,
      employeeTotalCount: 0,
    };
    this.EventClient = new EventClient();
    this.UserClient = new UserClient();

    this.handleDateChange = this.handleDateChange.bind(this);
    this.fetchEmployees = this.fetchEmployees.bind(this);
    this.fetchAllEmployees = this.fetchAllEmployees.bind(this);
    this.fetchCalls = this.fetchCalls.bind(this);
    this.fetchAllCalls = this.fetchAllCalls.bind(this);
    this.getDateString = this.getDateString.bind(this);
    this.handleEmployeeSelect = this.handleEmployeeSelect.bind(this);
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
            await this.fetchAllCalls();
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
          await this.clearCalls();
          await this.fetchAllCalls();
        },
      );
    }
  }

  getDateString() {
    const dateObj = new Date(this.state.date);
    let month = `${dateObj.getMonth() + 1}`;
    if (month.length === 1) {
      month = `0${month}`;
    }
    let day = `${dateObj.getDate()}`;
    if (day.length === 0) {
      day = `0${day}`;
    }
    return `${dateObj.getFullYear()}-${month}-${day}`;
  }

  fetchEmployees() {
    return new Promise(async resolve => {
      const reqObj = new User();
      reqObj.setIsEmployee(1);
      reqObj.setIsActive(1);
      reqObj.setPageNumber(this.state.employeePage);
      const res = (await this.UserClient.BatchGet(reqObj)).toObject();
      this.setState(
        prevState => ({
          employees: prevState.employees.concat(res.resultsList),
          employeePage: prevState.employeePage + 1,
          employeeTotalCount: res.totalCount,
        }),
        resolve,
      );
    });
  }

  async fetchAllEmployees(): Promise<Boolean> {
    await this.fetchEmployees();
    if (this.state.employees.length !== this.state.employeeTotalCount) {
      return this.fetchAllEmployees();
    } else {
      return true;
    }
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

  fetchCalls() {
    return new Promise(async resolve => {
      const reqObj = new Event();
      reqObj.setDateStarted(`${this.getDateString()}%`);
      reqObj.setPageNumber(this.state.callsPage);
      reqObj.setIsActive(1);
      reqObj.setLogTechnicianAssigned(`%${this.state.selectedID}%`);
      const res = (await this.EventClient.BatchGet(reqObj)).toObject();
      this.setState(
        prevState => ({
          calls: prevState.calls.concat(res.resultsList),
          callsPage: prevState.callsPage + 1,
          callTotalCount: res.totalCount,
        }),
        resolve,
      );
    });
  }

  fetchAllCalls(): Promise<boolean> {
    return new Promise(async resolve => {
      await this.fetchCalls();
      if (this.state.calls.length !== this.state.callTotalCount) {
        return this.fetchAllCalls();
      } else {
        this.setState(
          {
            callsPage: 0,
            callTotalCount: 0,
          },
          () => resolve(true),
        );
      }
    });
  }

  async componentDidMount() {
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
              disabled={
                this.state.employeeTotalCount !== this.state.employees.length
              }
            >
              <option value={0}>Select an Employee</option>
              {this.state.employees
                .sort(
                  (a, b) =>
                    a.firstname.charCodeAt(0) - b.firstname.charCodeAt(0),
                )
                .map(emp => (
                  <option
                    key={`${emp.id}-${emp.lastname}`}
                    value={emp.id}
                  >{`${emp.firstname} ${emp.lastname}`}</option>
                ))}
            </NativeSelect>
          </FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date Started"
              value={this.state.date}
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
            {this.state.calls.map(c => (
              <TableRow
                hover
                onClick={() => {
                  if (c.customer) {
                    window.location.href = `https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${c.id}&property_id=${c.propertyId}&user_id=${c.customer.id}`;
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
      </Grid>
    );
  }
}
