import React from 'react';
import Button from '@material-ui/core/Button';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
  MaterialUiPickersDate,
  TimePicker,
} from '@material-ui/pickers';
import NativeSelect from '@material-ui/core/NativeSelect';
import { InputLabel, FormControl, TextField } from '@material-ui/core';
import { EVENT_STATUS_LIST } from '../../constants';

interface props {
  eventID: number;
}

interface state {
  event: Event.AsObject;
}

export class ServiceCallDetail extends React.PureComponent<props, state> {
  EventClient: EventClient;
  constructor(props: props) {
    super(props);
    this.state = {
      event: new Event().toObject(),
    };
    this.EventClient = new EventClient();
    this.fetchEvent = this.fetchEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  updateEvent<K extends keyof Event.AsObject>(prop: K) {
    return async (value: Event.AsObject[K]) => {
      const event = new Event();
      const upperCaseProp = `${prop[0].toUpperCase()}${prop.slice(1)}`;
      console.log(prop, upperCaseProp);
      const methodName = `set${upperCaseProp}`;
      console.log(methodName);
      event.setId(this.state.event.id);
      //@ts-ignore
      event[methodName](value);
      event.setFieldMaskList([upperCaseProp]);
      console.log(event.toObject());
      const updatedEvent = await this.EventClient.Update(event);
      this.setState(() => ({ event: updatedEvent }));
    };
  }
  updateBriefDescription = this.updateEvent('name');
  updateAmountQuoted = this.updateEvent('amountQuoted');
  updateIsCallback = this.updateEvent('isCallback');
  updateIsLMPC = this.updateEvent('isLmpc');
  updateIsDiagnosticQuoted = this.updateEvent('diagnosticQuoted');
  updateIsResidential = this.updateEvent('isResidential');
  updateDateStarted = this.updateEvent('dateStarted');
  updateDateEnded = this.updateEvent('dateEnded');
  updateNotes = this.updateEvent('notes');
  updateTimeStarted = this.updateEvent('timeStarted');
  updateTimeEnded = this.updateEvent('timeEnded');

  handleTextInput(fn: (val: string) => Promise<void>) {
    return (e: React.SyntheticEvent<HTMLInputElement>) => {
      fn(e.target.value);
    };
  }
  handleBriefDescription = this.handleTextInput(this.updateBriefDescription);
  handleAmountQuoted = this.handleTextInput(this.updateAmountQuoted);

  handleSelect(fn: (val: number) => Promise<void>) {
    return (e: React.SyntheticEvent<HTMLSelectElement>) => {
      // @ts-ignore
      const value = parseInt(e.target.value);
      if (value !== undefined) {
        fn(value);
      }
    };
  }

  handleIsCallback = this.handleSelect(this.updateIsCallback);
  handleIsLMPC = this.handleSelect(this.updateIsLMPC);
  handleIsResidentialChange = this.handleSelect(this.updateIsResidential);
  handleIsDiagnosticQuoted = this.handleSelect(this.updateIsDiagnosticQuoted);

  onDateChange(fn: (str: string) => Promise<void>) {
    return (date: MaterialUiPickersDate) => {
      if (date) {
        const monthPrefix = date.getMonth() + 1 < 10 ? '0' : '';
        const dayPrefix = date.getDate() < 10 ? '0' : '';
        const dateString = `${date.getFullYear()}-${monthPrefix}${date.getMonth() +
          1}-${dayPrefix}${date.getDate()} 00:00:00`;
        fn(dateString);
      }
    };
  }
  onStartDateChange = this.onDateChange(this.updateDateStarted);
  onEndDateChange = this.onDateChange(this.updateDateEnded);

  onTimeChange(fn: (str: string) => Promise<void>) {
    return (date: MaterialUiPickersDate) => {
      if (date) {
        console.log(date.getHours(), date.getMinutes());
        const hourPrefix = date.getHours() < 10 ? '0' : '';
        const minutePrefix = date.getMinutes() < 10 ? '0' : '';
        const dateString = `${hourPrefix}${date.getHours()}:${minutePrefix}${date.getMinutes()}`;
        fn(dateString);
      }
    };
  }
  onStartTimeChange = this.onTimeChange(this.updateTimeStarted);
  onEndTimeChange = this.onTimeChange(this.updateTimeEnded);

  async fetchEvent() {
    const event = new Event();
    event.setId(this.props.eventID);
    const result = await this.EventClient.Get(event);
    this.setState({
      event: result,
    });
  }

  async componentDidMount() {
    await this.EventClient.GetToken('gavinorr', 'G@vin123');
    this.fetchEvent();
  }

  render() {
    const { event } = this.state;
    const startTime = event.dateStarted.split(' ')[0] + 'T' + event.timeStarted;
    const endTime = event.dateEnded.split(' ')[0] + 'T' + event.timeEnded;

    if (event.id) {
      return (
        <Grid container direction="column" alignItems="center">
          <Grid container direction="row" justify="space-evenly" wrap="nowrap">
            <Grid container direction="column" style={{ padding: 5 }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date Started"
                  value={new Date(event.dateStarted.replace(' ', 'T'))}
                  onChange={this.onStartDateChange}
                />
                <DatePicker
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date Ended"
                  value={new Date(event.dateEnded.replace(' ', 'T'))}
                  onChange={this.onEndDateChange}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid
              container
              direction="column"
              justify="space-between"
              style={{ padding: 5 }}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <TimePicker
                  label="Start Time"
                  margin="normal"
                  value={startTime}
                  onChange={this.onStartTimeChange}
                  minutesStep={5}
                />
                <TimePicker
                  label="End Time"
                  margin="normal"
                  value={endTime}
                  onChange={this.onEndTimeChange}
                  minutesStep={5}
                />
              </MuiPickersUtilsProvider>
              <FormControl style={{ marginTop: 10 }}>
                <InputLabel htmlFor="age-native-helper">Sector</InputLabel>
                <NativeSelect
                  value={event.isResidential}
                  onChange={this.handleIsResidentialChange}
                  inputProps={{
                    id: 'age-native-helper',
                  }}
                >
                  <option value={0}>Commercial</option>
                  <option value={1}>Residential</option>
                </NativeSelect>
              </FormControl>
              <FormControl style={{ marginTop: 10 }}>
                <InputLabel htmlFor="dq-select">Diagnostic Quoted</InputLabel>
                <NativeSelect
                  value={event.diagnosticQuoted}
                  onChange={this.handleIsDiagnosticQuoted}
                  inputProps={{
                    id: 'dq-select',
                  }}
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </NativeSelect>
              </FormControl>
              <FormControl style={{ marginTop: 10 }}>
                <InputLabel htmlFor="LMPC-select">Is LMPC?</InputLabel>
                <NativeSelect
                  value={event.isLmpc}
                  onChange={this.handleIsLMPC}
                  inputProps={{
                    id: 'LMPC-select',
                  }}
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </NativeSelect>
              </FormControl>
              <FormControl style={{ marginTop: 10 }}>
                <InputLabel htmlFor="LMPC-select">Is Callback?</InputLabel>
                <NativeSelect
                  value={event.isCallback}
                  onChange={this.handleIsCallback}
                  inputProps={{
                    id: 'IsCallback-select',
                  }}
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </NativeSelect>
              </FormControl>
              <TextField
                onChange={this.handleAmountQuoted}
                label="Amount Quoted"
                margin="normal"
                variant="outlined"
                value={event.amountQuoted}
              />
              <TextField
                onChange={this.handleBriefDescription}
                label="Brief Description"
                margin="normal"
                variant="outlined"
                value={event.name}
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-evenly"
            wrap="nowrap"
          >
            bottom row
          </Grid>
          {/*<Button variant="contained" onClick={() => alert("No me likey")}>
          Click
    </Button>*/}
        </Grid>
      );
    } else return null;
  }
}
