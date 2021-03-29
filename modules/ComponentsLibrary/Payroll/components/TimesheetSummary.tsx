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
import {
  format,
  differenceInMinutes,
  parseISO,
  startOfWeek,
  subDays,
  addDays,
} from 'date-fns';
import {
  perDiemTripMilesToUsdAsNumber,
  roundNumber,
  formatWeek,
  formatDate,
  formatDay,
  loadTimeoffRequests,
  GetTimesheetConfig,
  TaskClientService,
  makeFakeRows,
} from '../../../../helpers';
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
import { PerDiem, PerDiemClient } from '@kalos-core/kalos-rpc/PerDiem';
import { notStrictEqual } from 'assert';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/TimeoffRequest';
export const TimesheetSummary: FC<Props> = ({
  userId,
  loggedUserId,
  notReady,
  onClose,
  username,
}) => {
  const [totalHours, setTotalHours] = useState<number>();
  const [totalBillableHours, setTotaBillablelHours] = useState<number>();
  const [totalUnbillableHours, setTotalUnbillableHours] = useState<number>();
  const [classCodes, setClassCodes] = useState<string[]>();
  const [timesheets, setTimesheets] = useState<TimesheetLine[]>();
  const [timesheetsJobs, setTimesheetsJobs] = useState<Job[]>();
  const [timesheetsNoJobs, setTimesheetsNoJobs] = useState<Job[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mappedElements, setMappedElements] = useState<JSX.Element[]>();

  const [mappedElementsNoJobs, setMappedElementsNoJobs] = useState<
    JSX.Element[]
  >();
  const [today, setToday] = useState<Date>(new Date());
  const [startDay, setStartDay] = useState<Date>(
    startOfWeek(subDays(today, 7), { weekStartsOn: 6 }),
  );
  const [endDay, setEndDay] = useState<Date>(addDays(startDay, 7));
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
      timesheetReq.setOrderBy('technician_user_name_reverse');
      results = (await client.BatchGetPayroll(timesheetReq)).getResultsList();
    }
    setTimesheets(results);
    let tempJobs = [];
    let tempNoJobs = [];
    let total = 0;
    let billableTotal = 0;
    let unbillableTotal = 0;
    for (let i = 0; i < results.length; i++) {
      let subtotal = roundNumber(
        differenceInMinutes(
          parseISO(results[i].toObject().timeFinished),
          parseISO(results[i].toObject().timeStarted),
        ) / 60,
      );
      total += subtotal;
      if (results[i].toObject().classCode?.billable) {
        billableTotal += subtotal;
      }
      if (!results[i].toObject().classCode?.billable) {
        unbillableTotal += subtotal;
      }
      if (
        results[i].toObject().referenceNumber != '' &&
        results[i].toObject().referenceNumber != undefined
      ) {
        let tempJob = {
          jobId: results[i].toObject().referenceNumber,
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
                results[i].toObject().classCode!.classcodeQbName,
              billable: results[i].toObject().classCode!.billable,
              day: formatDate(results[i].toObject().timeStarted),
              briefDescription: results[i].toObject().briefDescription,
            },
          ],
        };
        let foundJob = false;
        let foundCode = false;
        for (let j = 0; j < tempJobs.length; j++) {
          for (let l = 0; l < tempJobs[j].actions.length; l++) {
            if (tempJobs[j].jobId === tempJob.jobId) {
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
          }
        }
        if (foundJob === false && foundCode === false) {
          tempJobs.push(tempJob);
        }
      } else {
        let tempNoJob = {
          jobId: results[i].toObject().referenceNumber,
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
                results[i].toObject().classCode!.classcodeQbName,
              billable: results[i].toObject().classCode!.billable,
              day: formatDate(results[i].toObject().timeStarted),
              briefDescription: results[i].toObject().briefDescription,
            },
          ],
        };
        let foundDay = false;
        let foundCode = false;
        for (let j = 0; j < tempNoJobs.length; j++) {
          for (let l = 0; l < tempNoJobs[j].actions.length; l++) {
            if (tempNoJobs[j].actions[l].day === tempNoJob.actions[0].day) {
              foundDay = true;
              if (
                tempNoJob.actions[0].classCode ===
                tempNoJobs[j].actions[l].classCode
              ) {
                tempNoJobs[j].actions[l].time += tempNoJob.actions[0].time;
                foundCode = true;
                break;
              }
            }
          }
          if (foundDay === true && foundCode === false) {
            tempNoJobs[j].actions.push(tempNoJob.actions[0]);
            break;
          }
        }
        if (foundDay === false && foundCode === false) {
          tempNoJobs.push(tempNoJob);
        }
      }
    }
    setTotalHours(total);
    setTotalUnbillableHours(unbillableTotal);
    setTotaBillablelHours(billableTotal);
    setTimesheetsJobs(tempJobs);
    setTimesheetsNoJobs(tempNoJobs);
  }, [notReady, userId]);
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
  }, [timesheets, userId]);

  const load = useCallback(async () => {
    await getTimesheetTotals();
    setLoading(false);
    setLoaded(false);
  }, [getTimesheetTotals]);

  useEffect(() => {
    if (loading) {
      load();
    }
    if (!loaded) {
      let jobReports = [];
      if (timesheetsJobs != undefined) {
        for (let i = 0; i < timesheetsJobs?.length; i++) {
          let Billable = 0;
          let Unbillable = 0;
          for (let j = 0; j < timesheetsJobs[i].actions.length; j++) {
            if (timesheetsJobs[i].actions[j].billable) {
              Billable += timesheetsJobs[i].actions[j].time;
            } else {
              Unbillable += timesheetsJobs[i].actions[j].time;
            }
          }

          let mapElements = (
            <SectionBar
              title={'Job:' + timesheetsJobs[i].jobId}
              key={'Job:' + timesheetsJobs[i].jobId}
            >
              <InfoTable
                loading={loaded}
                key={timesheetsJobs[i].jobId}
                columns={[
                  { name: 'Day' },
                  { name: 'Hours' },
                  { name: 'ClassCode' },
                  { name: 'Brief Description' },
                ]}
                data={timesheetsJobs[i].actions.map(action => {
                  return [
                    {
                      value: action.day,
                    },
                    {
                      value: action.time,
                    },
                    {
                      value: action.classCode,
                    },
                    {
                      value: action.briefDescription,
                    },
                  ];
                })}
              />
              <strong>Billable Total: {Billable}</strong>
              {', '}
              <strong>UnBillable Total:{Unbillable}</strong>
            </SectionBar>
          );
          jobReports.push(mapElements);
        }
      }
      let noJobReports = [];
      if (timesheetsNoJobs != undefined) {
        for (let i = 0; i < timesheetsNoJobs?.length; i++) {
          let Billable = 0;
          let Unbillable = 0;
          for (let j = 0; j < timesheetsNoJobs[i].actions.length; j++) {
            if (timesheetsNoJobs[i].actions[j].billable) {
              Billable += timesheetsNoJobs[i].actions[j].time;
            } else {
              Unbillable += timesheetsNoJobs[i].actions[j].time;
            }
          }

          let mapElementsNoJob = (
            <div>
              <InfoTable
                key={
                  timesheetsNoJobs[i].actions[0].day +
                  timesheetsNoJobs[i].actions[0].classCode +
                  timesheetsNoJobs[i].actions[0].time
                }
                loading={loaded}
                columns={[
                  { name: 'Day' },
                  { name: 'Hours' },
                  { name: 'ClassCode' },
                  { name: 'Brief Description' },
                ]}
                data={timesheetsNoJobs[i].actions.map(action => {
                  return [
                    {
                      value: action.day,
                    },
                    {
                      value: action.time,
                    },
                    {
                      value: action.classCode,
                    },
                    {
                      value: action.briefDescription,
                    },
                  ];
                })}
              />
              <strong>Billable Total: {Billable}</strong>{' '}
              <strong>Unbillable Total:{Unbillable}</strong>
            </div>
          );

          noJobReports.push(mapElementsNoJob);
        }
      }
      setMappedElements(jobReports);
      setMappedElementsNoJobs(noJobReports);
      setLoaded(true);
    }
  }, [
    loaded,
    load,
    classCodes,
    totalHours,
    loading,
    timesheetsJobs,
    timesheetsNoJobs,
  ]);
  return loaded ? (
    <SectionBar title="Timesheet Summary" uncollapsable={true}>
      <Button label="Close" onClick={() => onClose()}></Button>
      <Button label="Process All" onClick={() => ProcessTimesheets()}></Button>
      {mappedElements?.length === 0 && mappedElementsNoJobs?.length === 0 && (
        <div>
          <strong>No Timesheet Records Found</strong>
        </div>
      )}

      {mappedElementsNoJobs && mappedElementsNoJobs.length > 0 ? (
        <SectionBar title={'Week of ' + format(startDay, 'yyyy-MM-dd')}>
          <div> {mappedElementsNoJobs}</div>
        </SectionBar>
      ) : (
        []
      )}
      <div>{mappedElements}</div>
      <strong>Total Approved Hours :{totalHours}</strong>
      <div>
        <strong>Total Billable Hours :{totalBillableHours}</strong>
      </div>
      <div>
        <strong>Total Unbillable Hours :{totalUnbillableHours}</strong>
      </div>
    </SectionBar>
  ) : (
    <React.Fragment></React.Fragment>
  );
};
