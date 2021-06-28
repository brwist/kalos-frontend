import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  TimesheetLine,
  TimesheetLineClient,
  TimesheetLineList,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { PerDiem } from '@kalos-core/kalos-rpc/PerDiem';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { SectionBar } from '../SectionBar';
import { ENDPOINT } from '../../../constants';
import { NULL_TIME } from '../../../constants';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import {
  differenceInMinutes,
  parseISO,
  subDays,
  addDays,
  startOfWeek,
  format,
} from 'date-fns';
import {
  Trip,
  PerDiemList,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import {
  roundNumber,
  formatDate,
  PerDiemClientService,
  usd,
} from '../../../helpers';
import { NULL_TIME_VALUE } from '../Timesheet/constants';
interface Props {
  userId: number;
  week: string;
}

export const CostReportForEmployee: FC<Props> = ({ userId, week }) => {
  const [trips, setTrips] = useState<Trip[]>();
  const [perDiems, setPerDiems] = useState<PerDiem[]>();
  const [spiffs, setSpiffs] = useState<Task[]>();
  const [hours, setHours] = useState<{
    processed: number;
    approved: number;
    submitted: number;
    pending: number;
  }>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const startDay = week;

  const formatDateFns = (date: Date) => format(date, 'yyyy-MM-dd');
  const endDay = formatDateFns(addDays(new Date(startDay), 7));
  const getTrips = useCallback(async () => {
    let trip = new Trip();
    trip.setUserId(userId);
    trip.setIsActive(true);
    trip.setDateTargetList(['date', 'date']);
    trip.setDateRangeList(['>=', startDay, '<', endDay]);
    let tempTripList = (
      await PerDiemClientService.BatchGetTrips(trip)
    ).getResultsList();

    return tempTripList;
  }, [endDay, startDay, userId]);

  const getPerDiems = useCallback(async () => {
    const req = new PerDiem();
    req.setUserId(userId);
    req.setDateRangeList(['>=', startDay, '<', endDay]);
    req.setIsActive(true);
    const resultsList = (
      await PerDiemClientService.BatchGet(req)
    ).getResultsList();
    //get PerDiems, set them

    return resultsList;
  }, [userId, endDay, startDay]);

  const getSpiffs = useCallback(async () => {
    const req = new Task();
    req.setExternalId(userId);
    req.setIsActive(true);
    const startDate = startDay;
    const endDate = endDay;
    req.setDateRangeList(['>=', startDate, '<', endDate]);
    req.setBillableType('Spiff');
    req.setDateTargetList(['time_created', 'time_created']);

    const results = (
      await new TaskClient(ENDPOINT).BatchGet(req)
    ).getResultsList();

    return results;
  }, [userId, startDay, endDay]);
  const getHours = useCallback(async () => {
    const timesheetReq = new TimesheetLine();
    timesheetReq.setTechnicianUserId(userId);
    timesheetReq.setIsActive(1);
    timesheetReq.setWithoutLimit(true);
    const startDate = startDay;
    const endDate = endDay;
    timesheetReq.setDateRangeList(['>=', startDate, '<', endDate]);
    timesheetReq.setDateTargetList(['time_started', 'time_started']);
    const client = new TimesheetLineClient(ENDPOINT);
    timesheetReq.setOrderBy('time_started');
    let results = (await client.BatchGetPayroll(timesheetReq)).getResultsList();
    let processed = 0;
    let approved = 0;
    let submitted = 0;
    let pending = 0;
    for (let i = 0; i < results.length; i++) {
      {
        const timeFinished = results[i].toObject().timeFinished;
        const timeStarted = results[i].toObject().timeStarted;
        const subtotal = roundNumber(
          differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) /
            60,
        );

        if (results[i].getPayrollProcessed() === true) {
          processed += subtotal;
        } else if (results[i].getAdminApprovalUserId() !== 0) {
          approved += subtotal;
        } else if (results[i].getUserApprovalDatetime() != NULL_TIME) {
          submitted += subtotal;
        } else {
          pending += subtotal;
        }
      }
    }
    return { processed, approved, submitted, pending };
  }, [endDay, startDay, userId]);

  useEffect(() => {
    const load = async () => {
      let promises = [];
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            const hours = await getHours();
            setHours(hours);
            resolve();
          } catch (err) {
            console.log('error setting total hours', err);
            reject(err);
          }
        }),
      );
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            const spiffs = await getSpiffs();
            setSpiffs(spiffs);
            resolve();
          } catch (err) {
            console.log('error fetching total spiffs', err);
            reject(err);
          }
        }),
      );
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            resolve();
            const perDiems = await getPerDiems();
            setPerDiems(perDiems);
          } catch (err) {
            reject(err);
          }
        }),
      );
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            const tripsData = await getTrips();
            setTrips(tripsData);
            resolve();
          } catch (err) {
            console.log('error getting trips', err);
            reject(err);
          }
        }),
      );
      setLoaded(true);
      try {
        await Promise.all(promises);
        // const res = await loadPayroll({PAYROLL PROTOBUFFER})
        console.log('all promises executed without error, setting loaded');
        setLoaded(true);
      } catch (err) {
        console.log('a promise failed');
        setLoaded(true);
      }
    };
    if (!loaded) load();
  }, [loaded, getPerDiems, getHours, getSpiffs, getTrips]);
  return loaded ? (
    <SectionBar title="Employee Report">
      <SectionBar title="Hours">
        <InfoTable
          columns={[
            { name: 'Processed Hours' },
            { name: 'Approved Hours, Not Processed' },
            { name: 'Submitted Hours, Not Approved' },
            { name: 'Pending Hours, Not Submitted' },
          ]}
          data={
            hours
              ? [
                  [
                    {
                      value: hours.processed,
                    },
                    {
                      value: hours.approved,
                    },
                    {
                      value: hours.submitted,
                    },
                    {
                      value: hours.pending,
                    },
                  ],
                ]
              : []
          }
        />
      </SectionBar>
      <SectionBar title="Spiff/Bonus/Commission">
        <InfoTable
          columns={[
            { name: 'Decision Date' },
            { name: 'Date Created' },
            { name: 'Amount' },
            { name: 'Job Number' },
            { name: 'Processed' },
          ]}
          data={
            spiffs
              ? spiffs.map(spiff => {
                  return [
                    {
                      value:
                        spiff.getActionsList().length > 0
                          ? formatDate(
                              spiff.getActionsList()[
                                //eslint-disable-next-line
                                spiff.getActionsList().length - 1
                              ].getDecisionDate(),
                            )
                          : 'No Action Taken',
                    },
                    {
                      value: formatDate(spiff.toObject().timeCreated),
                    },
                    {
                      value: usd(spiff.toObject().spiffAmount),
                    },
                    {
                      value: spiff.toObject().spiffJobNumber,
                    },
                    {
                      value:
                        spiff.toObject().payrollProcessed === true
                          ? 'Processed'
                          : 'Not Processed',
                    },
                  ];
                })
              : []
          }
        />
      </SectionBar>
      <SectionBar title="Per Diems">
        <InfoTable
          columns={[
            { name: 'Date' },
            { name: 'ZipCode' },
            { name: 'Approved By' },
            { name: 'Processed' },
          ]}
          data={
            perDiems
              ? perDiems.map(perDiem => {
                  return [
                    {
                      value: formatDate(perDiem.getDateStarted()),
                    },
                    {
                      value:
                        perDiem.getRowsList().length > 0
                          ? perDiem.getRowsList()[0].getZipCode()
                          : 'No Days Found',
                    },
                    {
                      value:
                        perDiem.getApprovedById() != 0
                          ? perDiem.getApprovedByName()
                          : 'Not Approved',
                    },
                    {
                      value:
                        perDiem.getPayrollProcessed() === false
                          ? 'Not Processed'
                          : 'Processed',
                    },
                  ];
                })
              : []
          }
        />
      </SectionBar>
      <SectionBar title="Trips">
        <InfoTable
          columns={[
            { name: 'Date' },
            { name: 'Distance' },
            { name: 'Start' },
            { name: 'End' },
            { name: 'Approved?' },
            { name: 'Processed?' },
          ]}
          data={
            trips
              ? trips.map(trip => {
                  return [
                    {
                      value: formatDate(trip.getDate()),
                    },
                    {
                      value: trip.getDistanceInMiles(),
                    },
                    {
                      value: trip.getOriginAddress(),
                    },
                    {
                      value: trip.getDestinationAddress(),
                    },
                    {
                      value: trip.getApproved() === true ? 'Yes' : 'No',
                    },
                    {
                      value:
                        trip.getPayrollProcessed() === false
                          ? 'Not Processed'
                          : 'Processed',
                    },
                  ];
                })
              : []
          }
        />
      </SectionBar>
    </SectionBar>
  ) : (
    <Loader />
  );
};
