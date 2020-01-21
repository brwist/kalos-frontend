import React from 'react';
import {
  MetricsClient,
  Billable,
  AvgTicket,
  Revenue,
  Callbacks,
} from '@kalos-core/kalos-rpc/Metrics';
import {
  Transaction,
  TransactionClient,
  TransactionList,
} from '@kalos-core/kalos-rpc/Transaction';
import { EventClient, Event, EventList } from '@kalos-core/kalos-rpc/Event';
import { TaskClient } from '@kalos-core/kalos-rpc/Task';
import { TimeoffRequestClient } from '@kalos-core/kalos-rpc/TimeoffRequest';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import themes from '../Theme/main';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  ToolFund,
  SpiffList,
  Spiff,
} from '@kalos-core/kalos-rpc/compiled-protos/task_pb';
import { PTO } from '@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb';
import { MetricTile } from './components/MetricTile';
import { Widget } from './components/Widget';
import { Assignments } from './components/AssignmentsTable';
import { Spiffs } from './components/SpiffsTable';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { Typography } from '@material-ui/core';

interface props {
  userId: number;
}

interface state {
  billable: number;
  avgTicket: number;
  callbacks: number;
  revenue: number;
  receiptCount: number;
  recentEvents: Event.AsObject[];
  toolFundBalance: number;
  availablePTO: number;
  isLoading: boolean;
  currentUser: User.AsObject;
  spiffs: Spiff.AsObject[];
}

type PromiseArr = [
  Billable.AsObject,
  AvgTicket.AsObject,
  Callbacks.AsObject,
  Revenue.AsObject,
  TransactionList,
  EventList,
  ToolFund,
  User.AsObject,
  PTO,
  SpiffList.AsObject,
];

export class Dashboard extends React.PureComponent<props, state> {
  MetricsClient: MetricsClient;
  TxnClient: TransactionClient;
  EventClient: EventClient;
  TaskClient: TaskClient;
  UserClient: UserClient;
  PTOCLient: TimeoffRequestClient;
  constructor(props: props) {
    super(props);
    this.state = {
      billable: 0,
      avgTicket: 0,
      callbacks: 0,
      revenue: 0,
      receiptCount: 0,
      recentEvents: [],
      toolFundBalance: 0,
      availablePTO: 0,
      isLoading: true,
      currentUser: new User().toObject(),
      spiffs: [],
    };

    const endpoint = 'https://core-dev.kalosflorida.com:8443';
    this.MetricsClient = new MetricsClient(endpoint);
    this.TxnClient = new TransactionClient(endpoint);
    this.EventClient = new EventClient(endpoint);
    this.TaskClient = new TaskClient(endpoint);
    this.UserClient = new UserClient(endpoint);
    this.PTOCLient = new TimeoffRequestClient(endpoint);
  }

  async getMetrics(): Promise<void> {
    try {
      const txn = new Transaction();
      txn.setOwnerId(this.props.userId);
      txn.setStatusId(1);

      const event = new Event();
      event.setLogTechnicianAssigned(`%${this.props.userId}%`);
      event.setOrderBy('date_started');
      event.setOrderDir('desc');
      event.setIsActive(1);

      const user = new User();
      user.setId(this.props.userId);

      const promiseArr = [
        this.MetricsClient.GetBillable(this.props.userId),
        this.MetricsClient.GetAvgTicket(this.props.userId),
        this.MetricsClient.GetCallbacks(this.props.userId),
        this.MetricsClient.GetRevenue(this.props.userId),
        this.TxnClient.BatchGet(txn),
        this.EventClient.BatchGet(event),
        this.TaskClient.GetToolFundBalanceByID(this.props.userId),
        this.UserClient.Get(user),
        this.PTOCLient.PTOInquiry(this.props.userId),
        this.TaskClient.GetAppliedSpiffs(this.props.userId),
      ];
      //@ts-ignore
      const res: PromiseArr = await Promise.all(promiseArr);
      console.log(res[8]);
      this.setState({
        billable: res[0].value,
        avgTicket: res[1].value,
        callbacks: res[2].value,
        revenue: res[3].value,
        receiptCount: res[4].getTotalCount(),
        recentEvents: res[5].toObject().resultsList,
        toolFundBalance: res[6].getValue(),
        currentUser: res[7],
        availablePTO: res[8].getHoursAvailable(),
        spiffs: res[9].resultsListList,
        isLoading: false,
      });
    } catch (err) {
      console.log('metrics could not be fetched', err);
      if (err === 'Response closed without headers') {
        return await this.getMetrics();
      } else {
        this.setState({
          isLoading: false,
        });
      }
    }
  }

