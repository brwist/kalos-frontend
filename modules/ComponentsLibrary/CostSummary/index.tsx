import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  TimesheetLine,
  TimesheetLineClient,
  TimesheetLineList,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { Button } from '../Button';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import { PerDiem } from '@kalos-core/kalos-rpc/PerDiem';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/TimeoffRequest';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { Info } from '@material-ui/icons';
import { SectionBar } from '../SectionBar';
import { ENDPOINT, NULL_TIME, MEALS_RATE } from '../../../constants';
import { SpiffToolAdminAction } from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { TaskClient, Task, SpiffType } from '@kalos-core/kalos-rpc/Task';
import {
  differenceInMinutes,
  parseISO,
  differenceInBusinessDays,
  subDays,
  addDays,
  startOfWeek,
  format,
  getMonth,
  getYear,
  getDaysInMonth,
} from 'date-fns';
import {
  Trip,
  TripList,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import {
  roundNumber,
  loadTimeoffRequests,
  formatDate,
  TaskClientService,
  UserClientService,
  TimeoffRequestClientService,
  PerDiemRowType,
  PerDiemClientService,
  loadGovPerDiem,
  PerDiemType,
  loadPerDiemByUserIdAndDateStartedAudited,
  loadTripsByFilter,
  usd,
} from '../../../helpers';
interface Props {
  userId: number;
  loggedUserId: number;
  notReady: boolean;
  onClose: (() => void) | null;
  onNext?: (() => void) | null;
  username: string;
}

export const CostSummary: FC<Props> = ({
  userId,
  loggedUserId,
  notReady,
  onClose,
  onNext,
  username,
}) => {
  const [totalHoursProcessed, setTotalHoursProcessed] = useState<number>(0);
  const [totalSpiffsWeekly, setTotalSpiffsWeekly] = useState<number>(0);
  const [totalSpiffsMonthly, setTotalSpiffsMonthly] = useState<number>(0);
  const [spiffsWeekly, setSpiffsWeekly] = useState<Task[]>();
  const [spiffsMonthly, setSpiffsMonthly] = useState<Task[]>();

  const [totalTools, setTotalTools] = useState<number>();
  const [tools, setTools] = useState<Task[]>();
  const [totalPTO, setTotalPTO] = useState<number>(0);
  const [pto, setPTO] = useState<TimeoffRequest.AsObject[]>();
  const [totalPerDiem, setTotalPerDiem] = useState<{
    totalMeals: number;
    totalLodging: number;
    totalMileage: number;
    processed: number;
  }>({ totalMeals: 0, totalLodging: 0, totalMileage: 0, processed: 0 });
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [trips, setTrips] = useState<Trip[]>();
  const [tripsTotal, setTripsTotal] = useState<{
    totalDistance: number;
    processed: boolean;
  }>({ totalDistance: 0, processed: true });
  const [loading, setLoading] = useState<boolean>();
  const [loaded, setLoaded] = useState<boolean>();
  const [today, setToday] = useState<Date>(new Date());
  const [toolFund, setToolFund] = useState<number>(0);
  const [startDay, setStartDay] = useState<Date>(
    startOfWeek(subDays(today, 7), { weekStartsOn: 6 }),
  );
  const [endDay, setEndDay] = useState<Date>(addDays(startDay, 7));
  const [govPerDiems, setGovPerDiems] = useState<{
    [key: string]: {
      meals: number;
      lodging: number;
    };
  }>({});
  const formatDateFns = (date: Date) => format(date, 'yyyy-MM-dd');
  const govPerDiemByZipCode = useCallback(
    (zipCode: string) => {
      const govPerDiem = govPerDiems[zipCode];
      if (govPerDiem) return govPerDiem;
      return {
        meals: MEALS_RATE,
        lodging: 0,
      };
    },
    [govPerDiems],
  );
  const getTrips = useCallback(async () => {
    let trip = new Trip();
    trip.setUserId(userId);
    let processed = true;
    let tempTripList = new TripList().getResultsList();
    trip.setApproved(true);
    for (let i = 0; i <= 6; i++) {
      const startDate = format(addDays(startDay, i), 'yyyy-MM-dd');
      trip.setDate('%' + startDate + '%');
      const trips = await PerDiemClientService.BatchGetTrips(trip);
      tempTripList = tempTripList.concat(trips.getResultsList());
    }
    let distanceSubtotal = 0;
    for (let j = 0; j < tempTripList.length; j++) {
      distanceSubtotal += tempTripList[j].toObject().distanceInMiles;
      if (tempTripList[j].toObject().payrollProcessed === false) {
        processed = false;
      }
    }
    return { totalDistance: distanceSubtotal, processed };
  }, [startDay, userId]);
  const getPerDiems = useCallback(async () => {
    const { resultsList } = await loadPerDiemByUserIdAndDateStartedAudited(
      userId,
      formatDateFns(startDay),
    );
    setPerDiems(resultsList);
    const year = +format(startDay, 'yyyy');
    const month = +format(startDay, 'M');
    const zipCodesList = [];
    for (let i = 0; i < resultsList.length; i++) {
      let zipCodes = [resultsList[i]]
        .reduce(
          (aggr, { rowsList }) => [...aggr, ...rowsList],
          [] as PerDiemRowType[],
        )
        .map(({ zipCode }) => zipCode);
      for (let j = 0; j < zipCodes.length; j++) {
        zipCodesList.push(zipCodes[j]);
      }
    }
    const govPerDiems = await loadGovPerDiem(zipCodesList, year, month);
    setGovPerDiems(govPerDiems);
  }, [startDay, userId]);
  const getPerDiemTotals = useCallback(async () => {
    const tempPerDiems = perDiems;
    let processed = 0;
    let filteredPerDiems = tempPerDiems;
    if (perDiems.length > 0) {
      for (let i = 0; i < perDiems.length; i++) {
        if (perDiems[i].payrollProcessed) {
          processed = 1;
        }
      }
    }
    let allRowsList = filteredPerDiems.reduce(
      (aggr, { rowsList }) => [...aggr, ...rowsList],
      [] as PerDiemRowType[],
    );
    let totalMeals = allRowsList.reduce(
      (aggr, { zipCode }) => aggr + govPerDiemByZipCode(zipCode).meals,
      0,
    );
    let totalLodging = allRowsList.reduce(
      (aggr, { zipCode, mealsOnly }) =>
        aggr + (mealsOnly ? 0 : govPerDiemByZipCode(zipCode).lodging),
      0,
    );
    let totalMileage = 0;
    for (let i = 0; i < allRowsList.length; i++) {
      totalMileage = allRowsList[i].tripsList.reduce(
        (aggr, { distanceInMiles }) => aggr + distanceInMiles,
        0,
      );
    }

    const totals = { totalMeals, totalLodging, totalMileage, processed };

    return totals;
  }, [getPerDiems, govPerDiemByZipCode]);
  const getSpiffToolTotals = useCallback(
    async (spiffType: string, dateType = 'Weekly') => {
      const req = new Task();
      const action = new SpiffToolAdminAction();
      req.setPayrollProcessed(false);
      req.setCreatorUserId(userId);
      if (spiffType === 'Spiff') {
        const startDate = format(startDay, 'yyyy-MM-dd');
        const endDate = format(endDay, 'yyyy-MM-dd');
        req.setDateRangeList(['>=', startDate, '<', endDate]);
        let tempSpiff = new SpiffType();
        tempSpiff.setPayout(dateType);
        req.setSpiffType(tempSpiff);
      } else {
        const startMonth = getMonth(startDay) - 1;
        const startYear = getYear(startDay);
        const startDate = format(new Date(startYear, startMonth), 'yyyy-MM-dd');
        const endDate = format(
          addDays(
            new Date(startYear, startMonth),
            getDaysInMonth(new Date(startYear, startMonth)) - 1,
          ),
          'yyyy-MM-dd',
        );
        req.setDateRangeList(['>=', startDate, '<', endDate]);
      }
      if (!notReady) {
        action.setStatus(1);
        req.setSearchAction(action);
        req.setFieldMaskList(['PayrollProcessed']);
      }
      if (notReady) {
        req.setFieldMaskList(['AdminActionId', 'PayrollProcessed']);
      }
      if (spiffType == 'Spiff') {
        req.setBillableType('Spiff');
      } else {
        req.setBillableType('Tool Purchase');
      }
      const results = (
        await new TaskClient(ENDPOINT).BatchGet(req)
      ).getResultsList();
      let spiffTotal = 0;
      let toolTotal = 0;
      for (let i = 0; i < results.length; i++) {
        if (spiffType == 'Spiff') {
          spiffTotal += results[i].toObject().spiffAmount;
        } else {
          toolTotal += results[i].toObject().toolpurchaseCost;
        }
      }
      if (spiffType === 'Spiff') {
        if (dateType === 'Weekly') {
          setSpiffsWeekly(results);
        } else {
          setSpiffsMonthly(results);
        }
        return spiffTotal;
      } else {
        setTools(results);
        return toolTotal;
      }
    },
    [notReady, userId, endDay, startDay],
  );

  const getTimeoffTotals = useCallback(async () => {
    const startDate = format(startDay, 'yyyy-MM-dd');
    const endDate = format(endDay, 'yyyy-MM-dd');
    const filter = {
      technicianUserID: userId,
      requestType: notReady ? 10 : 9,
      startDate: startDate,
      endDate: endDate,
      payrollProcessed: true,
    };
    const results = (await loadTimeoffRequests(filter)).resultsList;
    let total = 0;
    for (let i = 0; i < results.length; i++) {
      if (results[i].allDayOff === 0) {
        const timeFinished = results[i].timeFinished;
        const timeStarted = results[i].timeStarted;
        const subtotal = roundNumber(
          differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) /
            60,
        );

        total += subtotal;
      } else {
        const timeFinished = results[i].timeFinished;
        const timeStarted = results[i].timeStarted;
        const numberOfDays =
          differenceInBusinessDays(
            parseISO(timeFinished),
            parseISO(timeStarted),
          ) + 1;
        total += numberOfDays * 8;
      }
    }
    setPTO(results);
    return total;
  }, [userId, notReady]);
  const getProcessedHoursTotals = useCallback(async () => {
    const timesheetReq = new TimesheetLine();
    timesheetReq.setTechnicianUserId(userId);
    timesheetReq.setIsActive(1);
    timesheetReq.setWithoutLimit(true);
    const startDate = format(startDay, 'yyyy-MM-dd');
    const endDate = format(endDay, 'yyyy-MM-dd');
    timesheetReq.setDateRangeList(['>=', startDate, '<', endDate]);
    const client = new TimesheetLineClient(ENDPOINT);
    let results = new TimesheetLineList().getResultsList();
    timesheetReq.setOrderBy('time_started');
    timesheetReq.setNotEqualsList(['PayrollProcessed']);
    results = (await client.BatchGetPayroll(timesheetReq)).getResultsList();

    let total = 0;
    for (let i = 0; i < results.length; i++) {
      const timeFinished = results[i].toObject().timeFinished;
      const timeStarted = results[i].toObject().timeStarted;
      const subtotal = roundNumber(
        differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) / 60,
      );

      total += subtotal;
    }
    return total;
  }, [endDay, startDay, userId]);
  const toggleProcessTimeoff = async (pt: TimeoffRequest.AsObject) => {
    pt.payrollProcessed = true;
    const { id } = pt;
    const req = new TimeoffRequest();
    req.setId(id);
    req.setFieldMaskList(['PayrollProcessed']);
    req.setPayrollProcessed(true);
    await TimeoffRequestClientService.Update(req);
  };
  const toggleProcessSpiffTool = async (spiffTool: Task.AsObject) => {
    spiffTool.payrollProcessed = true;
    const { id } = spiffTool;
    const req = new Task();
    req.setId(id);
    req.setFieldMaskList(['PayrollProcessed']);
    req.setPayrollProcessed(true);
    await TaskClientService.Update(req);
  };
  const toggleProcessPerDiems = async (perDiems: PerDiem.AsObject[]) => {
    for (let i = 0; i < perDiems.length; i++) {
      let req = new PerDiem();
      req.setId(perDiems[i].id);
      req.setPayrollProcessed(true);
      req.setFieldMaskList(['Payroll{Processed']);
      await PerDiemClientService.Update(req);
      if (trips && trips.length > 0) {
        for (let i = 0; i < trips.length; i++) {
          await PerDiemClientService.updateTripPayrollProcessed(
            trips[i].toObject().id,
          );
        }
      }
    }
  };
  const load = useCallback(async () => {
    setLoading(true);
    const user = await UserClientService.loadUserById(userId);
    setToolFund(user.toolFund);
    let promises = [];

    promises.push(
      new Promise<void>(async resolve => {
        setTotalPTO(await getTimeoffTotals());
        resolve();
      }),
    );
    promises.push(
      new Promise<void>(async resolve => {
        setTotalHoursProcessed(await getProcessedHoursTotals());
        resolve();
      }),
    );
    /*
    promises.push(
      new Promise<void>(async resolve => {
        setTotalTools(await getSpiffToolTotals('Tool Purchase'));
        resolve();
      }),
    );
    */
    promises.push(
      new Promise<void>(async resolve => {
        setTotalSpiffsWeekly(await getSpiffToolTotals('Spiff'));
        resolve();
      }),
    );
    promises.push(
      new Promise<void>(async resolve => {
        setTotalSpiffsMonthly(await getSpiffToolTotals('Spiff', 'Monthly'));
        resolve();
      }),
    );
    promises.push(
      new Promise<void>(async resolve => {
        await getPerDiems();
        resolve();
      }),
    );
    promises.push(
      new Promise<void>(async resolve => {
        setTotalPerDiem(await getPerDiemTotals());
        resolve();
      }),
    );
    promises.push(
      new Promise<void>(async resolve => {
        setTripsTotal(await getTrips());
        resolve();
      }),
    );
    Promise.all(promises)
      .then(() => {
        setLoading(false);
        setLoaded(true);
      })
      .catch(error => {
        console.log(error);
      });
  }, [
    getTimeoffTotals,
    getSpiffToolTotals,
    userId,
    getProcessedHoursTotals,
    getPerDiemTotals,
    getPerDiems,
    getTrips,
  ]);
  useEffect(() => {
    if (!loaded) load();
  }, [load, loaded]);
  return loaded ? (
    <div>
      <strong>{username}</strong>
      {onClose ? <Button label="Close" onClick={() => onClose()}></Button> : []}
      <InfoTable
        columns={[{ name: 'Week' }, { name: 'Total Hours Processed' }]}
        data={[
          [
            {
              value: formatDateFns(startDay),
            },
            {
              value: totalPTO + totalHoursProcessed,
            },
          ],
        ]}
      ></InfoTable>

      <SectionBar
        title="Spiff Weekly Current Total"
        asideContent={
          <strong>Spiff Weekly Total : {usd(totalSpiffsWeekly)}</strong>
        }
        actionsAndAsideContentResponsive
      >
        <InfoTable
          columns={[
            { name: 'Date Created' },
            { name: 'Amount' },
            { name: 'Job Number' },
            { name: 'Additional Info' },
            { name: 'Processed' },
          ]}
          data={spiffsWeekly!.map(spiff => {
            return [
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
                    ? 'Complete'
                    : 'Incomplete',
                actions:
                  spiff.toObject().payrollProcessed === false &&
                  spiff.toObject().adminActionId != 0
                    ? [
                        <IconButton
                          key="processSpiffWeekly"
                          size="small"
                          onClick={() =>
                            toggleProcessSpiffTool(spiff.toObject())
                          }
                        >
                          <CheckIcon />
                        </IconButton>,
                      ]
                    : [],
              },
            ];
          })}
        />
      </SectionBar>
      <SectionBar
        title="Spiff Monthly Current Total"
        asideContent={
          <strong>Spiff Monthly Total : {usd(totalSpiffsMonthly)}</strong>
        }
        actionsAndAsideContentResponsive
      >
        {
          <InfoTable
            columns={[
              { name: 'Date Created' },
              { name: 'Amount' },
              { name: 'Job Number' },
              { name: 'Additional Info' },
              { name: 'Processed' },
            ]}
            data={spiffsMonthly!.map(spiff => {
              return [
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
                  value: spiff.toObject().briefDescription,
                },
                {
                  value:
                    spiff.toObject().payrollProcessed === true
                      ? 'Complete'
                      : 'Incomplete',
                  actions:
                    spiff.toObject().payrollProcessed === false &&
                    spiff.toObject().adminActionId != 0
                      ? [
                          <IconButton
                            key="processSpiffMonthly"
                            size="small"
                            onClick={() =>
                              toggleProcessSpiffTool(spiff.toObject())
                            }
                          >
                            <CheckIcon />
                          </IconButton>,
                        ]
                      : [],
                },
              ];
            })}
          />
        }
      </SectionBar>
      {/*
      <SectionBar
        title="Tool Current Total"
        asideContent={<strong>Tool Fund: {toolFund}</strong>}
        actionsAndAsideContentResponsive
      >
        <InfoTable
          columns={[
            { name: 'Date Created' },
            { name: 'Date Approved' },
            { name: 'Amount' },
            { name: 'Additional Info' },
          ]}
          data={tools!.map(tool => {
            return [
              {
                value: formatDate(tool.toObject().toolpurchaseDate),
              },
              {
                value: tool.toObject().searchAction?.reviewedBy,
              },
              {
                value: tool.toObject().toolpurchaseCost,
              },
              {
                value: tool.toObject().briefDescription,
                actions:
                  tool.toObject().payrollProcessed === false &&
                  tool.toObject().adminActionId != 0
                    ? [
                        <IconButton
                          key="processTool"
                          size="small"
                          onClick={() =>
                            toggleProcessSpiffTool(tool.toObject())
                          }
                        >
                          <CheckIcon />
                        </IconButton>,
                      ]
                    : [],
              },
            ];
          })}
        />
      </SectionBar>
      <SectionBar title="Totals" small>
        <InfoTable
          columns={[
            { name: 'Total Purchases for the Month' },
            { name: 'Absolute Total' },
          ]}
          data={[
            [
              {
                value: totalTools,
              },
              {
                value: toolFund - (totalTools === undefined ? 0 : totalTools),
              },
            ],
          ]}
        />
      </SectionBar>
      */}
      <SectionBar
        key="PerDiemWeek"
        title={`Total PerDiem for the Week of ${formatDateFns(startDay)}`}
      >
        {(perDiems || trips) && (
          <InfoTable
            key="PerDiem Totals"
            columns={[
              { name: 'Total Lodging' },
              { name: 'Total Meals' },
              { name: 'Total Mileage' },
              { name: 'Processed' },
            ]}
            data={[
              [
                {
                  value: usd(totalPerDiem.totalLodging),
                },
                {
                  value: usd(totalPerDiem.totalMeals),
                },
                {
                  value: tripsTotal.totalDistance.toFixed(2) + ' miles',
                },
                {
                  value:
                    totalPerDiem.processed === 1 &&
                    tripsTotal.processed === true
                      ? 'Complete'
                      : 'Incomplete',
                  actions:
                    totalPerDiem.processed === 0 ||
                    tripsTotal.processed === false
                      ? [
                          <IconButton
                            key="processPerdiem"
                            size="small"
                            onClick={() => toggleProcessPerDiems(perDiems)}
                          >
                            <CheckIcon />
                          </IconButton>,
                        ]
                      : [],
                },
              ],
            ]}
          />
        )}
      </SectionBar>
      {onNext != null ? (
        <Button label="Next Employee" onClick={() => onNext()}></Button>
      ) : (
        []
      )}
    </div>
  ) : (
    <Loader />
  );
};
