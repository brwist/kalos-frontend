import React from 'react';
import { MetricsClient } from '@kalos-core/kalos-rpc/Metrics';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { TaskClient } from '@kalos-core/kalos-rpc/Task';
import { TimeoffRequestClient } from '@kalos-core/kalos-rpc/TimeoffRequest';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Spiff } from '@kalos-core/kalos-rpc/compiled-protos/task_pb';
import { MetricTile } from './components/MetricTile';
import { Widget } from './components/Widget';
import { Assignments } from './components/AssignmentsTable';
import { Spiffs } from './components/SpiffsTable';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { Typography } from '@material-ui/core';
import { Search } from '../Search/main';
import { ENDPOINT } from '../../constants';
import { PageWrapper } from '../PageWrapper/main';

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
  todaysEvents: Event.AsObject[];
  toolFundBalance: number;
  availablePTO: number;
  isLoading: boolean;
  currentUser: User.AsObject;
  spiffs: Spiff.AsObject[];
}

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
      todaysEvents: [],
      toolFundBalance: 0,
      availablePTO: 0,
      isLoading: false,
      currentUser: new User().toObject(),
      spiffs: [new Spiff().toObject()],
    };

    this.MetricsClient = new MetricsClient(ENDPOINT);
    this.TxnClient = new TransactionClient(ENDPOINT);
    this.EventClient = new EventClient(ENDPOINT);
    this.TaskClient = new TaskClient(ENDPOINT);
    this.UserClient = new UserClient(ENDPOINT);
    this.PTOCLient = new TimeoffRequestClient(ENDPOINT);
  }

  toggleLoading() {
    return new Promise((resolve) => {
      this.setState(
        (prevState) => ({
          isLoading: !prevState.isLoading,
        }),
        resolve
      );
    });
  }

  async getTransactionCount() {
    const txn = new Transaction();
    txn.setOwnerId(this.props.userId);
    txn.setStatusId(1);
    const res = await this.TxnClient.BatchGet(txn);
    this.setState({
      receiptCount: res.getTotalCount(),
    });
  }

  async getRecentEvents() {
    const event = new Event();
    event.setLogTechnicianAssigned(`%${this.props.userId}%`);
    event.setOrderBy('date_started');
    event.setOrderDir('desc');
    event.setIsActive(1);
    const res = await this.EventClient.BatchGet(event);
    this.setState({
      recentEvents: res.toObject().resultsList,
    });
  }
  async getIdentity() {
    const user = new User();
    user.setId(this.props.userId);
    const res = await this.UserClient.Get(user);
    this.setState({
      currentUser: res,
    });
  }

  async getBillable() {
    if (this.state.currentUser.isHvacTech === 1) {
      const res = await this.MetricsClient.GetBillable(this.props.userId);
      this.setState({
        billable: parseInt(res.value.toFixed(2)),
      });
    } else {
      return false;
    }
  }

  async getAvgTicket() {
    if (this.state.currentUser.isHvacTech === 1) {
      const res = await this.MetricsClient.GetAvgTicket(this.props.userId);
      this.setState({
        avgTicket: parseInt(res.value.toFixed(2)),
      });
    } else {
      return false;
    }
  }

  async getCallbackCount() {
    if (this.state.currentUser.isHvacTech === 1) {
      const res = await this.MetricsClient.GetCallbacks(this.props.userId);
      this.setState({
        callbacks: res.value,
      });
    } else {
      return false;
    }
  }

  async getRevenue() {
    if (this.state.currentUser.isHvacTech === 1) {
      const res = await this.MetricsClient.GetRevenue(this.props.userId);
      this.setState({
        revenue: parseInt(res.value.toFixed(2)),
      });
    } else {
      return false;
    }
  }

  async getToolfundBalance() {
    if (this.state.currentUser.toolFund > 0) {
      const res = await this.TaskClient.GetToolFundBalanceByID(
        this.props.userId
      );
      this.setState({
        toolFundBalance: parseInt(res.getValue().toFixed(2)),
      });
    } else {
      return false;
    }
  }

  async getPTO() {
    const res = await this.PTOCLient.PTOInquiry(this.props.userId);
    this.setState({
      availablePTO: res.getHoursAvailable(),
    });
  }

  async getSpiffList() {
    const res = await this.TaskClient.GetAppliedSpiffs(this.props.userId);
    this.setState({
      //@ts-ignore
      spiffs: res.resultsListList,
    });
  }

  async componentDidMount() {
    await this.MetricsClient.GetToken('test', 'test');
    await this.toggleLoading();
    await this.getIdentity();
    await this.getPTO();
    await this.getTransactionCount();
    await this.getSpiffList();
    await this.getRecentEvents();
    await this.getBillable();
    await this.getAvgTicket();
    await this.getRevenue();
    await this.getCallbackCount();
    await this.getToolfundBalance();
    await this.toggleLoading();
  }

  render() {
    return (
      <PageWrapper userID={this.props.userId}>
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
                  disabled={
                    this.state.isLoading && this.state.availablePTO === 0
                  }
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
                  disabled={
                    this.state.isLoading && this.state.receiptCount === 0
                  }
                  color="primary"
                  variant="contained"
                  href="https://app.kalosflorida.com/index.cfm?action=admin:reports.transactions"
                >
                  Go To Receipts
                </Button>
              }
            ></Widget>
            {this.state.currentUser.toolFund > 0 && (
              <Widget
                title="Tool Fund Balance"
                subtitle=""
                displayData={`$${this.state.toolFundBalance}`}
                displaySubtitle=""
                isLoading={this.state.isLoading}
                action={
                  <Button
                    disabled={
                      this.state.isLoading && this.state.toolFundBalance === 0
                    }
                    color="primary"
                    variant="contained"
                    href={`https://app.kalosflorida.com/index.cfm?action=admin:tasks.spiff_tool_logs&rt=all&type=tool&reportUserId=${this.props.userId}`}
                  >
                    Go To Tool Fund
                  </Button>
                }
              ></Widget>
            )}
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
          <Typography
            variant="h5"
            component="span"
            style={{
              alignSelf: 'flex-start',
              marginLeft: '6%',
            }}
          >
            Search
          </Typography>
          {this.state.currentUser.isEmployee === 1 && (
            <Search
              containerStyle={{
                width: '90%',
                maxHeight: 400,
                overflowY: 'scroll',
                marginBottom: 20,
              }}
            />
          )}
          {this.state.spiffs.length !== 0 && (
            <Spiffs
              spiffs={this.state.spiffs}
              isLoading={this.state.isLoading}
            />
          )}
          {this.state.currentUser.isHvacTech === 1 && (
            <Assignments
              events={this.state.recentEvents}
              isLoading={this.state.isLoading}
            />
          )}
        </Grid>
      </PageWrapper>
    );
  }
}