  async componentDidMount() {
    await this.MetricsClient.GetToken('test', 'test');
    await this.getMetrics();
  }

  render() {
    return (
      <ThemeProvider theme={themes.lightTheme}>
        <CssBaseline />
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
          style={{
            height: '100%',
            overflowY: 'scroll',
            maxWidth: window.innerWidth,
          }}
        >
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
          >
            <Widget
              title="Available PTO"
              subtitle=""
              displayData={`${this.state.availablePTO}`}
              displaySubtitle="hours"
              isLoading={this.state.isLoading}
              action={
                <Button
                  disabled={this.state.isLoading}
                  color="primary"
                  variant="contained"
                  href="https://app.kalosflorida.com/index.cfm?action=admin:timesheet.addTimeOffRequest"
                >
                  Request Time Off
                </Button>
              }
            />
            <Widget
              title="Missing Receipts"
              subtitle=""
              displayData={`${this.state.receiptCount}`}
              displaySubtitle=""
              isLoading={this.state.isLoading}
              action={
                <Button
                  disabled={this.state.isLoading}
                  color="primary"
                  variant="contained"
                  href="https://app.kalosflorida.com/index.cfm?action=admin:reports.transactions"
                >
                  Go To Receipts
                </Button>
              }
            ></Widget>
            <Widget
              title="Tool Fund Balance"
              subtitle=""
              displayData={`$${this.state.toolFundBalance}`}
              displaySubtitle=""
              isLoading={this.state.isLoading}
              action={
                <Button
                  disabled={this.state.isLoading}
                  color="primary"
                  variant="contained"
                  href={`https://app.kalosflorida.com/index.cfm?action=admin:tasks.spiff_tool_logs&rt=all&type=tool&reportUserId=${this.props.userId}`}
                >
                  Go To Tool Fund
                </Button>
              }
            ></Widget>
          </Grid>
          {this.state.currentUser.isHvacTech === 1 && (
            <>
              <Typography
                variant="h5"
                component="span"
                style={{
                  alignSelf: 'flex-start',
                  marginLeft: '6%',
                }}
              >
                30 Day Stats
              </Typography>
              <Paper
                elevation={7}
                style={{ width: '90%', marginBottom: 20, padding: 10 }}
              >
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                >
                  <MetricTile
                    title="Billable per Hour"
                    subtitle={`$${this.state.billable}`}
                    isLoading={this.state.isLoading}
                    tooltip="Average billable revenue earned per hour for the last 30 days"
                  />
                  <MetricTile
                    title="Number of Callbacks"
                    subtitle={`${this.state.callbacks}`}
                    isLoading={this.state.isLoading}
                    tooltip="Number of callbacks for the last 30 days"
                  />
                  <MetricTile
                    title="Avg Ticket Amount"
                    subtitle={`$${this.state.avgTicket}`}
                    isLoading={this.state.isLoading}
                    tooltip="Average amount invoiced per service call for the last 30 days"
                  />
                  <MetricTile
                    title="Revenue Earned"
                    subtitle={`$${this.state.revenue}`}
                    isLoading={this.state.isLoading}
                    tooltip="Total revenue earned for the company in the last 30 days"
                  />
                </Grid>
              </Paper>
            </>
          )}
          <Spiffs spiffs={this.state.spiffs} isLoading={this.state.isLoading} />
          <Assignments
            events={this.state.recentEvents}
            isLoading={this.state.isLoading}
          />
        </Grid>
      </ThemeProvider>
    );
  }
}
