import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  TimesheetLine,
  TimesheetLineClient,
  TimesheetLineList,
} from '@kalos-core/kalos-rpc/TimesheetLine';

import { ENDPOINT, NULL_TIME } from '../../../../constants';
import { Button } from '../../Button';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import Alert from '@material-ui/lab/Alert';

import {
  format,
  differenceInMinutes,
  parseISO,
  startOfWeek,
  subDays,
  addDays,
} from 'date-fns';
import { roundNumber, formatDate } from '../../../../helpers';
import { eachWeekOfIntervalWithOptions } from 'date-fns/fp';
import { Loader } from '../../../Loader/main';
interface Props {
  userId: number;
  loggedUserId: number;
  notReady: boolean;
  onClose: () => void;
  username: string;
}
export type Action = {
  time: number;
  classCode: string;
  billable: boolean;
  day: string;
  briefDescription: string;
};
export type Job = {
  jobId: string;
  actions: Action[];
};
export type Week = {
  days: string[];
  identifyer: string;
  actionString: string[];
};
export const TimesheetSummary: FC<Props> = ({
  userId,
  loggedUserId,
  notReady,
  onClose,
  username,
}) => {
  const [totalHours, setTotalHours] = useState<number>();
  const [totalBillableHours, setTotalBillableHours] = useState<number>();
  const [totalUnbillableHours, setTotalUnbillableHours] = useState<number>();
  const [timesheets, setTimesheets] = useState<TimesheetLine[]>();
  const [timesheetsPending, setTimesheetsPending] = useState<TimesheetLine[]>();
  const [timesheetsJobs, setTimesheetsJobs] = useState<Job[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mappedElements, setMappedElements] = useState<JSX.Element[]>();
  const [
    togglePendingApprovalAlert,
    setTogglePendingApprovalAlert,
  ] = useState<boolean>();
  const [
    togglePendingSubmitAlert,
    setTogglePendingSubmitAlert,
  ] = useState<boolean>();
  const [mappedElementsNoJobs, setMappedElementsNoJobs] = useState<
    JSX.Element[]
  >();
  const [today, setToday] = useState<Date>(new Date());
  const [startDay, setStartDay] = useState<Date>(
    startOfWeek(subDays(today, 7), { weekStartsOn: 6 }),
  );

  const [endDay, setEndDay] = useState<Date>(addDays(startDay, 7));
  let tempDayList = [];
  for (let i = 0; i < 7; i++) {
    tempDayList.push([format(addDays(startDay, i), 'yyyy-MM-dd')]);
  }
  const [dayList, setDayList] = useState<string[][]>(tempDayList);
  const [subTotalDayList, setSubTotalDayList] = useState<string[][]>(
    tempDayList,
  );
  const getTimesheetsPending = useCallback(async () => {
    const timesheetReq = new TimesheetLine();
    timesheetReq.setTechnicianUserId(userId);
    timesheetReq.setIsActive(1);
    timesheetReq.setWithoutLimit(true);
    const startDate = format(startDay, 'yyyy-MM-dd');
    const endDate = format(endDay, 'yyyy-MM-dd');
    timesheetReq.setDateRangeList(['>=', startDate, '<', endDate]);
    timesheetReq.setFieldMaskList(['AdminApprovalUserId', 'PayrollProcessed']);
    const client = new TimesheetLineClient(ENDPOINT);
    //entries that still need admin action
    let pendingApproval = await client.BatchGet(timesheetReq);
    const timesheetPendingReq = new TimesheetLine();
    timesheetPendingReq.setTechnicianUserId(userId);
    timesheetPendingReq.setIsActive(1);
    timesheetPendingReq.setDateRangeList(['>=', startDate, '<', endDate]);
    timesheetPendingReq.setUserApprovalDatetime(NULL_TIME);
    timesheetPendingReq.setAdminApprovalDatetime(NULL_TIME);
    timesheetPendingReq.setFieldMaskList([
      'UserApprovalDatetime',
      'PayrollProcessed',
      'AdminApprovalDatetime',
    ]);
    //entries that still require user action
    let pendingSubmit = await client.BatchGet(timesheetPendingReq);
    if (pendingSubmit.getTotalCount() > 0) {
      setTogglePendingSubmitAlert(true);
    }
    if (pendingApproval.getTotalCount()) {
      setTogglePendingApprovalAlert(true);
    }
  }, [endDay, startDay, userId]);
  const getTimesheetTotals = useCallback(async () => {
    const timesheetReq = new TimesheetLine();
    timesheetReq.setTechnicianUserId(userId);
    timesheetReq.setIsActive(1);
    timesheetReq.setWithoutLimit(true);
    const startDate = format(startDay, 'yyyy-MM-dd');
    const endDate = format(endDay, 'yyyy-MM-dd');
    timesheetReq.setDateRangeList(['>=', startDate, '<', endDate]);
    const client = new TimesheetLineClient(ENDPOINT);
    let results = new TimesheetLineList().getResultsList();

    if (notReady) {
      timesheetReq.setUserApprovalDatetime(NULL_TIME);
      timesheetReq.setNotEqualsList(['UserApprovalDatetime']);
      timesheetReq.setFieldMaskList([
        'PayrollProcessed',
        'AdminApprovalUserId',
      ]);
      timesheetReq.setOrderBy('time_started');
      results = (await client.BatchGetManager(timesheetReq)).getResultsList();
    } else {
      timesheetReq.setAdminApprovalUserId(0);
      timesheetReq.setNotEqualsList(['AdminApprovalUserId']);
      timesheetReq.setFieldMaskList(['PayrollProcessed']);
      results = (await client.BatchGetPayroll(timesheetReq)).getResultsList();
    }

    let tempJobs = [];
    for (let i = 0; i < results.length; i++) {
      let tempJob = {
        jobId:
          results[i].toObject().eventId === 0
            ? results[i].toObject().referenceNumber === ''
              ? '0'
              : results[i].toObject().referenceNumber
            : results[i].toObject().eventId.toString(),
        actions: [
          {
            time: roundNumber(
              differenceInMinutes(
                parseISO(results[i].toObject().timeFinished),
                parseISO(results[i].toObject().timeStarted),
              ) / 60,
            ),
            classCode:
              results[i].toObject().classCodeId +
              '-' +
              results[i].toObject().classCode!.description,
            billable: results[i].toObject().classCode!.billable,
            day: format(
              parseISO(results[i].toObject().timeStarted),
              'yyyy-MM-dd',
            ),
            briefDescription: results[i].toObject().briefDescription,
          },
        ],
      };
      let foundJob = false;
      let foundCode = false;
      for (let j = 0; j < tempJobs.length; j++) {
        for (let l = 0; l < tempJobs[j].actions.length; l++) {
          if (tempJobs[j].jobId === tempJob.jobId) {
            console.log('same job');
            foundJob = true;
            if (
              tempJob.actions[0].classCode ===
                tempJobs[j].actions[l].classCode &&
              tempJob.actions[0].day === tempJobs[j].actions[l].day
            ) {
              tempJobs[j].actions[l].time += tempJob.actions[0].time;
              foundCode = true;
              break;
            }
          }
        }
        if (foundJob === true && foundCode === false) {
          tempJobs[j].actions.push(tempJob.actions[0]);
          break;
        }
      }
      if (foundJob === false) {
        tempJobs.push(tempJob);
        continue;
      }
    }
    setTimesheets(results);
    return tempJobs;
  }, [notReady, userId, endDay, startDay]);
  const ProcessTimesheets = useCallback(async () => {
    const tslClient = new TimesheetLineClient(ENDPOINT);
    let ids = [];
    if (timesheets) {
      for (let i = 0; i < timesheets!.length; i++) {
        ids.push(timesheets[i].toObject().id);
      }
      await tslClient.Process(ids, userId);
      onClose();
    }
  }, [timesheets, userId, onClose]);
  const RejectTimesheets = useCallback(async () => {
    const tslClient = new TimesheetLineClient(ENDPOINT);
    let ids = [];
    if (timesheets) {
      for (let i = 0; i < timesheets!.length; i++) {
        ids.push(timesheets[i].toObject().id);
      }
      await tslClient.Reject(ids, userId);
      onClose();
    }
  }, [timesheets, userId, onClose]);

  const load = useCallback(async () => {
    await getTimesheetTotals();
    await getTimesheetsPending();
    let subtotalsBillable = [0, 0, 0, 0, 0, 0, 0];
    let subtotalsUnbillable = [0, 0, 0, 0, 0, 0, 0];
    let subtotals = [0, 0, 0, 0, 0, 0, 0];

    let jobReports = [];
    let weekList = [];
    let tempJobs = await getTimesheetTotals();
    console.log(tempJobs);
    let jobNumber = '0';

    if (tempJobs != undefined) {
      for (let i = 0; i < tempJobs.length; i++) {
        let tempWeek = [];
        for (let i = 0; i < 7; i++) {
          tempWeek.push([
            format(
              addDays(
                startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 }),
                i,
              ),
              'yyyy-MM-dd',
            ),
          ]);
        }
        for (let j = 0; j < tempJobs[i].actions.length; j++) {
          for (let m = 0; m < tempWeek.length; m++) {
            if (dayList[m][0] === tempJobs[i].actions[j].day) {
              if (!tempWeek[m][1]) {
                jobNumber = tempJobs[i].jobId === '' ? '0' : tempJobs[i].jobId;
                tempWeek.push([jobNumber]);
                tempWeek[m].push(
                  tempJobs[i].actions[j].classCode +
                    '-' +
                    tempJobs[i].actions[j].time +
                    ' Hours',
                );
                if (tempJobs[i].actions[j].time > 0) {
                  if (tempJobs[i].actions[j].billable) {
                    subtotalsBillable[m] += tempJobs[i].actions[j].time;
                  }
                  if (!tempJobs[i].actions[j].billable) {
                    subtotalsUnbillable[m] += tempJobs[i].actions[j].time;
                  }
                  subtotals[m] += tempJobs[i].actions[j].time;
                }
                break;
              } else {
                tempWeek[m][1] =
                  tempWeek[m][1] +
                  ' \r\n' +
                  tempJobs[i].actions[j].classCode +
                  '-' +
                  tempJobs[i].actions[j].time +
                  ' Hours';
                if (tempJobs[i].actions[j].time > 0) {
                  if (tempJobs[i].actions[j].billable) {
                    subtotalsBillable[m] += tempJobs[i].actions[j].time;
                  }
                  if (!tempJobs[i].actions[j].billable) {
                    subtotalsUnbillable[m] += tempJobs[i].actions[j].time;
                  }
                  subtotals[m] += tempJobs[i].actions[j].time;
                }
                break;
              }
            }
          }
        }

        weekList.push(tempWeek);
      }
      let mapElements = (
        <InfoTable
          columns={[
            { name: 'Job Number (if any)' },
            { name: dayList![0][0] },
            { name: dayList![1][0] },
            { name: dayList![2][0] },
            { name: dayList![3][0] },
            { name: dayList![4][0] },
            { name: dayList![5][0] },
            { name: dayList![6][0] },
          ]}
          key={'WeekSummary'}
          data={weekList!.map(week => {
            return [
              {
                value:
                  week[week.length - 1][0] === undefined
                    ? 0
                    : week[week.length - 1][0],
              },
              {
                value: week![0][1] === undefined ? '' : week![0][1],
              },
              {
                value: week![1][1] === undefined ? '' : week![1][1],
              },
              {
                value: week![2][1] === undefined ? '' : week![2][1],
              },
              {
                value: week![3][1] === undefined ? '' : week![3][1],
              },
              {
                value: week![4][1] === undefined ? '' : week![4][1],
              },
              {
                value: week![5][1] === undefined ? '' : week![5][1],
              },
              {
                value: week![6][1] === undefined ? '' : week![6][1],
              },
            ];
          })}
        />
      );
      let subtotalReport = (
        <InfoTable
          key={'Day Subtotals'}
          data={[
            [
              {
                value: '',
              },
              {
                value:
                  'Billable:' +
                  subtotalsBillable[0] +
                  ' \r\n' +
                  'Unbillable:' +
                  subtotalsUnbillable[0] +
                  ' \r\n' +
                  ' \r\n' +
                  'Total Hours:' +
                  subtotals[0],
              },
              {
                value:
                  'Billable:' +
                  subtotalsBillable[1] +
                  ' \r\n' +
                  'Unbillable:' +
                  subtotalsUnbillable[1] +
                  ' \r\n' +
                  ' \r\n' +
                  'Total Hours:' +
                  subtotals[1],
              },
              {
                value:
                  'Billable:' +
                  subtotalsBillable[2] +
                  ' \r\n' +
                  'Unbillable:' +
                  subtotalsUnbillable[2] +
                  ' \r\n' +
                  ' \r\n' +
                  'Total Hours:' +
                  subtotals[2],
              },
              {
                value:
                  'Billable:' +
                  subtotalsBillable[3] +
                  ' \r\n' +
                  'Unbillable:' +
                  subtotalsUnbillable[3] +
                  ' \r\n' +
                  ' \r\n' +
                  'Total Hours:' +
                  subtotals[3],
              },
              {
                value:
                  'Billable:' +
                  subtotalsBillable[4] +
                  ' \r\n' +
                  'Unbillable:' +
                  subtotalsUnbillable[4] +
                  ' \r\n' +
                  ' \r\n' +
                  'Total Hours:' +
                  subtotals[4],
              },
              {
                value:
                  'Billable:' +
                  subtotalsBillable[5] +
                  ' \r\n' +
                  'Unbillable:' +
                  subtotalsUnbillable[5] +
                  ' \r\n' +
                  ' \r\n' +
                  'Total Hours:' +
                  subtotals[5],
              },
              {
                value:
                  'Billable:' +
                  subtotalsBillable[6] +
                  ' \r\n' +
                  'Unbillable:' +
                  subtotalsUnbillable[6] +
                  ' \r\n' +
                  ' \r\n' +
                  'Total Hours:' +
                  subtotals[6],
              },
            ],
          ]}
        ></InfoTable>
      );
      jobReports.push(mapElements);
      jobReports.push(subtotalReport);
    }
    let total = subtotals.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );
    let totalBill = subtotalsBillable.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );
    let totalUnbill = subtotalsUnbillable.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );
    setTotalHours(total);
    setTotalUnbillableHours(totalUnbill);
    setTotalBillableHours(totalBill);
    setMappedElements(jobReports);
    setLoaded(true);
  }, [getTimesheetTotals, getTimesheetsPending, dayList]);

  useEffect(() => {
    if (loading) {
      setLoading(false);
      load();
    }
  }, [load, loading]);
  return loaded ? (
    <SectionBar key="title" title="Timesheet Summary" uncollapsable={true}>
      <strong>{username}</strong>
      {togglePendingApprovalAlert && (
        <Alert key="pending" severity="warning">
          {' '}
          This User has Timesheet Entries that are still Pending Approval from a
          Manager
        </Alert>
      )}
      {togglePendingSubmitAlert && (
        <Alert key="approve" severity="warning">
          This User has Timesheet Entries that are still Pending Submission
        </Alert>
      )}
      <Button key="close" label="Close" onClick={() => onClose()}></Button>
      <Button
        key="process"
        label="Process All"
        onClick={() => ProcessTimesheets()}
        disabled={togglePendingSubmitAlert || togglePendingApprovalAlert}
      ></Button>
      <Button
        key="reject"
        label="Reject All"
        onClick={() => RejectTimesheets()}
        disabled={togglePendingSubmitAlert || togglePendingApprovalAlert}
      ></Button>
      {timesheets?.length === 0 && (
        <div key="No records">
          <strong>No Timesheet Records Found</strong>
        </div>
      )}

      <SectionBar
        key="week"
        title={'Approved for of Week of ' + format(startDay, 'yyyy-MM-dd')}
      >
        <div key="MappedList">{mappedElements}</div>
      </SectionBar>
      <div key="Approved">
        <strong>Total Approved Hours :{totalHours}</strong>
      </div>
      <div key="Billable">
        <strong>Total Billable Hours :{totalBillableHours}</strong>
      </div>
      <div key="Unbillable">
        <strong>Total Unbillable Hours :{totalUnbillableHours}</strong>
      </div>
    </SectionBar>
  ) : (
    <Loader />
  );
};
