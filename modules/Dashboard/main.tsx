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
import Paper from '@material-ui/core/Paper';
import { Spiff } from '@kalos-core/kalos-rpc/compiled-protos/task_pb';
import { Assignments } from './components/AssignmentsTable';
import { Spiffs } from './components/SpiffsTable';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { SearchIndex } from '../SearchIndex/main';
import { ENDPOINT } from '../../constants';
import { usd, makeFakeRows, UserClientService } from '../../helpers';
import { InfoTable } from '../ComponentsLibrary/InfoTable';
import { Button } from '../ComponentsLibrary/Button';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { Tooltip } from '../ComponentsLibrary/Tooltip';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { ManagerTimeoffs } from '../ComponentsLibrary/ManagerTimeoffs';
import './styles.less';
import { SpiffTool } from '../SpiffToolLogs/components/SpiffTool';
interface props extends PageWrapperProps {
  userId: number;
}

interface state {
  billable: number;
  avgTicket: number;
  callbacks: number;
  revenue: number;
  receiptCount: number;
  recentEvents: Event[];
  todaysEvents: Event[];
  toolFundBalance: number;
  availablePTO: number;
  isLoading: boolean;
  currentUser: User;
  spiffs: Spiff[];
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
      currentUser: new User(),
      spiffs: [new Spiff()],
    };

    this.MetricsClient = new MetricsClient(ENDPOINT);
    this.TxnClient = new TransactionClient(ENDPOINT);
    this.EventClient = new EventClient(ENDPOINT);
    this.TaskClient = new TaskClient(ENDPOINT);
    this.UserClient = new UserClient(ENDPOINT);
    this.PTOCLient = new TimeoffRequestClient(ENDPOINT);
  }

  toggleLoading() {
    return new Promise<void>(resolve => {
      this.setState(
        prevState => ({
          isLoading: !prevState.isLoading,
        }),
        () => resolve(),
      );
    });
  }

  async getTransactionCount() {
    const txn = new Transaction();
    txn.setOwnerId(this.props.userId);
    txn.setStatusId(1);
    txn.setIsActive(1);
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
      recentEvents: res.getResultsList(),
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
    if (this.state.currentUser.getIsHvacTech() === 1) {
      const res = await this.MetricsClient.GetBillable(this.props.userId);
      this.setState({
        billable: parseInt(res.getValue().toFixed(2)),
      });
    } else {
      return false;
    }
  }

  async getAvgTicket() {
    if (this.state.currentUser.getIsHvacTech() === 1) {
      const res = await this.MetricsClient.GetAvgTicket(this.props.userId);
      this.setState({
        avgTicket: parseInt(res.getValue().toFixed(2)),
      });
    } else {
      return false;
    }
  }

  async getCallbackCount() {
    if (this.state.currentUser.getIsHvacTech() === 1) {
      const res = await this.MetricsClient.GetCallbacks(this.props.userId);
      this.setState({
        callbacks: res.getValue(),
      });
    } else {
      return false;
    }
  }

  async getRevenue() {
    if (this.state.currentUser.getIsHvacTech() === 1) {
      const res = await this.MetricsClient.GetRevenue(this.props.userId);
      this.setState({
        revenue: parseInt(res.getValue().toFixed(2)),
      });
    } else {
      return false;
    }
  }

  async getToolfundBalance() {
    if (this.state.currentUser.getToolFund() > 0) {
      const res = await this.TaskClient.GetToolFundBalanceByID(
        this.props.userId,
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
      spiffs: res.getResultsListList(),
    });
  }

  async componentDidMount() {
    // await UserClientService.refreshToken();
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
    const { userId } = this.props;
    const {
      isLoading,
      availablePTO,
      receiptCount,
      toolFundBalance,
      currentUser,
    } = this.state;
    return (
      <PageWrapper {...this.props} userID={this.props.userId}>
        {currentUser.getIsEmployee() ? (
          <div
            style={{
              textAlign: 'center',
              alignContent: 'center',
              alignSelf: 'center',
            }}
          >
            <strong>Employee Badge ID:{currentUser.getId()}</strong>
          </div>
        ) : (
          []
        )}
        <InfoTable
          columns={[
            { name: '', align: 'center' },
            { name: '', align: 'center' },
            { name: '', align: 'center' },
            ...(currentUser.getToolFund() > 0
              ? [{ name: '', align: 'center' as const }]
              : []),
          ]}
          data={
            isLoading
              ? makeFakeRows(currentUser.getToolFund() > 0 ? 3 : 2, 1)
              : [
                  [
                    {
                      value: (
                        <>
                          <strong>Available PTO</strong>
                          <br />
                          <big className="DashboardMetric">
                            {availablePTO}
                          </big>{' '}
                          hours
                          <br />
                          <Button
                            label="Request Time Off"
                            disabled={isLoading && availablePTO === 0}
                            onClick={() =>
                              (document.location.href =
                                'https://app.kalosflorida.com/index.cfm?action=admin:timesheet.addTimeOffRequest')
                            }
                          />
                        </>
                      ),
                    },
                    {
                      value: (
                        <>
                          <strong>Missing Receipts</strong>
                          <br />
                          <big className="DashboardMetric">{receiptCount}</big>
                          <br />
                          <Button
                            label="Go To Receipts"
                            disabled={isLoading && receiptCount === 0}
                            onClick={() =>
                              (document.location.href =
                                'https://app.kalosflorida.com/index.cfm?action=admin:reports.transactions')
                            }
                          />
                        </>
                      ),
                    },
                    ...(this.state.currentUser
                      .getPermissionGroupsList()
                      .find(p => p.getType() === 'role')
                      ? [
                          {
                            value: (
                              <>
                                <br />
                                <br />
                                <br />
                                <Button
                                  label="View Payroll Dashboard"
                                  onClick={() =>
                                    (document.location.href =
                                      'https://app.kalosflorida.com/index.cfm?action=admin:reports.payroll')
                                  }
                                />
                              </>
                            ),
                          },
                        ]
                      : []),
                    ...(currentUser.getToolFund() > 0
                      ? [
                          {
                            value: (
                              <>
                                <strong>Tool Fund Balance</strong>
                                <br />
                                <big className="DashboardMetric">
                                  {usd(toolFundBalance)}
                                </big>
                                <br />
                                <Button
                                  label="Go To Tool Fund"
                                  disabled={
                                    isLoading &&
                                    receiptCount === toolFundBalance
                                  }
                                  onClick={() =>
                                    (document.location.href = `https://app.kalosflorida.com/index.cfm?action=admin:tasks.spiff_tool_logs&rt=all&type=tool&reportUserId=${userId}`)
                                  }
                                />
                              </>
                            ),
                          },
                        ]
                      : []),
                    ...(currentUser
                      .getPermissionGroupsList()
                      .find(p => p.getName() === 'AccountsPayable')
                      ? [
                          {
                            value: (
                              <>
                                <br />
                                <br />
                                <br />
                                <Button
                                  label="Go To Accounts Payable"
                                  disabled={isLoading}
                                  onClick={() =>
                                    (document.location.href = `https://app.kalosflorida.com/index.cfm?action=admin:reports.transaction_billing`)
                                  }
                                />
                              </>
                            ),
                          },
                        ]
                      : []),
                  ],
                ]
          }
          loading={isLoading}
        />
        {this.state.currentUser.getIsHvacTech() === 1 && (
          <>
            <SectionBar title="30 Day Stats" sticky={false} />
            <InfoTable
              columns={[
                { name: '', align: 'center' },
                { name: '', align: 'center' },
                { name: '', align: 'center' },
                { name: '', align: 'center' },
              ]}
              data={
                this.state.isLoading
                  ? makeFakeRows(4, 1)
                  : [
                      [
                        {
                          value: (
                            <Tooltip
                              content="Average billable revenue earned per hour for the last 30 days"
                              placement="bottom"
                            >
                              <span>
                                <strong>Billable per Hour</strong>
                                <br />
                                <big className="DashboardMetric">
                                  {usd(this.state.billable)}
                                </big>
                              </span>
                            </Tooltip>
                          ),
                        },
                        {
                          value: (
                            <Tooltip
                              content="Number of callbacks for the last 30 days"
                              placement="bottom"
                            >
                              <span>
                                <strong>Number of Callbacks</strong>
                                <br />
                                <big className="DashboardMetric">
                                  {this.state.callbacks}
                                </big>
                              </span>
                            </Tooltip>
                          ),
                        },
                        {
                          value: (
                            <Tooltip
                              content="Average amount invoiced per service call for the last 30 days"
                              placement="bottom"
                            >
                              <span>
                                <strong>Avg Ticket Amount</strong>
                                <br />
                                <big className="DashboardMetric">
                                  {usd(this.state.avgTicket)}
                                </big>
                              </span>
                            </Tooltip>
                          ),
                        },
                        {
                          value: (
                            <Tooltip
                              content="Total revenue earned for the company in the last 30 days"
                              placement="bottom"
                            >
                              <span>
                                <strong>Revenue Earned</strong>
                                <br />
                                <big className="DashboardMetric">
                                  {usd(this.state.revenue)}
                                </big>
                              </span>
                            </Tooltip>
                          ),
                        },
                      ],
                    ]
              }
              loading={this.state.isLoading}
            />
          </>
        )}
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          style={{
            height: '100%',
            overflowY: 'scroll',
            maxWidth: window.innerWidth,
          }}
        >
          <ManagerTimeoffs loggedUserId={this.props.userId} />
          {this.state.currentUser.getIsEmployee() === 1 && (
            <Paper
              elevation={7}
              style={{
                width: '90%',
                maxHeight: 650,
                overflowY: 'scroll',
                marginBottom: 20,
              }}
            >
              <SearchIndex loggedUserId={this.props.userId} />
            </Paper>
          )}
          {this.state.spiffs.length !== 0 && (
            <Spiffs
              spiffs={this.state.spiffs}
              isLoading={this.state.isLoading}
            />
          )}
          {this.state.currentUser.getIsHvacTech() === 1 && (
            <Assignments
              events={this.state.recentEvents}
              isLoading={this.state.isLoading}
            />
          )}
          {this.state.currentUser.getToolFund() > 0 && (
            <Paper
              elevation={7}
              style={{
                width: '90%',
                maxHeight: 650,
                overflowY: 'scroll',
                marginBottom: 20,
              }}
            >
              <SpiffTool
                loggedUserId={currentUser.getId()}
                ownerId={currentUser.getId()}
                disableActions={true}
                type="Tool"
              />
            </Paper>
          )}
        </Grid>
      </PageWrapper>
    );
  }
}
