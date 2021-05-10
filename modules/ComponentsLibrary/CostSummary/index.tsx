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
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { SectionBar } from '../SectionBar';
import { ENDPOINT, MEALS_RATE } from '../../../constants';
import { SpiffToolAdminAction } from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import {
  differenceInMinutes,
  parseISO,
  differenceInCalendarDays,
  subDays,
  addDays,
  startOfWeek,
  format,
} from 'date-fns';
import {
  Trip,
  TripList,
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
  notReady,
  onClose,
  onNext,
  username,
}) => {
  if (userId === 3639) {
    console.log('britton was here');
  }
  const [totalHoursProcessed, setTotalHoursProcessed] = useState<number>(0);

  const [totalSpiffsProcessed, setTotalSpiffsProcessed] = useState<number>(0);

  const [totalSpiffsWeekly, setTotalSpiffsWeekly] = useState<number>(0);
  const [spiffsWeekly, setSpiffsWeekly] = useState<Task[]>();
  const [totalPTO, setTotalPTO] = useState<number>(0);
  const [totalPerDiem, setTotalPerDiem] = useState<{
    totalMeals: number;
    totalLodging: number;
    totalMileage: number;
    processed: number;
  }>({ totalMeals: 0, totalLodging: 0, totalMileage: 0, processed: 0 });
  const [totalPerDiemProcessed, setTotalPerDiemProcessed] = useState<{
    totalMeals: number;
    totalLodging: number;
    totalMileage: number;
    processed: number;
  }>({ totalMeals: 0, totalLodging: 0, totalMileage: 0, processed: 0 });
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [perDiemsProcessed, setPerDiemsProcessed] = useState<PerDiemType[]>([]);
  const [trips, setTrips] = useState<Trip[]>();
  const [tripsTotal, setTripsTotal] = useState<{
    totalDistance: number;
    processed: boolean;
  }>({ totalDistance: 0, processed: true });
  const [loaded, setLoaded] = useState<boolean>(false);
  const today = new Date();
  const startDay = startOfWeek(subDays(today, 7), { weekStartsOn: 6 });
  const endDay = addDays(startDay, 7);
  const perDiemEndDay = addDays(startOfWeek(today, { weekStartsOn: 6 }), 4);
  const [govPerDiems, setGovPerDiems] = useState<{
    [key: string]: {
      meals: number;
      lodging: number;
    };
  }>({});
  const [govPerDiemsProcessed, setGovPerDiemsProcessed] = useState<{
    [key: string]: {
      meals: number;
      lodging: number;
    };
  }>({});
  const formatDateFns = (date: Date) => format(date, 'yyyy-MM-dd');
  const govPerDiemByZipCodeProcessed = useCallback(
    (zipCode: string) => {
      const govPerDiem = govPerDiemsProcessed[zipCode];
      if (govPerDiem) return govPerDiem;
      return {
        meals: MEALS_RATE,
        lodging: 0,
      };
    },
    [govPerDiemsProcessed],
  );
  (() => console.log)();
  const getTrips = useCallback(async () => {
    let trip = new Trip();
    trip.setUserId(userId);
    let processed = true;
    let tempTripList = new TripList().getResultsList();
    setTrips(tempTripList);
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
  const getTripsProcessed = useCallback(async () => {
    let trip = new Trip();
    trip.setUserId(userId);
    let processed = true;
    let tempTripList = new TripList().getResultsList();
    trip.setPayrollProcessed(true);
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
  /*
  const getPerDiems = useCallback(async () => {
    const {
      resultsList,
    } = await PerDiemClientService.loadPerDiemByUserIdAndDateStartedAudited(
      userId,
      formatDateFns(perDiemEndDay),
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
    const govPerDiems = await PerDiemClientService.loadGovPerDiem(
      zipCodesList,
      year,
      month,
    );
    //setGovPerDiems(govPerDiems);
  }, [startDay, userId, perDiemEndDay]);
  */
  const getPerDiemTotals = useCallback(async () => {
    const {
      resultsList,
    } = await PerDiemClientService.loadPerDiemByUserIdAndDateStartedAudited(
      userId,
      formatDateFns(perDiemEndDay),
    );
    //get PerDiems, set them
    setPerDiems(resultsList);
    console.log(resultsList);
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
    const govPerDiemsTemp = await PerDiemClientService.loadGovPerDiem(
      zipCodesList,
      year,
      month,
    );
    let processed = 0;
    let filteredPerDiems = resultsList;
    if (resultsList.length > 0) {
      for (let i = 0; i < resultsList.length; i++) {
        if (resultsList[i].payrollProcessed) {
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
  }, [perDiemEndDay, userId, startDay]);

  const getPerDiemProcessedTotals = useCallback(async () => {
    const tempPerDiems = perDiemsProcessed;
    let processed = 0;
    let filteredPerDiems = tempPerDiems;
    if (perDiemsProcessed.length > 0) {
      for (let i = 0; i < perDiemsProcessed.length; i++) {
        if (perDiemsProcessed[i].payrollProcessed) {
          processed = 1;
        }
      }
    }
    let allRowsList = filteredPerDiems.reduce(
      (aggr, { rowsList }) => [...aggr, ...rowsList],
      [] as PerDiemRowType[],
    );
    let totalMeals = allRowsList.reduce(
      (aggr, { zipCode }) => aggr + govPerDiemByZipCodeProcessed(zipCode).meals,
      0,
    );
    let totalLodging = allRowsList.reduce(
      (aggr, { zipCode, mealsOnly }) =>
        aggr + (mealsOnly ? 0 : govPerDiemByZipCodeProcessed(zipCode).lodging),
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
  }, [perDiemsProcessed, govPerDiemByZipCodeProcessed]);
  const getSpiffToolTotals = useCallback(
    async (spiffType: string, dateType = 'Weekly') => {
      const req = new Task();
      const action = new SpiffToolAdminAction();
      req.setPayrollProcessed(false);
      req.setExternalId(userId);
      if (spiffType === 'Spiff') {
        const startDate = '0001-01-01';
        const endDate = format(endDay, 'yyyy-MM-dd');
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
          spiffTotal += results[i].toObject().spiffAmount;
        } else {
          toolTotal += results[i].toObject().toolpurchaseCost;
        }
      }
      if (spiffType === 'Spiff') {
        if (dateType === 'Weekly') {
          setSpiffsWeekly(results);
        }
        return spiffTotal;
      } else {
        return toolTotal;
      }
    },
    [notReady, userId, endDay],
  );
  const getSpiffToolTotalsProcessed = useCallback(
    async (spiffType: string, dateType = 'Weekly') => {
      const req = new Task();
      const action = new SpiffToolAdminAction();
      req.setPayrollProcessed(true);
      req.setExternalId(userId);
      if (spiffType === 'Spiff') {
        const startDate = format(startDay, 'yyyy-MM-dd');
        const endDate = format(endDay, 'yyyy-MM-dd');
        req.setDateRangeList(['>=', startDate, '<', endDate]);
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
          spiffTotal += results[i].toObject().spiffAmount;
        } else {
          toolTotal += results[i].toObject().toolpurchaseCost;
        }
      }
      if (spiffType === 'Spiff') {
        if (dateType === 'Weekly') {
          setSpiffsWeekly(results);
        }
        return spiffTotal;
      } else {
        return toolTotal;
      }
    },
    [userId, startDay, endDay],
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
      if (
        !results[i].toObject().referenceNumber.includes('PTO') &&
        !results[i].toObject().briefDescription.includes('PTO')
      ) {
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
  useEffect(() => {
    const load = async () => {
      let promises = [];

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
      /*
      promises.push(
        new Promise<void>(async resolve => {
          setTotalTools(await getSpiffToolTotals('Tool Purchase'));
          resolve();
        }),
      );
      */
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
      /*
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            await getPerDiems();
            resolve();
          } catch (err) {
            console.log('error getting per diem', err);
            reject(err);
          }
        }),
      );
      */
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            resolve();
            const perDiemTotals = await getPerDiemTotals();
            setTotalPerDiem(perDiemTotals);
          } catch (err) {
            reject(err);
          }
        }),
      );
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            const tripsData = await getTrips();
            setTripsTotal(tripsData);
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
    getTimeoffTotals,
    loaded,
    getPerDiemTotals,
    getSpiffToolTotals,
    getTrips,
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
              value: totalPTO + totalHoursProcessed,
            },
            {
              value: usd(totalPerDiemProcessed.totalLodging),
            },
            {
              value: usd(totalPerDiemProcessed.totalMeals),
            },
            {
              value: 0, //should be trip total
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
            { name: 'Date Created' },
            { name: 'Amount' },
            { name: 'Job Number' },
            { name: 'Processed' },
          ]}
          data={
            spiffsWeekly
              ? spiffsWeekly.map(spiff => {
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
                        spiff.toObject().payrollProcessed === false
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
