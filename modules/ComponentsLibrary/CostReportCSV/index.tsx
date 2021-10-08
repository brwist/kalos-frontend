import { NULL_TIME } from '@kalos-core/kalos-rpc/constants';
import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import React, { FC, useCallback, useEffect, useState, useReducer } from 'react';
import { IRS_SUGGESTED_MILE_FACTOR, MEALS_RATE } from '../../../constants';
import {
  formatDate,
  usd,
  PerDiemClientService,
  EventClientService,
  TimesheetLineClientService,
  TransactionClientService,
  TimesheetDepartmentClientService,
  TaskClientService,
} from '../../../helpers';
import { reducer, ACTIONS } from './reducer';
import { PrintList } from '../PrintList';
import { PrintPage, Status } from '../PrintPage';
import { PrintParagraph } from '../PrintParagraph';
import { PrintTable } from '../PrintTable';
import { getPropertyAddress } from '@kalos-core/kalos-rpc/Property';
import { PerDiem, PerDiemRow } from '@kalos-core/kalos-rpc/PerDiem';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { SectionBar } from '../SectionBar';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import Button from '@material-ui/core/Button';
import { Button as KalosButton } from '../Button';
import { Trip } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { Task } from '@kalos-core/kalos-rpc/Task';
import { differenceInMinutes, parseISO } from 'date-fns';
import { roundNumber, downloadCSV } from '../../../helpers';
import { Tabs } from '../Tabs';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse/Collapse';
import { PrintHeader } from '../PrintHeader';
export interface Props {
  serviceCallId: number;
  loggedUserId: number;
  onClose?: () => void;
}

export type SearchType = {
  technicians: string;
  statusId: number;
  priorityId: number;
};

export const GetTotalTransactions = (transactions: Transaction[]) => {
  return transactions.reduce((aggr, txn) => aggr + txn.getAmount(), 0);
};

