import React, { FC, useState, useEffect, useCallback, useReducer } from 'react';
import {
  TimesheetLine,
  TimesheetLineClient,
  TimesheetLineList,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { Button } from '../Button';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import { PerDiem } from '@kalos-core/kalos-rpc/PerDiem';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { SectionBar } from '../SectionBar';
import { ENDPOINT, MEALS_RATE } from '../../../constants';
import { SpiffToolAdminAction } from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import {
  differenceInMinutes,
  parseISO,
  subDays,
  addDays,
  startOfWeek,
  format,
  endOfWeek,
} from 'date-fns';
import {
  PerDiemRow,
  Trip,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import {
  roundNumber,
  formatDate,
  TaskClientService,
  TimeoffRequestClientService,
  PerDiemClientService,
  usd,
  timestamp,
  SpiffToolAdminActionClientService,
  makeFakeRows,
} from '../../../helpers';
import { reducer } from './reducer';
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

export const CostSummary: FC<Props> = ({
  userId,
  notReady,
  onClose,
  onNext,
  onPrevious,
  username,
}) => {
  const [totalHoursProcessed, setTotalHoursProcessed] = useState<number>(0);
  const [totalSpiffsWeekly, setTotalSpiffsWeekly] = useState<number>(0);
  const [perDiems, setPerDiems] = useState<PerDiem[]>([]);
  const [govPerDiems, setGovPerDiems] = useState<{
    [key: string]: {
      meals: number;
      lodging: number;
    };
  }>({});
  const [trips, setTrips] = useState<Trip[]>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const today = new Date();
  const startDay = startOfWeek(subDays(today, 7), { weekStartsOn: 6 });
  const endDay = addDays(startDay, 7);
  const formatDateFns = (date: Date) => format(date, 'yyyy-MM-dd');
  const [state, dispatch] = useReducer(reducer, {
    spiffs: undefined,
    totalPerDiem: {
      totalMeals: 0,
      totalLodging: 0,
      totalMileage: 0,
      processed: 0,
    },
    totalPerDiemProcessed: {
      totalMeals: 0,
      totalLodging: 0,
      totalMileage: 0,
      processed: 0,
    },
    totalSpiffsProcessed: 0,
    tripsTotal: { totalDistance: 0, processed: true },
    totalTripsProcessed: { totalDistance: 0, processed: true },
  });

  const {
    spiffs,
    totalPerDiem,
    tripsTotal,
    totalPerDiemProcessed,
    totalSpiffsProcessed,
    totalTripsProcessed,
  } = state;

  const getTrips = useCallback(async () => {
    let trip = new Trip();
    trip.setUserId(userId);
    let processed = true;
    trip.setDateProcessed(NULL_TIME);
    trip.setFieldMaskList(['PayrollProcessed']);
    trip.setApproved(true);
    trip.setWithoutLimit(true);
    trip.setDateTargetList(['date', 'date']);
    trip.setDateRangeList(['>=', '0001-01-01', '<', formatDateFns(endDay)]);
    let tempTripList = (
      await PerDiemClientService.BatchGetTrips(trip)
    ).getResultsList();
    setTrips(tempTripList);
    let distanceSubtotal = 0;
    for (let j = 0; j < tempTripList.length; j++) {
      if (tempTripList[j].getHomeTravel()) {
        if (tempTripList[j].getDistanceInMiles() < 30) {
          distanceSubtotal += 0;
        } else {
          distanceSubtotal += tempTripList[j].getDistanceInMiles() - 30;
        }
      } else {
        distanceSubtotal += tempTripList[j].getDistanceInMiles();
      }
      if (tempTripList[j].getPayrollProcessed() === false) {
        processed = false;
      }
    }
    return { totalDistance: distanceSubtotal, processed };
  }, [endDay, userId]);
  const getTripsProcessed = useCallback(async () => {
    let trip = new Trip();
    trip.setUserId(userId);
    let processed = true;
    trip.setWithoutLimit(true);
    trip.setDateTargetList(['date_processed', 'date_processed']);
    trip.setDateRangeList([
      '>=',
      formatDateFns(startOfWeek(new Date())),
      '<=',
      formatDateFns(endOfWeek(new Date())),
    ]);
    let tempTripList = (
      await PerDiemClientService.BatchGetTrips(trip)
    ).getResultsList();
    let distanceSubtotal = 0;
    for (let j = 0; j < tempTripList.length; j++) {
      if (tempTripList[j].getHomeTravel()) {
        if (tempTripList[j].getDistanceInMiles() < 30) {
          distanceSubtotal += 0;
        } else {
          tempTripList[j].setDistanceInMiles(
            (distanceSubtotal += tempTripList[j].getDistanceInMiles() - 30),
          );
        }
      } else {
        distanceSubtotal += tempTripList[j].getDistanceInMiles();
      }
      if (tempTripList[j].getPayrollProcessed() === false) {
        processed = false;
      }
    }
    return { totalDistance: distanceSubtotal, processed };
  }, [userId]);
  const getPerDiemTotals = useCallback(async () => {
    const pdRes =
      await PerDiemClientService.loadPerDiemByUserIdAndDateStartedAudited(
        userId,
        formatDateFns(endDay),
      );
    //get PerDiems, set them
    const resultsList = pdRes.getResultsList();
    setPerDiems(resultsList);
    const year = +format(startDay, 'yyyy');
    const month = +format(startDay, 'M');
    const zipCodesList = [];
    for (let i = 0; i < resultsList.length; i++) {
      let zipCodes = [resultsList[i]]
        .reduce(
          (aggr, pd) => [...aggr, ...pd.getRowsList()],
          [] as PerDiemRow[],
        )
        .map(pd => pd.getZipCode());
      for (let j = 0; j < zipCodes.length; j++) {
        zipCodesList.push(zipCodes[j]);
      }
    }
    const govPerDiemsTemp = await PerDiemClientService.loadGovPerDiem(
      zipCodesList,
      year,
      month,
    );
    setGovPerDiems(govPerDiemsTemp);
    let processed = 0;
    let filteredPerDiems = resultsList;
    if (resultsList.length > 0) {
      for (let i = 0; i < resultsList.length; i++) {
        if (resultsList[i].getPayrollProcessed()) {
          processed = 1;
        }
      }
    }
    function govPerDiemByZipCode(zipCode: string) {
      const govPerDiem = govPerDiemsTemp[zipCode];
      if (govPerDiem) return govPerDiem;
      return {
        meals: MEALS_RATE,
        lodging: 0,
      };
    }
    let allRowsList = filteredPerDiems.reduce(
      (aggr, pd) => [...aggr, ...pd.getRowsList()],
      [] as PerDiemRow[],
    );
    let totalMeals = allRowsList.reduce(
      (aggr, pdr) => aggr + govPerDiemByZipCode(pdr.getZipCode()).meals,
      0,
    );
    let totalLodging = allRowsList.reduce(
      (aggr, pdr) =>
        aggr +
        (pdr.getMealsOnly()
          ? 0
          : govPerDiemByZipCode(pdr.getZipCode()).lodging),
      0,
    );
    let totalMileage = 0;

    const totals = { totalMeals, totalLodging, totalMileage, processed };

    return totals;
  }, [userId, endDay, startDay]);

  const getPerDiemTotalsProcessed = useCallback(async () => {
    const perDiemReq = new PerDiem();
    perDiemReq.setDateTargetList(['date_processed', 'date_processed']);
    perDiemReq.setUserId(userId);
    perDiemReq.setDateRangeList([
      '>=',
      formatDateFns(startOfWeek(new Date())),
      '<=',
      formatDateFns(endOfWeek(new Date())),
    ]);
    const resultsList = (
      await PerDiemClientService.BatchGet(perDiemReq)
    ).getResultsList();

    //get PerDiems, set them
    const year = +format(startDay, 'yyyy');
    const month = +format(startDay, 'M');
    const zipCodesList = [];
    for (let i = 0; i < resultsList.length; i++) {
      let zipCodes = [resultsList[i]]
        .reduce(
          (aggr, pd) => [...aggr, ...pd.getRowsList()],
          [] as PerDiemRow[],
        )
        .map(pdr => pdr.getZipCode());
      for (let j = 0; j < zipCodes.length; j++) {
        zipCodesList.push(zipCodes[j]);
      }
    }
    const govPerDiemsTemp = await PerDiemClientService.loadGovPerDiem(
      zipCodesList,
      year,
      month,
    );

    let filteredPerDiems = resultsList;
    function govPerDiemByZipCode(zipCode: string) {
      const govPerDiem = govPerDiemsTemp[zipCode];
      if (govPerDiem) return govPerDiem;
      return {
        meals: MEALS_RATE,
        lodging: 0,
      };
    }
    const processed = 1;
    let allRowsList = filteredPerDiems.reduce(
      (aggr: PerDiemRow[], pd) => [...aggr, ...pd.getRowsList()],
      [],
    );
    let totalMeals = allRowsList.reduce(
      (aggr, pdr) => aggr + govPerDiemByZipCode(pdr.getZipCode()).meals,
      0,
    );
    let totalLodging = allRowsList.reduce(
      (aggr, pdr) =>
        aggr +
        (pdr.getMealsOnly()
          ? 0
          : govPerDiemByZipCode(pdr.getZipCode()).lodging),
      0,
    );
    let totalMileage = 0;

    const totals = {
      totalMeals,
      totalLodging,
      totalMileage,
      processed: processed,
    };

    return totals;
  }, [startDay, userId]);
  const getSpiffToolTotals = useCallback(
    async (spiffType: string, dateType = 'Weekly') => {
      const req = new Task();
      const action = new SpiffToolAdminAction();
      req.setPayrollProcessed(false);
      req.setExternalId(userId);
      if (spiffType === 'Spiff') {
        const startDate = '0001-01-01';
        const endDayForSpiffs = format(addDays(startDay, 11), 'yyyy-MM-dd');
        action.setDateRangeList(['>=', startDate, '<', endDayForSpiffs]);
        action.setDateTargetList(['created_date', 'created_date']);
        action.setStatus(1);
        action.setDateTargetList(['decision_date']);
        action.setDateRangeList(['>=', startDate, '<', endDayForSpiffs]);

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
      req.setWithoutLimit(true);
      const results = (await TaskClientService.BatchGet(req)).getResultsList();
      //Here, we'll run another request for revoked, and if it pops up, we will remove the approved,
      //and treat the value as a negative
      const revokeReq = req;
      const revokeAction = action;
      revokeAction.setStatus(3);
      revokeReq.setSearchAction(revokeAction);

      const revokeResults = (
        await TaskClientService.BatchGet(revokeReq)
      ).getResultsList();

      for (let i = 0; i < revokeResults.length; i++) {
        const amount = revokeResults[i].getSpiffAmount();
        const negativeAmount = amount - 2 * amount;
        revokeResults[i].setSpiffAmount(negativeAmount);
      }
      for (let i = 0; i < results.length; i++) {
        if (
          revokeResults.find(
            revoke => revoke.getId() === results[i].getId(),
          ) === undefined
        ) {
          //remove duplicates
          revokeResults.push(results[i]);
        }
      }
      let spiffTotal = 0;
      let toolTotal = 0;
      for (let i = 0; i < revokeResults.length; i++) {
        if (spiffType == 'Spiff') {
          spiffTotal += revokeResults[i].getSpiffAmount();
        } else {
          toolTotal += revokeResults[i].getToolpurchaseCost();
        }
      }
      if (spiffType === 'Spiff') {
        if (dateType === 'Weekly') {
          dispatch({ type: 'updateSpiffs', data: revokeResults });
        }
        return spiffTotal;
      } else {
        return toolTotal;
      }
    },
    [userId, notReady, startDay],
  );
  const getSpiffToolTotalsProcessed = useCallback(
    async (spiffType: string, dateType = 'Weekly') => {
      const req = new Task();
      const action = new SpiffToolAdminAction();
      req.setExternalId(userId);
      req.setWithoutLimit(true);
      if (spiffType == 'Spiff') {
        req.setBillableType('Spiff');
      } else {
        req.setBillableType('Tool Purchase');
      }

      action.setDateRangeList([
        '>=',
        formatDateFns(startOfWeek(new Date())),
        '<=',
        formatDateFns(endOfWeek(new Date())),
      ]);
      action.setDateTargetList(['date_processed', 'date_processed']);
      action.setStatus(1);
      req.setSearchAction(action);

      const results = (
        await new TaskClient(ENDPOINT).BatchGet(req)
      ).getResultsList();

      //Here, we'll run another request for revoked, and if it pops up, we will remove the approved,
      //and treat the value as a negative
      const revokeReq = req;
      const revokeAction = action;
      revokeAction.setStatus(3);
      revokeReq.setSearchAction(revokeAction);
      const revokeResults = (
        await TaskClientService.BatchGet(revokeReq)
      ).getResultsList();

      for (let i = 0; i < revokeResults.length; i++) {
        const amount = revokeResults[i].getSpiffAmount();
        console.log('found a processed revoked spiff');
        const negativeAmount = amount - 2 * amount;
        revokeResults[i].setSpiffAmount(negativeAmount);
      }
      for (let i = 0; i < results.length; i++) {
        if (
          revokeResults.find(
            revoke => revoke.getId() === results[i].getId(),
          ) === undefined
        ) {
          //remove duplicates
          revokeResults.push(results[i]);
        }
      }
      let spiffTotal = 0;
      let toolTotal = 0;

      for (let i = 0; i < revokeResults.length; i++) {
        if (spiffType == 'Spiff') {
          spiffTotal += revokeResults[i].getSpiffAmount();
        } else {
          toolTotal += revokeResults[i].getToolpurchaseCost();
        }
      }
      if (spiffType === 'Spiff') {
        return spiffTotal;
      } else {
        return toolTotal;
      }
    },
    [userId],
  );
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
      {
        const timeFinished = results[i].getTimeFinished();
        const timeStarted = results[i].getTimeStarted();
        const subtotal = roundNumber(
          differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) /
            60,
        );

        total += subtotal;
      }
    }
    return total;
  }, [endDay, startDay, userId]);
  const toggleProcessSpiffTool = async (spiffTool: Task) => {
    const tempSpiffs = spiffs;
    for (let i = 0; i < spiffs!.length; i++) {
      if (tempSpiffs![i].getId() == spiffTool.getId()) {
        tempSpiffs![i].setPayrollProcessed(true);
      }
    }
    dispatch({ type: 'updateSpiff', data: spiffTool });
    dispatch({
      type: 'updateTotalSpiffsProcessed',
      value: spiffTool.getSpiffAmount(),
    });

    const id = spiffTool.getId();
    const req = new Task();
    req.setId(id);
    req.setFieldMaskList(['PayrollProcessed']);
    req.setPayrollProcessed(true);
    const adminReq = new SpiffToolAdminAction();
    await TaskClientService.Update(req);
    if (spiffTool.getActionsList()) {
      for (let i = 0; i < spiffTool.getActionsList().length; i++) {
        if (
          spiffTool.getActionsList()[i].getDateProcessed() === NULL_TIME_VALUE
        ) {
          adminReq.setId(spiffTool.getActionsList()[i].getId());
          adminReq.setDateProcessed(timestamp());
          adminReq.setFieldMaskList(['DateProcessed']);
          await SpiffToolAdminActionClientService.Update(adminReq);
        }
      }
    }
  };
  const toggleProcessPerDiems = async (perDiems: PerDiem[]) => {
    const tempPerDiem = {
      totalMeals: totalPerDiem.totalMeals,
      totalLodging: totalPerDiem.totalLodging,
      totalMileage: totalPerDiem.totalMileage,
      processed: 1,
    };
    const tempTrips = tripsTotal;
    dispatch({
      type: 'updateTotalTripsPerDiemProcessed',
      tripData: tempTrips,
      perDiemData: tempPerDiem,
    });
    function govPerDiemByZipCode(zipCode: string) {
      const govPerDiem = govPerDiems[zipCode];
      if (govPerDiem) return govPerDiem;
      return {
        meals: MEALS_RATE,
        lodging: 0,
      };
    }
    tempPerDiem.processed = 1;
    tempTrips.processed = true;
    tempTrips.totalDistance = 0;
    tempPerDiem.totalLodging = 0;
    tempPerDiem.totalMeals = 0;
    for (let i = 0; i < perDiems.length; i++) {
      let totalMeals = perDiems[i]
        .getRowsList()
        .reduce(
          (aggr, pdr) => aggr + govPerDiemByZipCode(pdr.getZipCode()).meals,
          0,
        );
      let totalLodging = perDiems[i]
        .getRowsList()
        .reduce(
          (aggr, pdr) =>
            aggr +
            (pdr.getMealsOnly()
              ? 0
              : govPerDiemByZipCode(pdr.getZipCode()).lodging),
          0,
        );
      let req = new PerDiem();
      req.setId(perDiems[i].getId());
      req.setPayrollProcessed(true);
      req.setAmountProcessedLodging(totalLodging);
      req.setAmountProcessedMeals(totalMeals);
      req.setFieldMaskList([
        'PayrollProcessed',
        'DateProcessed',
        'AmountProcessedLodging',
        'AmountProcessedMeals',
      ]);
      req.setDateProcessed(timestamp());

      await PerDiemClientService.Update(req);
    }
    if (trips && trips.length > 0) {
      for (let i = 0; i < trips.length; i++) {
        await PerDiemClientService.updateTripPayrollProcessed(trips[i].getId());
      }
    }
  };
  const load = useCallback(async () => {
    let promises = [];
    promises.push(
      new Promise<void>(async (resolve, reject) => {
        try {
          setLoaded(true);

          const processedHours = await getProcessedHoursTotals();
          setTotalHoursProcessed(processedHours);
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
          setLoaded(true);

          const spiffToolTotals = await getSpiffToolTotals('Spiff');
          setTotalSpiffsWeekly(spiffToolTotals);
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
          setLoaded(true);

          resolve();
          const spiffToolTotalsProcessed = await getSpiffToolTotalsProcessed(
            'Spiff',
          );
          console.log(spiffToolTotalsProcessed);
          dispatch({
            type: 'updateTotalSpiffsProcessed',
            value: spiffToolTotalsProcessed,
          });
        } catch (err) {
          console.log('error fetching total spiffs processed', err);
          reject(err);
        }
      }),
    );
    promises.push(
      new Promise<void>(async (resolve, reject) => {
        try {
          setLoaded(true);

          resolve();
          const perDiemTotals = await getPerDiemTotals();
          dispatch({ type: 'updatePerDiemTotal', data: perDiemTotals });
        } catch (err) {
          reject(err);
        }
      }),
    );
    promises.push(
      new Promise<void>(async (resolve, reject) => {
        try {
          setLoaded(true);

          resolve();
          const perDiemTotals = await getPerDiemTotalsProcessed();
          dispatch({
            type: 'updateTotalPerDiemProcessed',
            data: perDiemTotals,
          });
        } catch (err) {
          reject(err);
        }
      }),
    );
    promises.push(
      new Promise<void>(async (resolve, reject) => {
        try {
          setLoaded(true);

          const tripsData = await getTrips();
          //setTripsTotal(tripsData);
          dispatch({ type: 'updateTripsTotal', data: tripsData });
          resolve();
        } catch (err) {
          console.log('error getting trips', err);
          reject(err);
        }
      }),
    );
    promises.push(
      new Promise<void>(async (resolve, reject) => {
        try {
          setLoaded(true);
          const tripsDataProcessed = await getTripsProcessed();
          dispatch({
            type: 'updateTotalTripsProcessed',
            data: tripsDataProcessed,
          });
          resolve();
        } catch (err) {
          console.log('error getting trips', err);
          reject(err);
        }
      }),
    );
    try {
      await Promise.all(promises);
      setLoading(false);
      console.log('all promises executed without error, setting loaded');
      return;
    } catch (err) {
      setLoading(false);
      console.log('a promise failed');
      return;
    }
  }, [
    getPerDiemTotals,
    getPerDiemTotalsProcessed,
    getTrips,
    getTripsProcessed,
    getProcessedHoursTotals,
    getSpiffToolTotals,
    getSpiffToolTotalsProcessed,
  ]);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, load]);
  return !loading ? (
    <div>
      <strong>{username}</strong>
      {onClose ? <Button label="Close" onClick={() => onClose()}></Button> : []}
      <InfoTable
        columns={[
          { name: 'Week' },
          { name: 'Total Hours Processed' },
          { name: 'PerDiem Lodging total Processed Last Week' },
          { name: 'PerDiem Meals total Processed Last Week' },
          { name: 'Trips Total Last Week' },
          { name: 'Total Spiffs Last Week' },
        ]}
        data={
          loaded
            ? [
                [
                  {
                    value: formatDateFns(startDay),
                  },
                  {
                    value: totalHoursProcessed,
                  },
                  {
                    value: usd(totalPerDiemProcessed.totalLodging),
                  },
                  {
                    value: usd(totalPerDiemProcessed.totalMeals),
                  },
                  {
                    value:
                      totalTripsProcessed.totalDistance.toFixed(2) + ' miles',
                  },
                  {
                    value: usd(totalSpiffsProcessed),
                  },
                ],
              ]
            : makeFakeRows(5, 1)
        }
      ></InfoTable>

      <SectionBar
        title="Spiff Current Total"
        asideContent={
          <strong>Spiff Weekly Total : {usd(totalSpiffsWeekly)}</strong>
        }
        actionsAndAsideContentResponsive
      >
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
                      value: formatDate(spiff.getTimeCreated()),
                    },
                    {
                      value: usd(spiff.getSpiffAmount()),
                    },
                    {
                      value: spiff.getSpiffJobNumber(),
                    },
                    {
                      value:
                        spiff.getPayrollProcessed() === true
                          ? 'Complete'
                          : 'Incomplete',
                      actions:
                        spiff.getPayrollProcessed() === false
                          ? [
                              <IconButton
                                key="processSpiffWeekly"
                                size="small"
                                onClick={() => toggleProcessSpiffTool(spiff)}
                              >
                                <CheckIcon />
                              </IconButton>,
                            ]
                          : [],
                    },
                  ];
                })
              : makeFakeRows(5, 1)
          }
        />
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
              { name: 'Status' },
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
                    totalPerDiem.totalLodging != 0 ||
                    totalPerDiem.totalMeals != 0 ||
                    tripsTotal.totalDistance != 0
                      ? 'Incomplete'
                      : 'No PerDiems or Trips Remain',
                  actions:
                    totalPerDiem.totalLodging != 0 ||
                    totalPerDiem.totalMeals != 0 ||
                    tripsTotal.totalDistance !== 0
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
      {onPrevious != null ? (
        <Button label="Previous Employee" onClick={() => onPrevious()}></Button>
      ) : (
        []
      )}
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
