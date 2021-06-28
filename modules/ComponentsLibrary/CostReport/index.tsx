import { NULL_TIME } from '@kalos-core/kalos-rpc/constants';
import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { IRS_SUGGESTED_MILE_FACTOR, MEALS_RATE } from '../../../constants';
import {
  formatDate,
  usd,
  PerDiemClientService,
  EventClientService,
  TimesheetLineClientService,
  TransactionClientService,
  TimesheetDepartmentClientService,
  TaskClientService,
} from '../../../helpers';
import { PrintList } from '../PrintList';
import { PrintPage, Status } from '../PrintPage';
import { PrintParagraph } from '../PrintParagraph';
import { PrintTable } from '../PrintTable';
import { getPropertyAddress } from '@kalos-core/kalos-rpc/Property';
import { PerDiem, PerDiemRow } from '@kalos-core/kalos-rpc/PerDiem';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { Trip } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { Task } from '@kalos-core/kalos-rpc/Task';
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

export const GetTotalTransactions = (transactions: Transaction[]) => {
  return transactions.reduce((aggr, txn) => aggr + txn.getAmount(), 0);
};

export const CostReport: FC<Props> = ({ serviceCallId }) => {
  let tripsRendered: Trip[] = [];

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);

  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [perDiems, setPerDiems] = useState<PerDiem[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetLine[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lodgings, setLodgings] = useState<{ [key: number]: number }>({});

  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(0);

  const [loadedInit, setLoadedInit] = useState<boolean>(false);
  const [event, setEvent] = useState<Event>();
  const [loaded, setLoaded] = useState<boolean>(false);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsTotal, setTripsTotal] = useState<number>(0);
  const [tasks, setTasks] = useState<Task[]>([]);

  const totalTasksBillable = tasks.reduce(
    (aggr, task) => aggr + task.getBillable(),
    0,
  );

  const loadResources = useCallback(async () => {
    const resultsList = (
      await PerDiemClientService.loadPerDiemsByEventId(serviceCallId)
    ).getResultsList();

    let arr: PerDiem[] = [];

    resultsList.forEach(result => {
      let isIncluded = false;
      arr.forEach(arrItem => {
        if (arrItem.getId() == result.getId()) isIncluded = true;
      });
      if (!isIncluded) {
        arr.push(result);
      }
    });

    let allTrips: Trip[] = [];
    arr.forEach(pd =>
      pd.getRowsList().forEach(row => {
        allTrips.push(...row.getTripsList());
      }),
    );

    setTrips(allTrips);

    const lodgings = await PerDiemClientService.loadPerDiemsLodging(arr); // first # is per diem id
    setLodgings(lodgings);
    const transactions =
      await TransactionClientService.loadTransactionsByEventId(
        serviceCallId,
        true,
      );
    setTransactions(transactions);

    let allTripsTotal = 0;
    arr.forEach(perDiem => {
      perDiem.getRowsList().forEach(row => {
        row.getTripsList().forEach(trip => {
          // Subtracting 30 miles flat from trip distance in accordance
          // with reimbursement from home rule
          allTripsTotal +=
            trip.getDistanceInMiles() > 30 && trip.getHomeTravel()
              ? (trip.getDistanceInMiles() - 30) * IRS_SUGGESTED_MILE_FACTOR
              : trip.getDistanceInMiles() * IRS_SUGGESTED_MILE_FACTOR;
        });
      });
    });

    setTripsTotal(allTripsTotal);

    setPerDiems(arr);
  }, [serviceCallId, setPerDiems, setLodgings, setTripsTotal]);

  const totalMeals =
    perDiems.reduce((aggr, pd) => aggr + pd.getRowsList().length, 0) *
    MEALS_RATE;
  const totalLodging = perDiems
    .reduce((aggr, pd) => [...aggr, ...pd.getRowsList()], [] as PerDiemRow[])
    .filter(pd => !pd.getMealsOnly())
    .reduce((aggr, pd) => aggr + lodgings[pd.getId()], 0);
  const totalTransactions = transactions.reduce(
    (aggr, pd) => aggr + pd.getAmount(),
    0,
  );

  const loadPrintData = useCallback(async () => {
    const eventRes = await PerDiemClientService.loadPerDiemsByEventId(
      serviceCallId,
    );
    // TODO: loadPerDiemsLodging
    const lodgingRes = await PerDiemClientService.loadPerDiemsLodging(
      eventRes.getResultsList(),
    ); // first # is per diem id
    setLodgings(lodgingRes);
    const transactions =
      await TransactionClientService.loadTransactionsByEventId(
        serviceCallId,
        true,
      );
    setTransactions(transactions);
    setPerDiems(eventRes.getResultsList());
  }, [serviceCallId, setPerDiems, setLodgings]);

  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    await loadResources();
    setPrintStatus('loaded');
  }, [loadResources]);
  const handlePrinted = useCallback(
    () => setPrintStatus('idle'),
    [setPrintStatus],
  );

  const loadEvent = useCallback(async () => {
    setLoadingEvent(true);
    //const event = await loadEventById(serviceCallId);
    const event = await EventClientService.LoadEventByServiceCallID(
      serviceCallId,
    );
    setEvent(event);
    setLoadingEvent(false);
  }, [setEvent, setLoadingEvent, serviceCallId]);

  const loadInit = useCallback(async () => {
    await loadEvent();
    setLoadedInit(true);
  }, [loadEvent, setLoadedInit]);

  const load = useCallback(async () => {
    let promises = [];
    let timesheets: TimesheetLine[] = [];

    setLoading(true);

    promises.push(
      new Promise<void>(async resolve => {
        await loadResources();
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        try {
          let req = new TimesheetLine();
          req.setEventId(serviceCallId);

          timesheets = (
            await TimesheetLineClientService.BatchGet(req)
          ).getResultsList();

          resolve();
        } catch (err) {
          console.error(
            'Error occurred while loading the timesheet lines for the cost report. Error: ',
            err,
          );
        }
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        try {
          let req = new Task();
          req.setEventId(serviceCallId);

          setTasks((await TaskClientService.BatchGet(req)).getResultsList());

          resolve();
        } catch (err) {
          console.error(
            `Error occurred while loading the tasks for the cost report. Error: ${err}`,
          );
        }
      }),
    );

    Promise.all(promises).then(() => {
      setTimesheets(timesheets);
      setTasks(tasks);

      let total = 0;
      timesheets.forEach(
        timesheet => (total = total + timesheet.getHoursWorked()),
      );
      setTotalHoursWorked(total);

      setLoading(false);
    });
  }, [loadResources, serviceCallId, tasks]);

  useEffect(() => {
    if (!loadedInit) {
      loadInit();
    }
    if (loadedInit && !loaded) {
      setLoaded(true);
      load();
    }
  }, [loadedInit, loadInit, loaded, setLoaded, load]);

  return (
    <PrintPage
      buttonProps={{
        label: 'Print Cost Report',
        loading: loading || loadingEvent || printStatus === 'loading',
      }}
      downloadLabel="Download Cost Report"
      downloadPdfFilename="Cost-Report"
      headerProps={{ title: 'Project Cost Report' }}
      onPrint={handlePrint}
      onPrinted={handlePrinted}
      status={printStatus}
      key={printStatus}
      className="EditProjectAsideContent"
    >
      <PrintParagraph tag="h2">Project Details</PrintParagraph>
      {event && (
        <PrintList
          items={[
            <>
              <strong>Address: </strong>
              {getPropertyAddress(event.getProperty())}
            </>,
            <>
              <strong>Start Date: </strong>
              {formatDate(event.getDateStarted())}
            </>,
            <>
              <strong>End Date: </strong>
              {formatDate(event.getDateEnded())}
            </>,
            <>
              <strong>Job Number: </strong>
              {event.getLogJobNumber()}
            </>,
          ]}
        />
      )}
      <PrintParagraph tag="h2">Summary Info</PrintParagraph>
      <PrintTable
        columns={[
          { title: 'Type', align: 'left' },
          { title: 'Total', align: 'right' },
        ]}
        data={[
          [
            'Total Hours Worked',
            totalHoursWorked > 1
              ? `${totalHoursWorked} hrs`
              : totalHoursWorked == 0
              ? 'None'
              : `${totalHoursWorked} hr`,
          ],
        ]}
      />
      <PrintParagraph tag="h2">Costs</PrintParagraph>
      <PrintTable
        columns={[
          { title: 'Type', align: 'left' },
          { title: 'Cost', align: 'right' },
        ]}
        data={[
          ['Transactions', usd(totalTransactions)],
          ['Meals', usd(totalMeals)],
          ['Lodging', usd(totalLodging)],
          ['Tasks Billable', usd(totalTasksBillable)],
          ['Trips Total', usd(tripsTotal)],
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
      <PrintParagraph tag="h2">Transactions</PrintParagraph>
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
        data={transactions.map(txn => {
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
      <PrintParagraph tag="h2">Per Diem</PrintParagraph>
      {perDiems
        .sort((a, b) => (a.getDateSubmitted() > b.getDateSubmitted() ? -1 : 1))
        .map(pd => {
          const rowsList = pd.getRowsList();
          const totalMeals = MEALS_RATE * rowsList.length;
          const totalLodging = rowsList.reduce(
            (aggr, pd) => aggr + (pd.getMealsOnly() ? 0 : lodgings[pd.getId()]),
            0,
          );
          if (totalMeals == 0 && totalLodging == 0) {
            return <></>; // Don't show it
          }
          return (
            <div key={pd.getId()}>
              <PrintParagraph tag="h3">
                Per Diem{' '}
                {pd.getDateSubmitted().split(' ')[0] != NULL_TIME.split(' ')[0]
                  ? '-'
                  : ''}{' '}
                {pd.getDateSubmitted().split(' ')[0] != NULL_TIME.split(' ')[0]
                  ? pd.getDateSubmitted().split(' ')[0]
                  : ''}{' '}
                {pd.getOwnerName() ? '-' : ''} {pd.getOwnerName()}
              </PrintParagraph>
              <div
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
                      usd(MEALS_RATE),
                      lodgings[pdr.getId()] ? usd(lodgings[pdr.getId()]) : '-',
                      pdr.getNotes(),
                    ];
                  })}
                />
              </div>
            </div>
          );
        })}
      <PrintParagraph tag="h2">Timesheet Lines</PrintParagraph>
      {timesheets.map(tsl => {
        return (
          <div key={tsl.getId()}>
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
              data={[
                [
                  tsl.getTechnicianUserName() +
                    ` (${tsl.getTechnicianUserId()})`,
                  tsl.getDepartmentName(),
                  tsl.getAdminApprovalUserName(),
                  formatDate(tsl.getTimeStarted()) || '-',
                  formatDate(tsl.getTimeFinished()) || '-',
                  tsl.getBriefDescription(),
                  tsl.getHoursWorked() != 0
                    ? tsl.getHoursWorked() > 1
                      ? `${tsl.getHoursWorked()} hrs`
                      : `${tsl.getHoursWorked()} hr`
                    : '-',
                  tsl.getNotes(),
                ],
              ]}
            />
          </div>
        );
      })}
      <PrintParagraph tag="h2">Related Trips</PrintParagraph>
      {trips.map(trip => {
        let included = false;
        tripsRendered.forEach(tripRendered => {
          if (tripRendered.getId() == trip.getId()) included = true;
        });
        if (included) return <> </>;

        tripsRendered.push(trip);
        return (
          <div
            key={trip.getId()}
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
                    trip.getDistanceInMiles() > 30 && trip.getHomeTravel()
                      ? Number(
                          (
                            (trip.getDistanceInMiles() - 30) *
                            IRS_SUGGESTED_MILE_FACTOR
                          ).toFixed(2),
                        )
                      : Number(
                          (
                            trip.getDistanceInMiles() *
                            IRS_SUGGESTED_MILE_FACTOR
                          ).toFixed(2),
                        ),
                  )} ${
                    trip.getDistanceInMiles() > 30 && trip.getHomeTravel()
                      ? '(30 miles docked for home travel)'
                      : ''
                  }`,
                  trip.getPerDiemRowId(),
                ],
              ]}
            />
          </div>
        );
      })}
    </PrintPage>
  );
};