export const CostReportCSV: FC<Props> = ({ serviceCallId }) => {
  let tripsRendered: Trip[] = [];
  const tabs = [
    'JobDetails',
    'Transactions',
    'PerDiems',
    'Timesheets',
    'Trips',
  ];
  const [state, dispatch] = useReducer(reducer, {
    loaded: false,
    loading: true,
    perDiems: [],
    timesheets: [],
    transactions: [],
    lodgings: {},
    loadingEvent: true,
    loadedInit: false,
    event: undefined,
    trips: [],
    tripsTotal: 0,
    tasks: [],
    dropDowns: [],
    totalHoursWorked: 0,
    activeTab: tabs[0],
  });

  const totalTasksBillable = state.tasks.reduce(
    (aggr, task) => aggr + task.getBillable(),
    0,
  );

  const loadResources = useCallback(async () => {
    const resultsList = (
      await PerDiemClientService.loadPerDiemsByEventId(serviceCallId)
    ).getResultsList();
    const mappedResults = resultsList.map(perdiem => ({
      perDiemId: perdiem.getId(),
      active: 0,
    }));
    dispatch({ type: ACTIONS.SET_DROPDOWNS, data: mappedResults });

    let arr: PerDiem[] = [];
    resultsList.forEach(result => {
      let isIncluded = false;
      arr.forEach(arrItem => {
        if (arrItem.getId() == result.getId()) isIncluded = true;
      });
      if (!isIncluded) {
        arr.push(result);
      }
    });
    for (let i = 0; i < arr.length; i++) {
      const tempRowList = arr[i]
        .getRowsList()
        .filter(row => row.getServiceCallId() === serviceCallId);
      arr[i].setRowsList(tempRowList);
    }

    const tripReq = new Trip();
    tripReq.setIsActive(true);
    tripReq.setJobNumber(serviceCallId);
    const allTrips = await (
      await PerDiemClientService.BatchGetTrips(tripReq)
    ).getResultsList();

    dispatch({ type: ACTIONS.SET_TRIPS, data: allTrips });

    const lodgings = await PerDiemClientService.loadPerDiemsLodging(arr); // first # is per diem id
    dispatch({ type: ACTIONS.SET_LODGINGS, data: lodgings });

    const transactions = await TransactionClientService.loadTransactionsByEventId(
      serviceCallId,
      true,
    );
    dispatch({ type: ACTIONS.SET_TRANSACTIONS, data: transactions });

    let allTripsTotal = 0;
    allTrips.forEach(trip => {
      // Subtracting 30 miles flat from trip distance in accordance
      // with reimbursement from home rule
      allTripsTotal +=
        trip.getDistanceInMiles() > 30 && trip.getHomeTravel()
          ? (trip.getDistanceInMiles() - 30) * IRS_SUGGESTED_MILE_FACTOR
          : trip.getDistanceInMiles() * IRS_SUGGESTED_MILE_FACTOR;
    });

    dispatch({ type: ACTIONS.SET_TRIPS_TOTAL, data: allTripsTotal });

    dispatch({ type: ACTIONS.SET_PER_DIEMS, data: arr });
  }, [serviceCallId]);

  const totalMeals =
    state.perDiems.reduce((aggr, pd) => aggr + pd.getRowsList().length, 0) *
    MEALS_RATE;
  const totalLodging = state.perDiems
    .reduce((aggr, pd) => [...aggr, ...pd.getRowsList()], [] as PerDiemRow[])
    .filter(pd => !pd.getMealsOnly())
    .reduce((aggr, pd) => aggr + state.lodgings[pd.getId()], 0);
  const totalTransactions = state.transactions.reduce(
    (aggr, pd) => aggr + pd.getAmount(),
    0,
  );

  const loadEvent = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING_EVENT, data: true });

    //const event = await loadEventById(serviceCallId);
    const event = await EventClientService.LoadEventByServiceCallID(
      serviceCallId,
    );
    dispatch({ type: ACTIONS.SET_EVENT, data: event });
    dispatch({ type: ACTIONS.SET_LOADING_EVENT, data: false });
  }, [serviceCallId]);

  const loadInit = useCallback(async () => {
    await loadEvent();
    dispatch({ type: ACTIONS.SET_LOADED_INIT, data: true });
  }, [loadEvent]);

  const load = useCallback(async () => {
    let promises = [];
    let timesheets: TimesheetLine[] = [];

    dispatch({ type: ACTIONS.SET_LOADING, data: true });

    promises.push(
      new Promise<void>(async resolve => {
        await loadResources();
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        try {
          let req = new TimesheetLine();
          req.setReferenceNumber(serviceCallId.toString());

          timesheets = (
            await TimesheetLineClientService.BatchGet(req)
          ).getResultsList();
          console.log('timesheets', timesheets);
          resolve();
        } catch (err) {
          console.error(
            'Error occurred while loading the timesheet lines for the cost report. Error: ',
            err,
          );
        }
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        try {
          let req = new Task();
          req.setEventId(serviceCallId);

          const tasks = (
            await TaskClientService.BatchGet(req)
          ).getResultsList();
          dispatch({ type: ACTIONS.SET_TASKS, data: tasks });

          resolve();
        } catch (err) {
          console.error(
            `Error occurred while loading the tasks for the cost report. Error: ${err}`,
          );
        }
      }),
    );

    Promise.all(promises).then(() => {
      for (let i = 0; i < timesheets.length; i++) {
        timesheets[i].setHoursWorked(
          roundNumber(
            differenceInMinutes(
              parseISO(timesheets[i].getTimeFinished()),
              parseISO(timesheets[i].getTimeStarted()),
            ) / 60,
          ),
        );
      }
      dispatch({ type: ACTIONS.SET_TIMESHEETS, data: timesheets });

      let total = 0;
      timesheets.forEach(
        timesheet => (total = total + timesheet.getHoursWorked()),
      );
      dispatch({ type: ACTIONS.SET_TOTAL_HOURS_WORKED, data: total });
      dispatch({ type: ACTIONS.SET_LOADING, data: false });

      dispatch({ type: ACTIONS.SET_LOADED, data: true });
    });
  }, [loadResources, serviceCallId]);
  const createReport = (section: string) => {
    let fullString = '';
    var find = ',';
    var re = new RegExp(find, 'g');
    if (section === 'JobDetails' && state.event) {
      fullString = ' Full Address , Job Timespan' + `\r\n`;

      const address = getPropertyAddress(state.event.getProperty()).replace(
        re,
        '',
      );
      fullString =
        fullString +
        address +
        ',' +
        formatDate(state.event!.getDateStarted()) +
        formatDate(state.event!.getDateEnded()) +
        `\r\n`;
      const costString = `Type, Total \r\n Total Hours Worked ,${state.totalHoursWorked} \r\n
     Transactions, ${totalTransactions} \r\n  
     Meals,${totalMeals} \r\n 
     Lodging,${totalLodging} \r\n 
     Tasks Billable,${totalTasksBillable} \r\n 
     Trips Total,${state.tripsTotal} \r\n `;
      fullString = fullString + costString;
    }
    if (section == 'Timesheets') {
      fullString =
        ' Technician,Department,Approved By,Time Started,Time Ended,Description,Hours,Notes' +
        `\r\n`;
      for (let i = 0; i < state.timesheets.length; i++) {
        let t = state.timesheets[i];
        let tempString =
          t.getTechnicianUserName().replace(',', '') +
          ',' +
          t.getDepartmentName().replace(',', '') +
          ',' +
          t.getAdminApprovalUserName().replace(',', '') +
          ',' +
          t.getTimeStarted().replace(',', '') +
          ',' +
          t.getTimeFinished().replace(',', '') +
          ',' +
          t.getBriefDescription().replace(',', '') +
          ',' +
          t.getHoursWorked() +
          ',' +
          t.getNotes().replace(',', '') +
          `\r\n`;
        fullString = fullString + tempString;
      }
    }
    if (section == 'Transactions' && state.transactions) {
      fullString =
        'Transaction Report' +
        `\r\n` +
        ' Department,Owner,Cost Center / Vendor,Date,Amount,Notes' +
        `\r\n`;
      for (let i = 0; i < state.transactions.length; i++) {
        let t = state.transactions[i];
        let tempString =
          t.getDepartment()?.getClassification().replace(',', '') +
          '-' +
          t.getDepartment()?.getDescription().replace(',', '') +
          ',' +
          t.getOwnerName().replace(',', '') +
          ',' +
          t.getCostCenter()?.getDescription() +
          '-' +
          t.getVendor().replace(',', '') +
          ',' +
          formatDate(t.getTimestamp()) +
          ',' +
          usd(t.getAmount()) +
          ',' +
          t.getNotes().replace(',', '') +
          `\r\n`;
        fullString = fullString + tempString;
      }
    }
    if (section == 'PerDiems' && state.transactions) {
      fullString =
        ' Department,Owner,Submitted Date,Approved By,Approved Date,Total Meals,Total Lodging,Notes' +
        `\r\n`;
      for (let i = 0; i < state.perDiems.length; i++) {
        let t = state.perDiems[i];
        const rowsList = t.getRowsList();
        const totalMeals = MEALS_RATE * rowsList.length;
        const totalLodging = rowsList.reduce(
          (aggr, pd) =>
            aggr + (pd.getMealsOnly() ? 0 : state.lodgings[pd.getId()]),
          0,
        );
        let tempString =
          TimesheetDepartmentClientService.getDepartmentName(
            t.getDepartment()!,
          ).replace(re, '') +
          ',' +
          t.getOwnerName() +
          ',' +
          (t.getDateSubmitted() != NULL_TIME
            ? formatDate(t.getDateSubmitted())
            : '-') +
          ',' +
          (t.getApprovedByName() || '-') +
          ',' +
          (t.getDateApproved() != NULL_TIME
            ? formatDate(t.getDateApproved())
            : '-') +
          ',' +
          usd(totalMeals) +
          ',' +
          (totalLodging != 0 ? usd(totalLodging) : '-') +
          ',' +
          t.getNotes() +
          `\r\n`;
        console.log(tempString);
        fullString = fullString + tempString;
      }
    }
    if (section == 'Trips' && state.transactions) {
      fullString =
        ' Date,Origin,Destination,Distance (in Miles),Home Travel ,Cost, Notes' +
        `\r\n`;
      for (let i = 0; i < state.trips.length; i++) {
        let t = state.trips[i];
        let tempString =
          formatDate(t.getDate()) +
          ',' +
          t.getOriginAddress().replace(re, '') +
          ',' +
          t.getDestinationAddress().replace(re, '') +
          ',' +
          t.getDistanceInMiles() +
          ',' +
          (t.getHomeTravel() == true ? 'Yes' : 'No') +
          ',' +
          usd(
            t.getDistanceInMiles() > 30 && t.getHomeTravel()
              ? Number(
                  (
                    (t.getDistanceInMiles() - 30) *
                    IRS_SUGGESTED_MILE_FACTOR
                  ).toFixed(2),
                )
              : Number(
                  (t.getDistanceInMiles() * IRS_SUGGESTED_MILE_FACTOR).toFixed(
                    2,
                  ),
                ),
          ) +
          ',' +
          t.getNotes().replace(re, '') +
          `\r\n`;
        fullString = fullString + tempString;
      }
    }

    downloadCSV(state.activeTab + ' Report For ' + serviceCallId, fullString);
  };
  useEffect(() => {
    if (!state.loadedInit) {
      console.log('loading init');
      loadInit();
    }
    if (state.loadedInit == true && state.loaded === false) {
      console.log('loading');

      load();
    }
  }, [state.loadedInit, loadInit, state.loaded, load]);
  /*
   */

  return state.loaded ? (
    <div>
      <style>{`
  .InfoTableItem {
    font-size: 10px;
    font-size: 1.0vw;

    }
  `}</style>

      <div hidden={!state.loaded || state.activeTab == 'JobDetails'}>
        <KalosButton
          label="Download CSV"
          onClick={() => {
            createReport(state.activeTab);
          }}
        ></KalosButton>
      </div>
      <Tabs
        onChange={e =>
          dispatch({ type: ACTIONS.SET_ACTIVE_TAB, data: tabs[e] })
        }
        tabs={[
          {
            label: 'Job Details',
            content: state.event && (
              <div>
                <PrintList
                  items={[
                    <div key="address" style={{ fontSize: '1.0vw' }}>
                      <strong>Address: </strong>
                      {getPropertyAddress(state.event.getProperty())}
                    </div>,
                    <div key="startDate" style={{ fontSize: '1.0vw' }}>
                      <strong>Start Date: </strong>
                      {formatDate(state.event.getDateStarted())}
                    </div>,
                    <div key="endDate" style={{ fontSize: '1.0vw' }}>
                      <strong>End Date: </strong>
                      {formatDate(state.event.getDateEnded())}
                    </div>,
                    <div key="jobNumber" style={{ fontSize: '1.0vw' }}>
                      <strong>Job Number: </strong>
                      {state.event.getLogJobNumber()}
                    </div>,
                  ]}
                />
                <div key="CostSummary">
                  <InfoTable
                    columns={[{ name: 'Type' }, { name: 'Total' }]}
                    data={[
                      [
                        {
                          value: 'Total Hours Worked',
                        },

                        {
                          value:
                            state.totalHoursWorked > 1
                              ? `${state.totalHoursWorked} hrs`
                              : state.totalHoursWorked == 0
                              ? 'None'
                              : `${state.totalHoursWorked} hr`,
                        },
                      ],
                    ]}
                  />
                  <PrintParagraph tag="h2">Costs</PrintParagraph>
                  <InfoTable
                    columns={[
                      { name: 'Type', align: 'left' },
                      { name: 'Cost', align: 'left' },
                    ]}
                    data={[
                      [
                        { value: 'Transactions' },
                        { value: usd(totalTransactions) },
                      ],
                      [{ value: 'Meals' }, { value: usd(totalMeals) }],
                      [{ value: 'Lodging' }, { value: usd(totalLodging) }],
                      [
                        { value: 'Tasks Billable' },
                        { value: usd(totalTasksBillable) },
                      ],
                      [
                        { value: 'Trips Total' },
                        { value: usd(state.tripsTotal) },
                      ],
                      [
                        {
                          value: <strong key="stronk">TOTAL:</strong>,
                        },
                        {
                          value: (
                            <strong key="stronk">
                              TOTAL:
                              {usd(
                                totalMeals +
                                  totalLodging +
                                  totalTransactions +
                                  totalTasksBillable,
                              )}
                            </strong>
                          ),
                        },
                      ],
                    ]}
                  />
                </div>
              </div>
            ),
          },

          {
            label: 'Transactions',
            content: (
              <InfoTable
                styles={{ width: '100%', padding: 10 }}
                columns={[
                  {
                    name: 'Department',
                    align: 'left',
                  },
                  {
                    name: 'Owner',
                    align: 'left',
                  },
                  {
                    name: 'Cost Center / Vendor',
                    align: 'left',
                  },
                  {
                    name: 'Date',
                    align: 'left',
                  },
                  {
                    name: 'Amount',
                    align: 'left',
                  },
                  {
                    name: 'Notes',
                    align: 'left',
                  },
                ]}
                data={state.transactions.map(txn => {
                  return [
                    {
                      value: txn.getDepartment() ? (
                        <div>
                          {txn.getDepartment()?.getClassification()} -{' '}
                          {txn.getDepartment()?.getDescription()}
                        </div>
                      ) : (
                        '-'
                      ),
                    },

                    { value: txn.getOwnerName() },

                    {
                      value: `${txn
                        .getCostCenter()
                        ?.getDescription()} - ${txn.getVendor()}`,
                    },
                    { value: formatDate(txn.getTimestamp()) },
                    { value: usd(txn.getAmount()) },

                    {
                      value: (
                        <div style={{ fontSizeAdjust: '0.5' }}>
                          {txn.getNotes()}
                        </div>
                      ),
                    },
                  ];
                })}
              />
            ),
          },

          {
            label: 'PerDiems',
            content: state.perDiems
              .sort((a, b) =>
                a.getDateSubmitted() > b.getDateSubmitted() ? -1 : 1,
              )
              .map(pd => {
                const rowsList = pd.getRowsList();
                const totalMeals = MEALS_RATE * rowsList.length;
                const totalLodging = rowsList.reduce(
                  (aggr, pd) =>
                    aggr + (pd.getMealsOnly() ? 0 : state.lodgings[pd.getId()]),
                  0,
                );
                if (totalMeals == 0 && totalLodging == 0) {
                  return <></>; // Don't show it
                }
                return (
                  <SectionBar
                    key={pd.getId().toString() + 'Header'}
                    title={`Per Diem  ${
                      pd.getDateSubmitted().split(' ')[0] !=
                      NULL_TIME.split(' ')[0]
                        ? '-'
                        : ''
                    }
                  ${
                    pd.getDateSubmitted().split(' ')[0] !=
                    NULL_TIME.split(' ')[0]
                      ? pd.getDateSubmitted().split(' ')[0]
                      : ''
                  }
                  ${pd.getOwnerName() ? '-' : ''} ${pd.getOwnerName()}`}
                  >
                    <div
                      style={{
                        breakInside: 'avoid',
                        display: 'inline-block',
                        width: '100%',
                      }}
                      key="PerDiemContainer"
                    >
                      <InfoTable
                        columns={[
                          {
                            name: 'Department',
                            align: 'left',
                          },
                          {
                            name: 'Owner',
                            align: 'left',
                          },
                          {
                            name: 'Submitted At',
                            align: 'left',
                          },
                          {
                            name: 'Approved By',
                            align: 'left',
                          },
                          {
                            name: 'Approved At',
                            align: 'left',
                          },
                          {
                            name: 'Total Meals',
                            align: 'left',
                          },
                          {
                            name: 'Total Lodging',
                            align: 'left',
                          },
                          {
                            name: 'Notes',
                            align: 'left',
                          },
                        ]}
                        data={[
                          [
                            {
                              value: TimesheetDepartmentClientService.getDepartmentName(
                                pd.getDepartment()!,
                              ),
                            },
                            { value: pd.getOwnerName() },
                            {
                              value:
                                pd.getDateSubmitted() != NULL_TIME
                                  ? formatDate(pd.getDateSubmitted())
                                  : '-' || '-',
                            },
                            { value: pd.getApprovedByName() || '-' },
                            {
                              value:
                                pd.getDateApproved() != NULL_TIME
                                  ? formatDate(pd.getDateApproved())
                                  : '-' || '-',
                            },
                            { value: usd(totalMeals) },
                            {
                              value:
                                totalLodging != 0 ? usd(totalLodging) : '-',
                            },
                            { value: pd.getNotes() },
                          ],
                        ]}
                      />
                      <Button
                        key={'dropDownbutton' + pd.getId().toString()}
                        onClick={() => {
                          let tempDropDowns = state.dropDowns;
                          const dropdown = tempDropDowns.findIndex(
                            dropdown => dropdown.perDiemId === pd.getId(),
                          );
                          if (tempDropDowns[dropdown]) {
                            console.log('we found the dropdown');
                            if (tempDropDowns[dropdown].active == 0)
                              tempDropDowns[dropdown].active = 1;
                            else tempDropDowns[dropdown].active = 0;
                          }
                          console.log('we are called');
                          console.log(tempDropDowns);
                          dispatch({
                            type: ACTIONS.SET_DROPDOWNS,
                            data: tempDropDowns,
                          });
                        }}
                      >
                        Details
                        {state.dropDowns.find(
                          dropdown => dropdown.perDiemId === pd.getId(),
                        )!.active == 1 ? (
                          <ExpandLess></ExpandLess>
                        ) : (
                          <ExpandMore></ExpandMore>
                        )}
                      </Button>
                    </div>
                    <Collapse
                      key={pd.getId().toString() + 'collapse'}
                      in={
                        state.dropDowns.find(
                          dropdown => dropdown.perDiemId === pd.getId(),
                        )?.active == 1
                          ? true
                          : false
                      }
                    >
                      <InfoTable
                        key={pd.getId().toString() + 'days'}
                        columns={[
                          {
                            name: 'Date',
                            align: 'left',
                          },
                          {
                            name: 'Zip Code',
                            align: 'left',
                          },
                          {
                            name: 'Meals Only',
                            align: 'left',
                          },
                          {
                            name: 'Meals',
                            align: 'left',
                          },
                          {
                            name: 'Lodging',
                            align: 'left',
                          },
                          {
                            name: 'Notes',
                            align: 'left',
                          },
                        ]}
                        data={rowsList.map(pdr => {
                          return [
                            { value: formatDate(pdr.getDateString()) },
                            { value: pdr.getZipCode() },
                            { value: pdr.getMealsOnly() ? 'Yes' : 'No' },
                            { value: usd(MEALS_RATE) },
                            {
                              value: state.lodgings[pdr.getId()]
                                ? usd(state.lodgings[pdr.getId()])
                                : '-',
                            },
                            { value: pdr.getNotes() },
                          ];
                        })}
                      />
                    </Collapse>
                  </SectionBar>
                );
              }),
          },

          {
            label: 'Timesheets',
            content: (
              <div key={'TimesheetData'}>
                <InfoTable
                  columns={[
                    {
                      name: 'Technician',
                      align: 'left',
                    },
                    {
                      name: 'Department',
                      align: 'left',
                    },
                    {
                      name: 'Approved By',
                      align: 'left',
                    },
                    {
                      name: 'Time Started',
                      align: 'left',
                    },
                    {
                      name: 'Time Finished',
                      align: 'left',
                    },
                    {
                      name: 'Brief Description',
                      align: 'left',
                    },
                    {
                      name: 'Hours Worked',
                      align: 'left',
                    },
                    {
                      name: 'Notes',
                      align: 'right',
                    },
                  ]}
                  data={state.timesheets.map(tsl => {
                    return [
                      {
                        value:
                          tsl.getTechnicianUserName() +
                          ` (${tsl.getTechnicianUserId()})`,
                      },
                      { value: tsl.getDepartmentName() },
                      { value: tsl.getAdminApprovalUserName() },
                      { value: formatDate(tsl.getTimeStarted()) || '-' },
                      { value: formatDate(tsl.getTimeFinished()) || '-' },
                      { value: tsl.getBriefDescription() },
                      {
                        value:
                          tsl.getHoursWorked() != 0
                            ? tsl.getHoursWorked() > 1
                              ? `${tsl.getHoursWorked()} hrs`
                              : `${tsl.getHoursWorked()} hr`
                            : '-',
                      },
                      { value: tsl.getNotes() },
                    ];
                  })}
                />
              </div>
            ),
          },

          {
            label: 'Trips',
            content:
              state.trips &&
              state.trips.map(trip => {
                let included = false;
                tripsRendered.forEach(tripRendered => {
                  if (tripRendered.getId() == trip.getId()) included = true;
                });
                if (included) return <> </>;

                tripsRendered.push(trip);
                return (
                  <div
                    key={trip.getId()}
                    style={{
                      breakInside: 'avoid',
                      display: 'inline-block',
                      width: '100%',
                    }}
                  >
                    <InfoTable
                      columns={[
                        {
                          name: 'Date',
                          align: 'left',
                        },
                        {
                          name: 'Origin Address',
                          align: 'left',
                        },
                        {
                          name: 'Destination Address',
                          align: 'left',
                        },
                        {
                          name: 'Distance (Miles)',
                          align: 'left',
                        },
                        {
                          name: 'Notes',
                          align: 'left',
                        },
                        {
                          name: 'Home Travel',
                          align: 'right',
                        },
                        {
                          name: `Cost (${usd(IRS_SUGGESTED_MILE_FACTOR)}/mi)`,
                          align: 'right',
                        },
                        {
                          name: 'Per Diem Row ID',
                          align: 'right',
                        },
                      ]}
                      data={[
                        [
                          { value: formatDate(trip.getDate()) },
                          { value: trip.getOriginAddress() },
                          { value: trip.getDestinationAddress() },
                          { value: trip.getDistanceInMiles().toFixed(2) },
                          { value: trip.getNotes() },
                          { value: trip.getHomeTravel() },
                          {
                            value: `${usd(
                              trip.getDistanceInMiles() > 30 &&
                                trip.getHomeTravel()
                                ? Number(
                                    (
                                      (trip.getDistanceInMiles() - 30) *
                                      IRS_SUGGESTED_MILE_FACTOR
                                    ).toFixed(2),
                                  )
                                : Number(
                                    (
                                      trip.getDistanceInMiles() *
                                      IRS_SUGGESTED_MILE_FACTOR
                                    ).toFixed(2),
                                  ),
                            )} 
                          ${
                            trip.getDistanceInMiles() > 30 &&
                            trip.getHomeTravel()
                              ? '(30 miles docked for home travel)'
                              : ''
                          }`,
                          },
                          { value: trip.getPerDiemRowId() },
                        ],
                      ]}
                    />
                  </div>
                );
              }),
          },
        ]}
      ></Tabs>
    </div>
  ) : (
    <Loader></Loader>
  );
};
