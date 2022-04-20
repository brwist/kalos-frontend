import { NULL_TIME } from '../../../@kalos-core/kalos-rpc/constants';
import { TimesheetLine } from '../../../@kalos-core/kalos-rpc/TimesheetLine';
import React, { FC, useCallback, useEffect, useState, useReducer } from 'react';
import { IRS_SUGGESTED_MILE_FACTOR, ENDPOINT } from '../../../constants';
import {
  formatDate,
  usd,
  PerDiemClientService,
  EventClientService,
  TimesheetDepartmentClientService,
  TransactionAccountClientService,
  UserClientService,
} from '../../../helpers';
import {
  ClassCode,
  ClassCodeClient,
} from '../../../@kalos-core/kalos-rpc/ClassCode';
import { reducer, ACTIONS, WeekClassCodeBreakdownSubtotal } from './reducer';
import { PrintList } from '../PrintList';
import { PrintPage, Status } from '../PrintPage';
import { PrintParagraph } from '../PrintParagraph';
import { PrintTable } from '../PrintTable';
import { getPropertyAddress } from '../../../@kalos-core/kalos-rpc/Property';
import { PerDiem, PerDiemRow } from '../../../@kalos-core/kalos-rpc/PerDiem';
import { Transaction } from '../../../@kalos-core/kalos-rpc/Transaction';
import { Event } from '../../../@kalos-core/kalos-rpc/Event';
import {
  CostReportData,
  CostReportReq,
} from '../../../@kalos-core/kalos-rpc/compiled-protos/event_pb';

import { SectionBar } from '../SectionBar';
import { InfoTable } from '../InfoTable';
import { User } from '../../../@kalos-core/kalos-rpc/User';
import { Loader } from '../../Loader/main';
import { AltGallery, GalleryData } from '../../AltGallery/main';
import Button from '@material-ui/core/Button';
import { Button as KalosButton } from '../Button';
import { Trip } from '../../../@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { Task } from '../../../@kalos-core/kalos-rpc/Task';
import {
  differenceInMinutes,
  parseISO,
  startOfWeek,
  format,
  addDays,
  differenceInCalendarWeeks,
  endOfWeek,
} from 'date-fns';
import { roundNumber, downloadCSV } from '../../../helpers';
import { Tabs } from '../Tabs';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse/Collapse';
import { TransactionAccount } from '../../../@kalos-core/kalos-rpc/TransactionAccount';
import { PrintHeader } from '../PrintHeader';
import { OrderDir } from '../../../@kalos-core/kalos-rpc/Common';
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
export type Week = {
  weekStart: string;
  weekEnd: string;
  code: number;
};
export const GetTotalTransactions = (transactions: Transaction[]) => {
  return transactions.reduce((aggr, txn) => aggr + txn.getAmount(), 0);
};

