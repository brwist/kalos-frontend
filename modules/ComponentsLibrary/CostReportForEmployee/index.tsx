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
import { ENDPOINT, MEALS_RATE } from '../../../constants';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import {
  differenceInMinutes,
  parseISO,
  differenceInCalendarDays,
  subDays,
  addDays,
  startOfWeek,
  format,
  endOfWeek,
} from 'date-fns';
import {
  Trip,
  TripList,
  PerDiemList,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import {
  roundNumber,
  formatDate,
  TaskClientService,
  TimeoffRequestClientService,
  PerDiemRowType,
  PerDiemClientService,
  PerDiemType,
  usd,
  timestamp,
  SpiffToolAdminActionClientService,
} from '../../../helpers';
import { NULL_TIME_VALUE } from '../Timesheet/constants';
import { NULL_TIME } from '@kalos-core/kalos-rpc/constants';
interface Props {
  userId: number;
  loggedUserId: number;
  notReady: boolean;

  onClose: (() => void) | null;
  onNext?: (() => void) | null;
  onPrevious?: (() => void) | null;
  username: string;
}
export const CostReportForEmployee: FC<Props> = ({
  userId,
  notReady,
  onClose,
  onNext,
  onPrevious,
  username,
}) => {
  const [trips, setTrips] = useState<Trip[]>();
  const [perDiems, setPerDiems] = useState<PerDiemList>();
  const [spiffs, setSpiffs] = useState<Task[]>();
  const [hours, setHours] = useState<number>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const today = new Date();
  const startDay = startOfWeek(subDays(today, 7), { weekStartsOn: 6 });
  const endDay = addDays(startDay, 7);
  const formatDateFns = (date: Date) => format(date, 'yyyy-MM-dd');
  const getTrips = useCallback(async () => {
    let trip = new Trip();
    trip.setUserId(userId);
    trip.setIsActive(true);
    trip.setDateTargetList(['date', 'date']);
    trip.setDateRangeList([
      '>=',
      formatDateFns(startDay),
      '<',
      formatDateFns(endDay),
    ]);
    let tempTripList = (
      await PerDiemClientService.BatchGetTrips(trip)
    ).getResultsList();

    return tempTripList;
  }, [endDay, startDay, userId]);

  const getPerDiems = useCallback(async () => {
    const req = new PerDiem();
    req.setUserId(userId);
    req.setDateRangeList([
      '>=',
      formatDateFns(startDay),
      '<',
      formatDateFns(endDay),
    ]);
    const resultsList = await PerDiemClientService.BatchGet(req);
    //get PerDiems, set them

    return resultsList;
  }, [userId, endDay, startDay]);

  const getSpiffs = useCallback(async () => {
    const req = new Task();
    req.setExternalId(userId);
    const startDate = format(startDay, 'yyyy-MM-dd');
    const endDate = format(endDay, 'yyyy-MM-dd');
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
    const startDate = format(startDay, 'yyyy-MM-dd');
    const endDate = format(endDay, 'yyyy-MM-dd');
    timesheetReq.setDateRangeList(['>=', startDate, '<', endDate]);
    console.log(endDay);
    const client = new TimesheetLineClient(ENDPOINT);
    let results = new TimesheetLineList().getResultsList();
    timesheetReq.setOrderBy('time_started');
    results = (await client.BatchGetPayroll(timesheetReq)).getResultsList();

    let total = 0;
    for (let i = 0; i < results.length; i++) {
      {
        const timeFinished = results[i].toObject().timeFinished;
        const timeStarted = results[i].toObject().timeStarted;
        const subtotal = roundNumber(
          differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) /
            60,
        );

        total += subtotal;
      }
    }
    return total;
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
      <InfoTable
        columns={[
          { name: 'Decision Date for Spiff' },
          { name: 'Date that Spiff was Created' },
          { name: 'Amount' },
          { name: 'Job Number' },
          { name: 'Processed' },
        ]}
        data={
          spiffs
            ? spiffs.map(spiff => {
                return [
                  {
                    value: formatDate(
                      spiff.getActionsList()[
                        //eslint-disable-next-line
                        spiff.getActionsList().length - 1
                      ].getDecisionDate(),
                    ),
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
  ) : (
    <Loader />
  );
};