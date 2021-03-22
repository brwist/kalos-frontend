import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  TimesheetLine,
  TimesheetLineClient,
  TimesheetLineList,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { Form, Schema } from '../../Form';
import { Timesheet } from '../../../Timesheet/main';
import { ENDPOINT, NULL_TIME } from '../../../../constants';
import { SpiffToolAdminAction } from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import { result } from 'lodash';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { format, differenceInMinutes, parseISO } from 'date-fns';
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
  onClose: (() => void) | null;
  username: string;
}
export type Action = {
  time: number;
  classCode: number;
  billable: boolean;
  day: string;
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
  const [totalHours, setTotalHours] = useState<number[]>();
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
  const getTimesheetTotals = useCallback(async () => {
    const timesheetReq = new TimesheetLine();
    timesheetReq.setTechnicianUserId(userId);
    timesheetReq.setIsActive(1);
    timesheetReq.setWithoutLimit(true);
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
      timesheetReq.setOrderBy('time_started');
      results = (await client.BatchGetPayroll(timesheetReq)).getResultsList();
    }
    setTimesheets(results);
    let tempJobs = [];
    let tempNoJobs = [];
    for (let i = 0; i < results.length; i++) {
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
              classCode: results[i].toObject().classCodeId,
              billable: results[i].toObject().classCode!.billable,
              day: formatDate(results[i].toObject().timeStarted),
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
                tempJobs[j].actions[l].classCode
              ) {
                tempNoJobs[j].actions[l].time += tempJob.actions[0].time;
                foundCode = true;
                break;
              }
            }
          }
          if (foundJob === true && foundCode === false) {
            tempNoJobs[j].actions.push(tempJob.actions[0]);
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
              classCode: results[i].toObject().classCodeId,
              billable: results[i].toObject().classCode!.billable,
              day: formatDate(results[i].toObject().timeStarted),
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
    setTimesheetsJobs(tempJobs);
    setTimesheetsNoJobs(tempNoJobs);
  }, [notReady, userId]);

  const load = useCallback(async () => {
    await getTimesheetTotals();
    setLoading(false);
    setLoaded(false);
  }, [getTimesheetTotals, totalHours, classCodes, loading]);

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
            <SectionBar title={'Job:' + timesheetsJobs[i].jobId}>
              <InfoTable
                key={timesheetsJobs[i].jobId}
                columns={[
                  { name: 'Day' },
                  { name: 'Hours' },
                  { name: 'ClassCode' },
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
                  ];
                })}
              />
              <strong>Billable Total: {Billable}</strong>{' '}
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
            <SectionBar title={'Day:' + timesheetsNoJobs[i].actions[0].day}>
              <InfoTable
                key={
                  timesheetsNoJobs[i].actions[0].day +
                  timesheetsNoJobs[i].actions[0].classCode
                }
                columns={[{ name: 'Hours' }, { name: 'ClassCode' }]}
                data={timesheetsNoJobs[i].actions.map(action => {
                  return [
                    {
                      value: action.time,
                    },
                    {
                      value: action.classCode,
                    },
                  ];
                })}
              />
              <strong>Billable Total: {Billable}</strong>{' '}
              <strong>UnBillable Total:{Unbillable}</strong>
            </SectionBar>
          );
          noJobReports.push(mapElementsNoJob);
        }
      }
      setMappedElements(jobReports);
      setMappedElementsNoJobs(noJobReports);
      setLoaded(true);
    }
  }, [loaded, load, classCodes, totalHours, loading]);

  return loaded ? (
    <div>
      <div>{mappedElements}</div>
      <div> {mappedElementsNoJobs}</div>
    </div>
  ) : (
    <React.Fragment></React.Fragment>
  );
};