export const CostReportCSV: FC<Props> = ({ serviceCallId, onClose }) => {
  let tripsRendered: Trip[] = [];
  const tabs = [
    'JobDetails',
    'Transactions',
    'PerDiems',
    'Timesheets',
    'Trips',
    'Tasks',
  ];
  const [state, dispatch] = useReducer(reducer, {
    loaded: false,
    loading: true,
    perDiems: [],
    timesheets: [],
    transactions: [],
    users: [],
    costCenterTotals: {},
    loadingEvent: true,
    loadedInit: false,
    event: undefined,
    laborTotals: {},
    transactionSort: { sortBy: 'amount', sortDir: 'ASC' },
    laborTotalsDropDownActive: false,
    transactionAccounts: [],
    trips: [],
    costCenterDropDownActive: false,
    tripsTotal: 0,
    tasks: [],
    classCodes: [],
    dropDowns: [],
    transactionDropDowns: [],
    classCodeDropdowns: [],
    timesheetWeeklySubtotals: [],
    totalHoursWorked: 0,
    activeTab: tabs[0],
    printStatus: 'idle',
  });

  const handlePrint = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_PRINT_STATUS, data: 'loading' });
    dispatch({ type: ACTIONS.SET_PRINT_STATUS, data: 'loaded' });
  }, []);
  const handlePrinted = useCallback(
    () => dispatch({ type: ACTIONS.SET_PRINT_STATUS, data: 'idle' }),
    [],
  );
  const loadEvent = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING_EVENT, data: true });

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
  const sortTransactions = useCallback(
    (transactions: Transaction[], sortDir: OrderDir, sortBy: string) => {
      let temp = transactions;
      if (sortBy === 'timestamp') {
        temp = temp.sort((a, b) => {
          const dateA = new Date(a.getTimestamp().split(' ')[0]);
          const dateB = new Date(b.getTimestamp().split(' ')[0]);

          if (sortDir === 'ASC') {
            return dateA.valueOf() - dateB.valueOf();
          } else {
            return dateB.valueOf() - dateA.valueOf();
          }
        });
      }

      if (sortBy === 'amount') {
        temp = temp.sort((a, b) => {
          if (sortDir === 'ASC') {
            return a.getAmount() - b.getAmount();
          } else {
            return b.getAmount() - a.getAmount();
          }
        });
      }

      if (sortBy === 'cost_center_id') {
        temp = temp.sort((a, b) => {
          if (sortDir === 'ASC') {
            return a.getCostCenterId() - b.getCostCenterId();
          } else {
            return b.getCostCenterId() - a.getCostCenterId();
          }
        });
      }

      if (sortBy === 'job_number') {
        temp = temp.sort((a, b) => {
          if (sortDir === 'ASC') {
            return a.getJobId() - b.getJobId();
          } else {
            return b.getJobId() - a.getJobId();
          }
        });
      }
      if (sortBy === 'owner_name') {
        temp = temp.sort((a, b) => {
          if (sortDir === 'ASC') {
            const splitA = a.getOwnerName().split(' ');
            const splitB = b.getOwnerName().split(' ');
            const lastA = splitA[splitA.length - 1].toLowerCase();
            const lastB = splitB[splitB.length - 1].toLowerCase();
            const firstA = splitA[0].toLowerCase();
            const firstB = splitB[0].toLowerCase();

            if (lastA + firstA < lastB + firstB) {
              return -1;
            }

            if (lastA + firstA > lastB + firstB) {
              return 1;
            }
            return 0;
          } else {
            const splitA = a.getOwnerName().split(' ');
            const splitB = b.getOwnerName().split(' ');
            const lastA = splitA[splitA.length - 1].toLowerCase();
            const lastB = splitB[splitB.length - 1].toLowerCase();
            const firstA = splitA[0].toLowerCase();
            const firstB = splitB[0].toLowerCase();

            if (lastA + firstA > lastB + firstB) {
              return -1;
            }

            if (lastA + firstA < lastB + firstB) {
              return 1;
            }
            return 0;
          }
        });
      }
      if (sortBy === 'description') {
        temp = temp.sort((a, b) => {
          if (sortDir === 'ASC') {
            return a.getVendor().localeCompare(b.getVendor());
          } else {
            return b.getVendor().localeCompare(a.getVendor());
          }
        });
      }
      return temp;
    },
    [],
  );
  const load = useCallback(async () => {
    let promises = [];
    let timesheets: TimesheetLine[] = [];
    let classCodes: ClassCode[] = [];
    let perDiems: PerDiem[] = [];
    let transactions: Transaction[] = [];
    let trips: Trip[] = [];
    let tasks: Task[] = [];

    dispatch({ type: ACTIONS.SET_LOADING, data: true });
    promises.push(
      new Promise<void>(async resolve => {
        try {
          const cccs = new ClassCodeClient(ENDPOINT);
          const classCodeReq = new ClassCode();
          classCodeReq.setIsActive(true);

          classCodes = (await cccs.BatchGet(classCodeReq)).getResultsList();
          dispatch({
            type: ACTIONS.SET_CLASS_CODES,
            data: classCodes,
          });
          const mappedResults = classCodes.map(code => ({
            classCodeId: code.getId(),
            active: 0,
          }));
          dispatch({
            type: ACTIONS.SET_CLASS_CODE_DROPDOWNS,
            data: mappedResults,
          });
          resolve();
        } catch (err) {
          console.log('error fetching class codes', err);
        }
      }),
    );
    promises.push(
      new Promise<void>(async resolve => {
        try {
          const userReq = new User();
          userReq.setIsEmployee(1);
          userReq.setOverrideLimit(true);
          const users = (
            await UserClientService.BatchGet(userReq)
          ).getResultsList();
          dispatch({
            type: ACTIONS.SET_USERS,
            data: users,
          });
          resolve();
        } catch (err) {
          console.log('error fetching users', err);
        }
      }),
    );
    promises.push(
      new Promise<void>(async resolve => {
        try {
          const perDiemReq = new PerDiem();
          perDiemReq.setWithRows(true);
          perDiemReq.setIsActive(true);
          perDiemReq.setWithoutLimit(true);
          perDiemReq.setPayrollProcessed(true);
          const row = new PerDiemRow();
          row.setServiceCallId(serviceCallId);
          perDiemReq.setReferenceRow(row);
          const taskReq = new Task();
          taskReq.setEventId(serviceCallId);
          taskReq.setBillable(1);
          taskReq.setIsActive(true);
          taskReq.setWithoutLimit(true);
          const timesheetReq = new TimesheetLine();
          //Currently using custom sql, so only Reference number matters
          timesheetReq.setWithoutLimit(true);
          timesheetReq.setReferenceNumber(serviceCallId.toString());
          timesheetReq.setIsActive(1);
          timesheetReq.setOrderBy('time_started');
          timesheetReq.setOrderDir('ASC');
          const tripReq = new Trip();
          tripReq.setIsActive(true);
          tripReq.setJobNumber(serviceCallId);
          tripReq.setWithoutLimit(true);
          const transactionReq = new Transaction();
          transactionReq.setJobId(serviceCallId);
          transactionReq.setIsActive(1);
          transactionReq.setWithoutLimit(true);
          const reportReq = new CostReportReq();
          reportReq.setPerdiemReq(perDiemReq);
          reportReq.setTaskReq(taskReq);
          reportReq.setTimesheetReq(timesheetReq);
          reportReq.setTransactionReq(transactionReq);
          reportReq.setTripReq(tripReq);

          try {
            const allResults = await EventClientService.BatchGetCostReportData(
              reportReq,
            );
            if (allResults.getPerDiemResults() !== undefined) {
              perDiems = allResults.getPerDiemResults()!.getResultsList();
            }
            if (allResults.getTaskResults() !== undefined) {
              tasks = allResults.getTaskResults()!.getResultsList();
            }
            if (allResults.getTimesheetResults() !== undefined) {
              timesheets = allResults.getTimesheetResults()!.getResultsList();
            }
            if (allResults.getTripResults() !== undefined) {
              trips = allResults.getTripResults()!.getResultsList();
            }
            if (allResults.getTransactionResults() !== undefined) {
              transactions = allResults
                .getTransactionResults()!
                .getResultsList();
            }
          } catch (err) {
            console.log('error with fetch data function:', err);
          }

          resolve();
        } catch (err) {
          console.log('error fetching data', err);
        }
      }),
    );
    promises.push(
      new Promise<void>(async resolve => {
        const accountReq = new TransactionAccount();
        accountReq.setIsActive(1);
        try {
          const accountRes = (
            await TransactionAccountClientService.BatchGet(accountReq)
          ).getResultsList();
          dispatch({
            type: ACTIONS.SET_TRANSACTION_ACCOUNTS,
            data: accountRes,
          });

          const costCenterMap = accountRes.map(account => ({
            costCenterId: account.getId(),
            active: 0,
          }));
          dispatch({
            type: ACTIONS.SET_TRANSACTION_DROPDOWNS,
            data: costCenterMap,
          });
          resolve();
        } catch (err) {
          console.log('error fetching accounts,', err);
        }
      }),
    );
    Promise.all(promises).then(async () => {
      console.log('all promises executed without error, setting loaded');

      let allTripsTotal = 0;
      trips.forEach(trip => {
        // Subtracting 30 miles flat from trip distance in accordance

        allTripsTotal += trip.getDistanceInMiles() * IRS_SUGGESTED_MILE_FACTOR;
      });
      let costCenterTemp: { [key: string]: number } = {};
      for (let i = 0; i < transactions.length; i++) {
        let keyValue = `${transactions[i].getCostCenterId()}-${transactions[i]
          .getCostCenter()
          ?.getDescription()}`;
        if (costCenterTemp[keyValue]) {
          costCenterTemp[keyValue] += transactions[i].getAmount();
        } else {
          //
          costCenterTemp[keyValue] = transactions[i].getAmount();
        }
      }
      dispatch({ type: ACTIONS.SET_COST_CENTER_TOTALS, data: costCenterTemp });

      dispatch({ type: ACTIONS.SET_TRIPS_TOTAL, data: allTripsTotal });
      const mappedResults = perDiems.map(perdiem => ({
        perDiemId: perdiem.getId(),
        active: 0,
      }));
      dispatch({ type: ACTIONS.SET_DROPDOWNS, data: mappedResults });
      let arr: PerDiem[] = [];
      perDiems.forEach(result => {
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

      if (timesheets.length > 0) {
        let weekList: WeekClassCodeBreakdownSubtotal[] = [];

        for (let i = 0; i < timesheets.length; i++) {
          let startWeek = new Date(parseISO(timesheets[i].getTimeStarted()));
          startWeek = startOfWeek(startWeek, { weekStartsOn: 6 });
          let endWeek = new Date(parseISO(timesheets[i].getTimeStarted()));
          endWeek = endOfWeek(endWeek, { weekStartsOn: 6 });
          const weekStruct = {
            weekStart: format(startWeek, 'yyyy-MM-dd'),
            weekEnd: format(endWeek, 'yyyy-MM-dd'),
            employeeId: timesheets[i].getTechnicianUserId(),
            hoursSubtotal: timesheets[i].getHoursWorked(),
            classCodeId: timesheets[i].getClassCodeId(),
          };
          let findExisting = weekList.findIndex(
            week =>
              week.classCodeId == weekStruct.classCodeId &&
              week.weekEnd == weekStruct.weekEnd &&
              week.weekStart === weekStruct.weekStart &&
              week.employeeId == weekStruct.employeeId,
          );
          if (findExisting != -1) {
            weekList[findExisting].hoursSubtotal += weekStruct.hoursSubtotal;
          } else {
            weekList.push(weekStruct);
          }
        }
        dispatch({
          type: ACTIONS.SET_TIMESHEET_WEEKLY_SUBTOTALS,
          data: weekList,
        });
      }

      let laborTemp = state.laborTotals;
      for (let i = 0; i < timesheets.length; i++) {
        let keyValue = timesheets[i].getClassCodeId().toString();
        if (laborTemp[keyValue]) {
          laborTemp[keyValue] += timesheets[i].getHoursWorked();
        } else {
          laborTemp[keyValue] = timesheets[i].getHoursWorked();
        }
      }
      dispatch({ type: ACTIONS.SET_LABOR_TOTALS, data: laborTemp });

      let total = 0;
      timesheets.forEach(
        timesheet => (total = total + timesheet.getHoursWorked()),
      );
      dispatch({
        type: ACTIONS.SET_ALL_DATA,
        data: {
          timesheetRes: timesheets,
          transactionRes: sortTransactions(transactions, 'ASC', 'amount'),
          perDiemRes: arr,
          taskRes: tasks,
          tripRes: trips,
        },
      });

      dispatch({ type: ACTIONS.SET_TOTAL_HOURS_WORKED, data: total });
      dispatch({ type: ACTIONS.SET_LOADING, data: false });
      dispatch({ type: ACTIONS.SET_LOADED, data: true });
    });
  }, [serviceCallId, state.laborTotals, sortTransactions]);
  const createReport = (section: string) => {
    const totalMeals = state.perDiems.reduce(
      (aggr, pd) => aggr + pd.getAmountProcessedMeals(),
      0,
    );
    const totalLodging = state.perDiems.reduce(
      (aggr, pd) => aggr + pd.getAmountProcessedLodging(),
      0,
    );
    const totalTransactions = state.transactions.reduce(
      (aggr, pd) => aggr + pd.getAmount(),
      0,
    );
    let fullString = '';
    var find = ',';
    var re = new RegExp(find, 'g');
    if (section === 'JobDetails' && state.event) {
      fullString = ' Type , Cost + `\r\n`';
      let costCenterString = '';

      state.transactionAccounts.map(account => {
        let findAccount = `${account.getId()}-${account.getDescription()}`;
        if (state.costCenterTotals[findAccount]) {
          costCenterString +=
            findAccount +
            ' ,' +
            usd(state.costCenterTotals[findAccount]).toString() +
            '\r\n';
        }
      });

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
      const costString =
        'Type, Total \r\n Total Hours Worked ,' +
        state.totalHoursWorked +
        ' \r\n Transactions,' +
        totalTransactions +
        '\r\n' +
        'Meals,' +
        totalMeals +
        '\r\n' +
        'Lodging,' +
        totalLodging +
        '\r\n' +
        'Tasks Billable,' +
        totalTasksBillable +
        '\r\nTrips Total,' +
        state.tripsTotal +
        '\r\n ';

      fullString = costString;
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
    if (section == 'PerDiems' && state.perDiems) {
      fullString =
        ' Department,Owner,Submitted Date,Approved By,Approved Date,Total Meals,Total Lodging,Notes' +
        `\r\n`;
      for (let i = 0; i < state.perDiems.length; i++) {
        let t = state.perDiems[i];
        const rowsList = t.getRowsList();
        const totalMeals = state.perDiems.reduce(
          (aggr, pd) => aggr + pd.getAmountProcessedMeals(),
          0,
        );
        const totalLodging = state.perDiems.reduce(
          (aggr, pd) => aggr + pd.getAmountProcessedLodging(),
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
        fullString = fullString + tempString;
      }
    }
    if (section == 'Trips' && state.trips) {
      fullString =
        ' Type,Date ,Destination,Distance (in Miles),Home Travel ,Cost, Notes' +
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
            Number(
              (t.getDistanceInMiles() * IRS_SUGGESTED_MILE_FACTOR).toFixed(2),
            ),
          ) +
          ',' +
          t.getNotes().replace(re, '') +
          `\r\n`;
        fullString = fullString + tempString;
      }
    }
    if (section == 'Tasks' && state.tasks) {
      fullString =
        'Date Performed,Type,Details,Flat Rate?,Amount, Notes' + `\r\n`;
      for (let i = 0; i < state.tasks.length; i++) {
        let t = state.tasks[i];
        let tempString =
          formatDate(t.getDatePerformed()) +
          ',' +
          t.getBillableType().replace(re, '') +
          ',' +
          t.getDetails().replace(re, '') +
          ',' +
          t.getFlatRate() +
          ',' +
          usd(
            t.getBillableType() === 'Spiff'
              ? t.getSpiffAmount()
              : t.getToolpurchaseCost(),
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
      loadInit();
    }
    if (state.loadedInit == true && state.loaded === false) {
      load();
    }
  }, [state.loadedInit, loadInit, state.loaded, load]);
  const costCenterArray = [['', '']];
  const laborCostArray = [['', '']];
  state.transactionAccounts.map(account => {
    let findAccount = `${account.getId()}-${account.getDescription()}`;
    if (state.costCenterTotals[findAccount]) {
      let value = [findAccount, usd(state.costCenterTotals[findAccount])];
      costCenterArray.push(value);
    }
  });
  function getGalleryData(txn: Transaction): GalleryData[] {
    return txn.getDocumentsList().map(d => {
      return {
        key: `${txn.getId()}-${d.getReference()}`,
        bucket: 'kalos-transactions',
        typeId: d.getTypeId(),
        description: d.getDescription(),
      };
    });
  }
  state.classCodes.map(code => {
    let findAccount = code.getId();
    if (state.laborTotals[findAccount]) {
      let value = [
        code.getDescription(),
        `${state.laborTotals[findAccount]} hour(s)`,
      ];
      laborCostArray.push(value);
    }
  });
  const totalMeals = state.perDiems.reduce(
    (aggr, pd) => aggr + pd.getAmountProcessedMeals(),
    0,
  );
  const totalLodging = state.perDiems.reduce(
    (aggr, pd) => aggr + pd.getAmountProcessedLodging(),
    0,
  );
  const totalTransactions = state.transactions.reduce(
    (aggr, pd) => aggr + pd.getAmount(),
    0,
  );
  const totalTasksBillable = state.tasks.reduce(
    (aggr, pd) => aggr + pd.getSpiffAmount(),
    0,
  );

  const weekArray: Week[] = [];

  for (let i = 0; i < state.timesheetWeeklySubtotals.length; i++) {
    let temp = state.timesheetWeeklySubtotals[i];
    let found = weekArray.find(
      week => temp.weekStart == week.weekStart && week.code == temp.classCodeId,
    );
    if (found == undefined) {
      weekArray.push({
        weekEnd: temp.weekEnd,
        weekStart: temp.weekStart,
        code: temp.classCodeId,
      });
    }
  }
  return state.loaded ? (
    <SectionBar key="ReportPage" uncollapsable={true}>
      <style>{`
  .InfoTableItem {
    font-size: 10px;
    font-size: 1.0vw;

    }
  `}</style>
      <div style={{ display: 'inline-block' }}>
        <PrintPage
          buttonProps={{
            label: 'Print Cost Report',
            loading: state.loading,
          }}
          downloadLabel="Download Cost Report"
          downloadPdfFilename="Cost-Report"
          headerProps={{ title: 'Project Cost Report' }}
          onPrint={handlePrint}
          onPrinted={handlePrinted}
          status={state.printStatus}
          key={state.printStatus}
          className="EditProjectAsideContent"
        >
          <PrintParagraph tag="h2" key="eventPDFHeader">
            Project Details
          </PrintParagraph>
          {state.event && (
            <PrintList
              key="eventColumns"
              items={[
                <>
                  <strong>Address: </strong>
                  {getPropertyAddress(state.event.getProperty())}
                </>,
                <>
                  <strong>Start Date: </strong>
                  {formatDate(state.event.getDateStarted())}
                </>,
                <>
                  <strong>End Date: </strong>
                  {formatDate(state.event.getDateEnded())}
                </>,
                <>
                  <strong>Job Number: </strong>
                  {state.event.getLogJobNumber()}
                </>,
              ]}
            />
          )}
          <PrintParagraph tag="h2" key="totalHeader1">
            Summary Info
          </PrintParagraph>
          <PrintTable
            key="totalColumns1"
            columns={[
              { title: 'Type', align: 'left' },
              { title: 'Total', align: 'right' },
            ]}
            data={[
              [
                'Total Hours Worked',
                state.totalHoursWorked > 1
                  ? `${state.totalHoursWorked} hrs`
                  : state.totalHoursWorked == 0
                  ? 'None'
                  : `${state.totalHoursWorked} hr`,
              ],
              [
                <PrintTable
                  key="TransactionBreakdownCategory"
                  columns={[
                    { title: '', align: 'left' },
                    { title: '', align: 'left' },
                  ]}
                  data={laborCostArray.map(labor => {
                    return labor;
                  })}
                ></PrintTable>,
              ],
            ]}
          />
          <PrintParagraph tag="h2" key="totalHeader2">
            Costs
          </PrintParagraph>
          <PrintTable
            key="totalColumns2"
            columns={[
              { title: 'Type', align: 'left' },
              { title: 'Cost', align: 'right' },
            ]}
            data={[
              ['Transactions', usd(totalTransactions)],
              [
                <PrintTable
                  key="TransactionBreakdownCategory"
                  columns={[
                    { title: 'Type', align: 'left' },
                    { title: 'SubCost', align: 'right' },
                  ]}
                  data={costCenterArray.map(costCenter => {
                    return costCenter;
                  })}
                ></PrintTable>,
              ],
              ['Meals', usd(totalMeals)],
              ['Lodging Processed', usd(totalLodging)],
              ['Tasks Billable', usd(totalTasksBillable)],
              ['Trips Total', usd(state.tripsTotal)],
              [
                '',
                <strong key="stronk">
                  TOTAL:{' '}
                  {usd(
                    totalMeals +
                      totalLodging +
                      totalTransactions +
                      totalTasksBillable,
                  )}
                </strong>,
              ],
            ]}
          />
          <PrintParagraph tag="h2" key="transactionColumns">
            Transactions
          </PrintParagraph>
          {state.transactionAccounts
            .filter(
              account =>
                state.costCenterTotals[
                  `${account.getId()}-${account.getDescription()}`
                ] != undefined,
            )
            .map(account => (
              <div key={account.getId()}>
                <PrintParagraph
                  tag="h3"
                  key={`${account.getId()}-${account.getDescription()}`}
                >{`${account.getId()}-${account.getDescription()}`}</PrintParagraph>
                <PrintTable
                  key={`${account.getId()}-${account.getDescription()}${account.getAccountCategory()}`}
                  columns={[
                    {
                      title: 'Department',
                      align: 'left',
                    },
                    {
                      title: 'Owner',
                      align: 'left',
                      widthPercentage: 10,
                    },
                    {
                      title: 'Cost Center / Vendor',
                      align: 'left',
                      widthPercentage: 10,
                    },
                    {
                      title: 'Date',
                      align: 'left',
                      widthPercentage: 10,
                    },
                    {
                      title: 'Amount',
                      align: 'left',
                      widthPercentage: 10,
                    },
                    {
                      title: 'Notes',
                      align: 'right',
                      widthPercentage: 20,
                    },
                  ]}
                  data={state.transactions
                    .filter(
                      transaction =>
                        transaction.getCostCenterId() === account.getId(),
                    )
                    .map(txn => {
                      return [
                        txn.getDepartment() ? (
                          <>
                            {txn.getDepartment()?.getClassification()} -{' '}
                            {txn.getDepartment()?.getDescription()}
                          </>
                        ) : (
                          '-'
                        ),
                        txn.getOwnerName(),
                        <>
                          {`${txn.getCostCenter()?.getDescription()}` + ' - '}
                          <br />
                          {txn.getVendor()}
                        </>,
                        formatDate(txn.getTimestamp()),
                        usd(txn.getAmount()),
                        txn.getNotes(),
                      ];
                    })}
                />
              </div>
            ))}
          <PrintParagraph tag="h2" key="perDiemColumns">
            Per Diem
          </PrintParagraph>
          {state.perDiems
            .sort((a, b) =>
              a.getDateSubmitted() > b.getDateSubmitted() ? -1 : 1,
            )
            .map(pd => {
              const rowsList = pd.getRowsList();
              let lodgingRows = rowsList.filter(
                row => row.getMealsOnly() == false,
              );
              const totalMeals = pd.getAmountProcessedMeals();
              const totalLodging = pd.getAmountProcessedLodging();
              if (totalMeals == 0 && totalLodging == 0) {
                return null; // Don't show it
              }
              return (
                <div key={pd.getId() + 'pdf'}>
                  <PrintParagraph tag="h3">
                    Per Diem{' '}
                    {pd.getDateSubmitted().split(' ')[0] !=
                    NULL_TIME.split(' ')[0]
                      ? '-'
                      : ''}{' '}
                    {pd.getDateSubmitted().split(' ')[0] !=
                    NULL_TIME.split(' ')[0]
                      ? pd.getDateSubmitted().split(' ')[0]
                      : ''}{' '}
                    {pd.getOwnerName() ? '-' : ''} {pd.getOwnerName()}
                  </PrintParagraph>
                  <div
                    key={'PerDiemTablePDF' + pd.getId()}
                    style={{
                      breakInside: 'avoid',
                      display: 'inline-block',
                      width: '100%',
                    }}
                  >
                    <PrintTable
                      columns={[
                        {
                          title: 'Department',
                          align: 'left',
                        },
                        {
                          title: 'Owner',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Submitted At',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Approved By',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Approved At',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Total Meals',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Total Lodging',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Notes',
                          align: 'right',
                          widthPercentage: 20,
                        },
                      ]}
                      data={[
                        [
                          TimesheetDepartmentClientService.getDepartmentName(
                            pd.getDepartment()!,
                          ),
                          pd.getOwnerName(),
                          pd.getDateSubmitted() != NULL_TIME
                            ? formatDate(pd.getDateSubmitted())
                            : '-' || '-',
                          pd.getApprovedByName() || '-',
                          pd.getDateApproved() != NULL_TIME
                            ? formatDate(pd.getDateApproved())
                            : '-' || '-',
                          usd(totalMeals),
                          totalLodging != 0 ? usd(totalLodging) : '-',
                          pd.getNotes(),
                        ],
                      ]}
                    />
                  </div>
                  <PrintParagraph tag="h4">Per Diem Days</PrintParagraph>
                  <div
                    key={'PerDiemDaysPDF'}
                    style={{
                      breakInside: 'avoid',
                      display: 'inline-block',
                      width: '100%',
                    }}
                  >
                    <PrintTable
                      columns={[
                        {
                          title: 'Date',
                          align: 'left',
                        },
                        {
                          title: 'Zip Code',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Meals Only',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Meals',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Lodging',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Notes',
                          align: 'right',
                          widthPercentage: 20,
                        },
                      ]}
                      data={rowsList.map(pdr => {
                        return [
                          formatDate(pdr.getDateString()),
                          pdr.getZipCode(),
                          pdr.getMealsOnly() ? 'Yes' : 'No',
                          usd(
                            pd.getAmountProcessedMeals() / lodgingRows.length,
                          ),
                          pdr.getMealsOnly() === false
                            ? usd(
                                pd.getAmountProcessedLodging() /
                                  lodgingRows.length,
                              )
                            : '-',
                          pdr.getNotes(),
                        ];
                      })}
                    />
                  </div>
                </div>
              );
            })}
          <PrintParagraph tag="h2" key="timesheetsHeader">
            Labor Summary
          </PrintParagraph>
          {state.classCodes
            .filter(code => state.laborTotals[code.getId()] != undefined)
            .map(code => (
              <div key={code.getId()}>
                <PrintParagraph
                  key={`${code.getId()}-${code.getDescription()}`}
                  tag="h3"
                >{`${code.getId()}-${code.getDescription()}`}</PrintParagraph>

                <PrintTable
                  columns={[
                    {
                      title: 'Technician',
                      align: 'left',
                    },
                    {
                      title: 'Department',
                      align: 'left',
                      widthPercentage: 10,
                    },
                    {
                      title: 'Approved By',
                      align: 'left',
                      widthPercentage: 10,
                    },
                    {
                      title: 'Time Started',
                      align: 'left',
                      widthPercentage: 10,
                    },
                    {
                      title: 'Time Finished',
                      align: 'left',
                      widthPercentage: 10,
                    },
                    {
                      title: 'Brief Description',
                      align: 'left',
                      widthPercentage: 10,
                    },
                    {
                      title: 'Hours Worked',
                      align: 'left',
                      widthPercentage: 10,
                    },
                    {
                      title: 'Notes',
                      align: 'right',
                      widthPercentage: 20,
                    },
                  ]}
                  data={state.timesheets
                    .filter(tsl => tsl.getClassCodeId() === code.getId())
                    .map(tsl => {
                      return [
                        tsl.getTechnicianUserName(),
                        tsl.getDepartmentName(),
                        tsl.getAdminApprovalUserName(),
                        formatDate(tsl.getTimeStarted()),
                        formatDate(tsl.getTimeFinished()),
                        tsl.getBriefDescription(),
                        `${tsl.getHoursWorked()} hour(s)`,
                        tsl.getNotes(),
                      ];
                    })}
                />
              </div>
            ))}
          <PrintParagraph tag="h2" key="tripsHeader">
            Related Trips
          </PrintParagraph>
          {state.trips &&
            state.trips.map(trip => {
              return (
                <div
                  key={trip.getId() + 'pdf'}
                  style={{
                    breakInside: 'avoid',
                    display: 'inline-block',
                    width: '100%',
                  }}
                >
                  <PrintTable
                    key="tripTable"
                    columns={[
                      {
                        title: 'Date',
                        align: 'left',
                      },
                      {
                        title: 'Origin Address',
                        align: 'left',
                        widthPercentage: 20,
                      },
                      {
                        title: 'Destination Address',
                        align: 'left',
                        widthPercentage: 20,
                      },
                      {
                        title: 'Distance (Miles)',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Notes',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Home Travel',
                        align: 'right',
                        widthPercentage: 10,
                      },
                      {
                        title: `Cost (${usd(IRS_SUGGESTED_MILE_FACTOR)}/mi)`,
                        align: 'right',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Per Diem Row ID',
                        align: 'right',
                        widthPercentage: 10,
                      },
                    ]}
                    data={[
                      [
                        formatDate(trip.getDate()),
                        trip.getOriginAddress(),
                        trip.getDestinationAddress(),
                        trip.getDistanceInMiles().toFixed(2),
                        trip.getNotes(),
                        trip.getHomeTravel(),
                        `${usd(
                          Number(
                            (
                              trip.getDistanceInMiles() *
                              IRS_SUGGESTED_MILE_FACTOR
                            ).toFixed(2),
                          ),
                        )}`,
                        trip.getPerDiemRowId(),
                      ],
                    ]}
                  />
                </div>
              );
            })}
          <PrintParagraph tag="h2" key="tasksHeader">
            Spiffs/Bonus/Commission
          </PrintParagraph>
          {state.tasks &&
            state.tasks.map(task => {
              return (
                <div
                  key={task.getId() + 'pdf'}
                  style={{
                    breakInside: 'avoid',
                    display: 'inline-block',
                    width: '100%',
                  }}
                >
                  <PrintTable
                    key="tripTable"
                    columns={[
                      {
                        title: 'Type',
                        align: 'left',
                      },
                      {
                        title: 'Date Performed',
                        align: 'left',
                        widthPercentage: 20,
                      },
                      {
                        title: 'Details',
                        align: 'left',
                        widthPercentage: 20,
                      },
                      {
                        title: 'Flat Rate?',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Amount',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Notes',
                        align: 'right',
                        widthPercentage: 10,
                      },
                    ]}
                    data={[
                      [
                        task.getBillableType(),
                        formatDate(task.getDatePerformed()),
                        task.getDetails(),
                        task.getFlatRate(),
                        task.getBillableType() === 'Spiff'
                          ? usd(task.getSpiffAmount())
                          : usd(task.getToolpurchaseCost()),
                        task.getNotes(),
                      ],
                    ]}
                  />
                </div>
              );
            })}
        </PrintPage>
        <KalosButton
          style={{ display: 'inline-block' }}
          label="Download CSV of Page"
          onClick={() => {
            createReport(state.activeTab);
          }}
        ></KalosButton>
        {onClose && <KalosButton onClick={onClose} label="Close"></KalosButton>}
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
                    columns={[
                      { name: 'Type', align: 'left' },
                      { name: 'Total', align: 'left' },
                      { name: '', align: 'right' },
                    ]}
                    data={[
                      [
                        {
                          value: (
                            <div key="laborheader">
                              Total Hours Worked
                              <div key="LaborTypesContainer">
                                <Collapse
                                  key={'LaborCollapseTypes'}
                                  in={state.laborTotalsDropDownActive === true}
                                >
                                  {state.classCodes.map(code => {
                                    let findAccount = code.getId();
                                    if (state.laborTotals[findAccount]) {
                                      return (
                                        <div key={'laborValue' + findAccount}>
                                          {code.getDescription()}
                                        </div>
                                      );
                                    }
                                  })}
                                </Collapse>
                              </div>
                            </div>
                          ),
                        },
                        {
                          value: (
                            <div key="laborTotalHeader">
                              {state.totalHoursWorked > 1
                                ? `${state.totalHoursWorked} hrs`
                                : state.totalHoursWorked == 0
                                ? 'None'
                                : `${state.totalHoursWorked} hr`}
                              <div key="LaborCollapseValueHeader">
                                <Collapse
                                  key={'LaborCollapseValues'}
                                  in={state.laborTotalsDropDownActive === true}
                                >
                                  {state.classCodes.map(code => {
                                    let findAccount = code.getId();
                                    if (state.laborTotals[findAccount]) {
                                      return (
                                        <div
                                          key={
                                            'laborTotal' +
                                            state.laborTotals[findAccount] +
                                            code.getDescription()
                                          }
                                        >
                                          {`${state.laborTotals[findAccount]} hour(s)`}
                                        </div>
                                      );
                                    }
                                  })}
                                </Collapse>
                              </div>
                            </div>
                          ),
                        },
                        {
                          value: (
                            <div key="LaborTotalsButton">
                              <Button
                                key={'dropDownbuttonLabor'}
                                onClick={() => {
                                  dispatch({
                                    type: ACTIONS.SET_LABOR_TOTALS_DROPDOWN_ACTIVE,
                                    data: !state.laborTotalsDropDownActive,
                                  });
                                }}
                              >
                                {state.laborTotalsDropDownActive == true ? (
                                  <ExpandLess></ExpandLess>
                                ) : (
                                  <ExpandMore></ExpandMore>
                                )}
                              </Button>
                            </div>
                          ),
                        },
                      ],
                    ]}
                  />
                  <PrintParagraph tag="h2">Costs</PrintParagraph>
                  <InfoTable
                    columns={[
                      { name: 'Type', align: 'left' },
                      { name: 'Cost', align: 'left' },
                      { name: '', align: 'right' },
                    ]}
                    data={[
                      [
                        {
                          value: (
                            <div key="CostCenterCollapseTypesContainer">
                              Transactions
                              <Collapse
                                key={'CostCenterCollapseTypes'}
                                in={state.costCenterDropDownActive === true}
                              >
                                {state.transactionAccounts.map(account => {
                                  let findAccount = `${account.getId()}-${account.getDescription()}`;
                                  if (state.costCenterTotals[findAccount]) {
                                    return (
                                      <div
                                        key={
                                          'transactionAccountValue' +
                                          findAccount +
                                          account.getId()
                                        }
                                      >
                                        {findAccount}
                                      </div>
                                    );
                                  }
                                })}
                              </Collapse>
                            </div>
                          ),
                        },
                        {
                          value: (
                            <div key="CostCenterCollapseValueHeader">
                              {usd(totalTransactions)}
                              <Collapse
                                key={'CostCenterCollapseValues'}
                                in={state.costCenterDropDownActive === true}
                              >
                                {state.transactionAccounts.map(account => {
                                  let findAccount = `${account.getId()}-${account.getDescription()}`;
                                  if (state.costCenterTotals[findAccount]) {
                                    return (
                                      <div
                                        key={
                                          'transactionAccountValue' +
                                          state.costCenterTotals[findAccount] +
                                          findAccount
                                        }
                                      >
                                        {usd(
                                          state.costCenterTotals[findAccount],
                                        )}
                                      </div>
                                    );
                                  }
                                })}
                              </Collapse>
                            </div>
                          ),
                        },
                        {
                          value: (
                            <div key="transactionTotalsButton">
                              <Button
                                key={'dropDownbuttonTransactions'}
                                onClick={() => {
                                  dispatch({
                                    type: ACTIONS.SET_COST_CENTER_DROPDOWN_ACTIVE,
                                    data: !state.costCenterDropDownActive,
                                  });
                                }}
                              >
                                {state.costCenterDropDownActive == true ? (
                                  <ExpandLess></ExpandLess>
                                ) : (
                                  <ExpandMore></ExpandMore>
                                )}
                              </Button>
                            </div>
                          ),
                        },
                      ],
                      [
                        { value: 'Meals' },
                        { value: usd(totalMeals) },
                        { value: '' },
                      ],
                      [
                        { value: 'Lodging' },
                        { value: usd(totalLodging) },
                        { value: '' },
                      ],
                      [
                        { value: 'Tasks Billable' },
                        { value: usd(totalTasksBillable) },
                        { value: '' },
                      ],
                      [
                        { value: 'Trips Total' },
                        { value: usd(state.tripsTotal) },
                        { value: '' },
                      ],
                      [
                        {
                          value: <strong key="stronk1">TOTAL:</strong>,
                        },
                        {
                          value: (
                            <strong key="stronk2">
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
                        { value: '' },
                      ],
                    ]}
                  />
                </div>
              </div>
            ),
          },

          {
            label: 'Transactions',
            content: state.transactionAccounts
              .filter(
                account =>
                  state.costCenterTotals[
                    `${account.getId()}-${account.getDescription()}`
                  ] != undefined,
              )
              .map(account => (
                <SectionBar
                  title={`${account.getId()}-${account.getDescription()}`}
                  subtitle={usd(
                    state.costCenterTotals[
                      `${account.getId()}-${account.getDescription()}`
                    ],
                  )}
                  key={'header' + account.getId()}
                >
                  <InfoTable
                    key={account.getId()}
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
                        dir:
                          state.transactionSort.sortDir &&
                          state.transactionSort.sortBy == 'timestamp'
                            ? state.transactionSort.sortDir
                            : undefined,
                        onClick: () => {
                          const dir =
                            state.transactionSort.sortDir == 'ASC'
                              ? 'DESC'
                              : 'ASC';
                          dispatch({
                            type: ACTIONS.SET_TRANSACTION_SORT,
                            data: {
                              sortBy: 'timestamp',
                              sortDir: dir,
                            },
                          });
                          dispatch({
                            type: ACTIONS.SET_TRANSACTIONS,
                            data: sortTransactions(
                              state.transactions,
                              dir,
                              'timestamp',
                            ),
                          });
                        },
                      },
                      {
                        name: 'Amount',
                        align: 'left',
                        dir:
                          state.transactionSort.sortDir &&
                          state.transactionSort.sortBy == 'amount'
                            ? state.transactionSort.sortDir
                            : undefined,
                        onClick: () => {
                          const dir =
                            state.transactionSort.sortDir == 'ASC'
                              ? 'DESC'
                              : 'ASC';
                          dispatch({
                            type: ACTIONS.SET_TRANSACTION_SORT,
                            data: {
                              sortBy: 'amount',
                              sortDir: dir,
                            },
                          });
                          dispatch({
                            type: ACTIONS.SET_TRANSACTIONS,
                            data: sortTransactions(
                              state.transactions,
                              dir,
                              'amount',
                            ),
                          });
                        },
                      },
                      {
                        name: 'Notes',
                        align: 'left',
                      },
                      {
                        name: 'Actions',
                        align: 'left',
                      },
                    ]}
                    data={state.transactions
                      .filter(
                        transaction =>
                          transaction.getCostCenterId() === account.getId(),
                      )
                      .map(txn => {
                        return [
                          {
                            value: txn.getDepartment() ? (
                              <div key={txn.getId() + txn.getDescription()}>
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
                          {
                            value: (
                              <AltGallery
                                key="receiptPhotos"
                                title="Transaction Photos"
                                fileList={getGalleryData(txn)}
                                transactionID={txn.getId()}
                                text="View photos"
                                iconButton
                              />
                            ),
                          },
                        ];
                      })}
                  />
                </SectionBar>
              )),
          },

          {
            label: 'PerDiems',
            content: state.users
              .filter(user =>
                state.perDiems.find(
                  perDiem => perDiem.getUserId() === user.getId(),
                ),
              )
              .map(user => {
                {
                  return (
                    <SectionBar
                      key={user.getId() + user.getDateCreated()}
                      title={`PerDiems For ${user.getFirstname()} ${user.getLastname()}`}
                    >
                      {state.perDiems
                        .sort((a, b) =>
                          a.getDateSubmitted() > b.getDateSubmitted() ? -1 : 1,
                        )
                        .filter(perdiem => perdiem.getUserId() == user.getId())
                        .map(pd => {
                          const rowsList = pd.getRowsList();
                          const lodgingRows = rowsList.filter(
                            row => row.getMealsOnly() == false,
                          );
                          const totalMeals = pd.getAmountProcessedMeals();
                          const totalLodging = pd.getAmountProcessedLodging();
                          return (
                            <div key={pd.getId().toString() + 'div'}>
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
                                        value:
                                          TimesheetDepartmentClientService.getDepartmentName(
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
                                          totalLodging != 0
                                            ? usd(totalLodging)
                                            : '-',
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
                                      dropdown =>
                                        dropdown.perDiemId === pd.getId(),
                                    );
                                    if (tempDropDowns[dropdown]) {
                                      if (tempDropDowns[dropdown].active == 0)
                                        tempDropDowns[dropdown].active = 1;
                                      else tempDropDowns[dropdown].active = 0;
                                    }
                                    dispatch({
                                      type: ACTIONS.SET_DROPDOWNS,
                                      data: tempDropDowns,
                                    });
                                  }}
                                >
                                  Details
                                  {state.dropDowns.find(
                                    dropdown =>
                                      dropdown.perDiemId === pd.getId(),
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
                                    dropdown =>
                                      dropdown.perDiemId === pd.getId(),
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
                                      {
                                        value: formatDate(pdr.getDateString()),
                                      },
                                      { value: pdr.getZipCode() },
                                      {
                                        value: pdr.getMealsOnly()
                                          ? 'Yes'
                                          : 'No',
                                      },
                                      {
                                        value: usd(
                                          pd.getAmountProcessedMeals() /
                                            rowsList.length,
                                        ),
                                      },
                                      {
                                        value:
                                          pdr.getMealsOnly() === false
                                            ? usd(
                                                pd.getAmountProcessedLodging() /
                                                  lodgingRows.length,
                                              )
                                            : '-',
                                      },
                                      { value: pdr.getNotes() },
                                    ];
                                  })}
                                />
                              </Collapse>
                            </div>
                          );
                        })}
                    </SectionBar>
                  );
                }
              }),
          },

          {
            label: 'Timesheets',
            content: state.classCodes
              .filter(code => state.laborTotals[code.getId()] != undefined)
              .map(code => (
                <SectionBar
                  title={`${code.getId()}-${code.getDescription()}`}
                  subtitle={`${state.laborTotals[code.getId()]} hour(s)`}
                  key={'header' + code.getId()}
                >
                  {weekArray
                    .filter(week => week.code === code.getId())
                    .map(weekMapValue => (
                      <div key={weekMapValue.weekStart}>
                        <PrintParagraph tag="h2">{`Week Of ${weekMapValue.weekStart}`}</PrintParagraph>
                        <InfoTable
                          columns={[
                            {
                              name: 'Technician',
                              align: 'left',
                            },
                            {
                              name: 'Week',
                              align: 'left',
                            },
                            {
                              name: 'Total Hours',
                              align: 'left',
                            },
                          ]}
                          data={state.timesheetWeeklySubtotals
                            .filter(
                              week =>
                                week.classCodeId == code.getId() &&
                                weekMapValue.weekStart == week.weekStart,
                            )
                            .map(week => {
                              return [
                                {
                                  value: `${state.users
                                    .find(
                                      user => user.getId() === week.employeeId,
                                    )
                                    ?.getFirstname()}-${state.users
                                    .find(
                                      user => user.getId() === week.employeeId,
                                    )
                                    ?.getLastname()}`,
                                },
                                {
                                  value: `${week.weekStart}-${week.weekEnd}`,
                                },
                                { value: `${week.hoursSubtotal} hour(s)` },
                              ];
                            })}
                        />
                      </div>
                    ))}
                  <div key="TimesheetDetails">
                    <Button
                      key={'dropDownbutton' + code.getId().toString()}
                      onClick={() => {
                        let tempDropDowns = state.classCodeDropdowns;
                        const dropdown = tempDropDowns.findIndex(
                          dropdown => dropdown.classCodeId === code.getId(),
                        );
                        if (tempDropDowns[dropdown]) {
                          if (tempDropDowns[dropdown].active == 0)
                            tempDropDowns[dropdown].active = 1;
                          else tempDropDowns[dropdown].active = 0;
                        }
                        dispatch({
                          type: ACTIONS.SET_CLASS_CODE_DROPDOWNS,
                          data: tempDropDowns,
                        });
                      }}
                    >
                      Details
                      {state.classCodeDropdowns.find(
                        dropdown => dropdown.classCodeId === code.getId(),
                      )!.active == 1 ? (
                        <ExpandLess></ExpandLess>
                      ) : (
                        <ExpandMore></ExpandMore>
                      )}
                    </Button>
                    <Collapse
                      key={code.getId().toString() + 'collapse'}
                      in={
                        state.classCodeDropdowns.find(
                          dropdown => dropdown.classCodeId === code.getId(),
                        )?.active == 1
                          ? true
                          : false
                      }
                    >
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
                        data={state.timesheets
                          .filter(
                            timesheet =>
                              timesheet.getClassCodeId() === code.getId(),
                          )
                          .map(tsl => {
                            return [
                              {
                                value:
                                  tsl.getTechnicianUserName() +
                                  ` (${tsl.getTechnicianUserId()})`,
                              },
                              { value: tsl.getDepartmentName() },
                              {
                                value: tsl.getAdminApprovalUserName(),
                              },
                              {
                                value: formatDate(tsl.getTimeStarted()) || '-',
                              },
                              {
                                value: formatDate(tsl.getTimeFinished()) || '-',
                              },
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
                    </Collapse>
                  </div>
                </SectionBar>
              )),
          },

          {
            label: 'Trips',
            content: state.users
              .filter(user =>
                state.trips.find(trip => trip.getUserId() === user.getId()),
              )
              .map(user => {
                return (
                  <SectionBar
                    key={user.getId() + 'Trips'}
                    title={`${user.getFirstname()} ${user.getLastname()} Trips`}
                  >
                    {state.trips &&
                      state.trips.map(trip => {
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
                                  name: `Cost (${usd(
                                    IRS_SUGGESTED_MILE_FACTOR,
                                  )}/mi)`,
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
                                  {
                                    value: trip.getDistanceInMiles().toFixed(2),
                                  },
                                  { value: trip.getNotes() },
                                  { value: trip.getHomeTravel() },
                                  {
                                    value: `${usd(
                                      Number(
                                        (
                                          trip.getDistanceInMiles() *
                                          IRS_SUGGESTED_MILE_FACTOR
                                        ).toFixed(2),
                                      ),
                                    )} 
                          ${''}`,
                                  },
                                  { value: trip.getPerDiemRowId() },
                                ],
                              ]}
                            />
                          </div>
                        );
                      })}
                  </SectionBar>
                );
              }),
          },
          {
            label: 'Task',
            content: state.users
              .filter(user =>
                state.tasks.find(task => task.getExternalId() === user.getId()),
              )
              .map(user => {
                return (
                  <SectionBar
                    key={user.getId() + 'Billable Tasks'}
                    title={`${user.getFirstname()} ${user.getLastname()} Billable Tasks`}
                    subtitle={`Total: ${usd(
                      state.tasks &&
                        state.tasks
                          .filter(task => task.getExternalId() === user.getId())
                          .reduce((acc, val) => acc + val.getSpiffAmount(), 0),
                    )}`}
                  >
                    {state.tasks &&
                      state.tasks
                        .filter(task => task.getExternalId() === user.getId())
                        .map(task => {
                          return (
                            <div
                              key={task.getId()}
                              style={{
                                breakInside: 'avoid',
                                display: 'inline-block',
                                width: '100%',
                              }}
                            >
                              <InfoTable
                                columns={[
                                  {
                                    name: 'Type',
                                    align: 'left',
                                  },
                                  {
                                    name: 'Date Performed',
                                    align: 'left',
                                  },
                                  {
                                    name: 'Details',
                                    align: 'left',
                                  },
                                  {
                                    name: 'Amount',
                                    align: 'left',
                                  },
                                  {
                                    name: 'Notes',
                                    align: 'right',
                                  },
                                ]}
                                data={[
                                  [
                                    { value: task.getBillableType() },
                                    {
                                      value: formatDate(
                                        task.getDatePerformed(),
                                      ),
                                    },
                                    {
                                      value: task.getDetails(),
                                    },
                                    { value: usd(task.getSpiffAmount()) },
                                    { value: task.getNotes() },
                                  ],
                                ]}
                              />
                            </div>
                          );
                        })}
                  </SectionBar>
                );
              }),
          },
        ]}
      ></Tabs>
    </SectionBar>
  ) : (
    <Loader></Loader>
  );
};
