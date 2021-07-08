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
} from '../../../helpers';
import { reducer } from './reducer';
import { NULL_TIME_VALUE } from '../Timesheet/constants';
import { NULL_TIME } from '@kalos-core/kalos-rpc/constants';
import { fi } from 'date-fns/locale';
import { act } from 'react-test-renderer';
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
  const [spiffsWeekly, setSpiffsWeekly] = useState<Task[]>();
  const [totalPTO, setTotalPTO] = useState<number>(0);
  const [perDiems, setPerDiems] = useState<PerDiem[]>([]);
  const [trips, setTrips] = useState<Trip[]>();
  const [loaded, setLoaded] = useState<boolean>(false);
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
    const pdRes = await PerDiemClientService.loadPerDiemByUserIdAndDateStartedAudited(
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
    for (let i = 0; i < allRowsList.length; i++) {
      totalMileage = allRowsList[i]
        .getTripsList()
        .reduce((aggr, t) => aggr + t.getDistanceInMiles(), 0);
    }

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
    for (let i = 0; i < allRowsList.length; i++) {
      totalMileage = allRowsList[i]
        .getTripsList()
        .reduce((aggr, t) => aggr + t.getDistanceInMiles(), 0);
    }

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
        /*
        const startDate = '0001-01-01';
        const endDayForSpiffs = format(addDays(startDay, 11), 'yyyy-MM-dd');
        req.setDateRangeList(['>=', startDate, '<', endDayForSpiffs]);
        req.setDateTargetList(['time_created', 'time_created']);
      */
        const startDate = '0001-01-01';
        const endDayForSpiffs = format(addDays(startDay, 11), 'yyyy-MM-dd');
        action.setDateRangeList(['>=', startDate, '<', endDayForSpiffs]);
        action.setDateTargetList(['created_date', 'created_date']);
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
      //Here, we'll run another request for revoked, and if it pops up, we will remove the approved,
      //and treat the value as a negative
      const revokeReq = req;
      const revokeAction = action;
      revokeAction.setStatus(3);
      revokeReq.setSearchAction(revokeAction);
      const revokeResults = (
        await new TaskClient(ENDPOINT).BatchGet(revokeReq)
      ).getResultsList();
      for (let i = 0; i < revokeResults.length; i++) {
        for (let j = 0; j < results.length; j++) {
          if (revokeResults[i].getId() === results[j].getId()) {
            const amount = revokeResults[i].getSpiffAmount();
            revokeResults[i].setSpiffAmount(amount - 2 * amount);
            results[j].setSpiffAmount(revokeResults[i].getSpiffAmount());
          }
        }
      }
      let spiffTotal = 0;
      let toolTotal = 0;
      for (let i = 0; i < results.length; i++) {
        if (spiffType == 'Spiff') {
          spiffTotal += results[i].getSpiffAmount();
        } else {
          toolTotal += results[i].getToolpurchaseCost();
        }
      }
      if (spiffType === 'Spiff') {
        if (dateType === 'Weekly') {
          dispatch({ type: 'updateSpiffs', data: results });
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
      if (spiffType == 'Spiff') {
        req.setBillableType('Spiff');
      } else {
        req.setBillableType('Tool Purchase');
      }
      const results = [];

      action.setDateRangeList([
        '>=',
        formatDateFns(startOfWeek(new Date())),
        '<=',
        formatDateFns(endOfWeek(new Date())),
      ]);
      action.setDateTargetList(['date_processed', 'date_processed']);

      req.setSearchAction(action);

      const tempResults = (
        await new TaskClient(ENDPOINT).BatchGet(req)
      ).getResultsList();
      if (tempResults.length > 0) {
        for (let j = 0; j < tempResults.length; j++) {
          results.push(tempResults[j]);
        }
      }

      //Here, we'll run another request for revoked, and if it pops up, we will remove the approved,
      //and treat the value as a negative
      const revokeReq = req;
      const revokeAction = action;
      revokeAction.setStatus(3);
      revokeReq.setSearchAction(revokeAction);
      const revokeResults = (
        await new TaskClient(ENDPOINT).BatchGet(revokeReq)
      ).getResultsList();
      for (let i = 0; i < revokeResults.length; i++) {
        for (let j = 0; j < results.length; j++) {
          if (revokeResults[i].getId() === results[j].getId()) {
            const amount = revokeResults[i].getSpiffAmount();
            revokeResults[i].setSpiffAmount(amount - 2 * amount);
            results[j].setSpiffAmount(revokeResults[i].getSpiffAmount());
          }
        }
      }
      let spiffTotal = 0;
      let toolTotal = 0;
      console.log(tempResults);
      for (let i = 0; i < results.length; i++) {
        if (spiffType == 'Spiff') {
          spiffTotal += results[i].getSpiffAmount();
        } else {
          toolTotal += results[i].getToolpurchaseCost();
        }
      }
      if (spiffType === 'Spiff') {
        return spiffTotal;
      } else {
        return toolTotal;
      }
    },
    [userId],
  ); /*
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
    const results = (
      await TimeoffRequestClientService.loadTimeoffRequests(filter)
    ).resultsList;
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
          differenceInCalendarDays(
            parseISO(timeFinished),
            parseISO(timeStarted),
          ) + 1;
        total += numberOfDays * 8;
      }
    }
    return total;
  }, [userId, notReady, endDay, startDay]);
  */
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
        console.log('we found it');
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
    //setSpiffsWeekly(tempSpiffs);
  };
  const toggleProcessPerDiems = async (perDiems: PerDiem[]) => {
    for (let i = 0; i < perDiems.length; i++) {
      let req = new PerDiem();
      req.setId(perDiems[i].getId());
      req.setPayrollProcessed(true);
      req.setFieldMaskList(['PayrollProcessed', 'DateProcessed']);
      req.setDateProcessed(timestamp());
      await PerDiemClientService.Update(req);
    }
    if (trips && trips.length > 0) {
      for (let i = 0; i < trips.length; i++) {
        await PerDiemClientService.updateTripPayrollProcessed(trips[i].getId());
      }
    }
  };
  useEffect(() => {
    const load = async () => {
      let promises = [];
      /*
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            const totalPTO = await getTimeoffTotals();
            setTotalPTO(totalPTO);
            resolve();
          } catch (err) {
            console.log('error setting total PTO', err);
            reject(err);
          }
        }),
      );
      */
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
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
            resolve();
            const perDiemTotals = await getPerDiemTotals();
            //setTotalPerDiem(perDiemTotals);
            dispatch({ type: 'updatePerDiemTotal', data: perDiemTotals });
          } catch (err) {
            reject(err);
          }
        }),
      );
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            resolve();
            const perDiemTotals = await getPerDiemTotalsProcessed();
            dispatch({
              type: 'updatePerDiemTotalProcessed',
              data: perDiemTotals,
            });
            //setTotalPerDiemProcessed(perDiemTotals);
          } catch (err) {
            reject(err);
          }
        }),
      );
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
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
            const tripsDataProcessed = await getTripsProcessed();
            dispatch({
              type: 'updateTripsTotalProcessed',
              data: tripsDataProcessed,
            });
            console.log(tripsDataProcessed);
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
  }, [
    getProcessedHoursTotals,
    // getTimeoffTotals,
    loaded,
    getPerDiemTotals,
    getSpiffToolTotals,
    getTrips,
    getSpiffToolTotalsProcessed,
    getTripsProcessed,
    getPerDiemTotalsProcessed,
  ]);
  return loaded ? (
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
        data={[
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
              value: totalTripsProcessed.totalDistance.toFixed(2) + ' miles',
            },
            {
              value: usd(totalSpiffsProcessed),
            },
          ],
        ]}
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
              : []
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
