import { NULL_TIME } from '@kalos-core/kalos-rpc/constants';
import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { MEALS_RATE } from '../../../constants';
import {
  formatDate,
  usd,
  PerDiemRowType,
  EventType,
  PerDiemType,
  TransactionType,
  PerDiemClientService,
  EventClientService,
  TimesheetLineClientService,
  TransactionClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import { PrintList } from '../PrintList';
import { PrintPage, Status } from '../PrintPage';
import { PrintParagraph } from '../PrintParagraph';
import { PrintTable } from '../PrintTable';
import { getPropertyAddress } from '@kalos-core/kalos-rpc/Property';
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

export const CostReport: FC<Props> = ({
  serviceCallId,
  loggedUserId,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);

  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetLine.AsObject[]>([]);

  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [lodgings, setLodgings] = useState<{ [key: number]: number }>({});

  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(0);

  const [loadedInit, setLoadedInit] = useState<boolean>(false);
  const [event, setEvent] = useState<EventType>();
  const [loaded, setLoaded] = useState<boolean>(false);

  const totalMeals =
    perDiems.reduce((aggr, { rowsList }) => aggr + rowsList.length, 0) *
    MEALS_RATE;
  const totalLodging = perDiems
    .reduce(
      (aggr, { rowsList }) => [...aggr, ...rowsList],
      [] as PerDiemRowType[],
    )
    .filter(({ mealsOnly }) => !mealsOnly)
    .reduce((aggr, { id }) => aggr + lodgings[id], 0);
  const totalTransactions = transactions.reduce(
    (aggr, { amount }) => aggr + amount,
    0,
  );

  const loadResources = useCallback(async () => {
    const { resultsList } = await PerDiemClientService.loadPerDiemsByEventId(
      serviceCallId,
    );
    const lodgings = await PerDiemClientService.loadPerDiemsLodging(
      resultsList,
    ); // first # is per diem id
    setLodgings(lodgings);
    const transactions =
      await TransactionClientService.loadTransactionsByEventId(
        serviceCallId,
        true,
      );
    setTransactions(transactions);
    setPerDiems(resultsList);
  }, [serviceCallId, setPerDiems, setLodgings]);

  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    await loadResources();
    setPrintStatus('loaded');
  }, [setPrintStatus, loadResources]);
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

  const getMinutesFromTimeString = (timeStarted: string, timeEnded: string) => {
    return Math.abs(
      Math.round(
        (new Date(timeStarted).getTime() - new Date(timeEnded).getTime()) /
          1000 /
          60,
      ),
    );
  };

  const load = useCallback(async () => {
    let promises = [];
    let timesheets: TimesheetLine.AsObject[] = [];

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

          timesheets = (await TimesheetLineClientService.BatchGet(req))
            .getResultsList()
            .map(line => line.toObject());

          resolve();
        } catch (err) {
          console.error(
            'Error occurred while loading the timesheet lines for the cost report. Error: ',
            err,
          );
        }
      }),
    );

    Promise.all(promises).then(() => {
      setTimesheets(timesheets);

      let total = 0;

      timesheets.forEach(timesheet => {
        let hoursWorked =
          getMinutesFromTimeString(
            timesheet.timeStarted,
            timesheet.timeFinished,
          ) / 60;
        total = total + hoursWorked;
      });
      setTotalHoursWorked(total);

      setLoading(false);
    });
  }, [setLoading, serviceCallId, loadResources]);

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
              {getPropertyAddress(event.property)}
            </>,
            <>
              <strong>Start Date: </strong>
              {formatDate(event.dateStarted)}
            </>,
            <>
              <strong>End Date: </strong>
              {formatDate(event.dateEnded)}
            </>,
            <>
              <strong>Job Number: </strong>
              {event.logJobNumber}
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
          [
            '',
            <strong key="stronk">
              TOTAL: {usd(totalMeals + totalLodging + totalTransactions)}
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
        data={transactions.map(
          ({
            department,
            ownerName,
            amount,
            notes,
            costCenter,
            timestamp,
            vendor,
          }) => {
            return [
              department ? (
                <>
                  {department.classification} - {department.description}
                </>
              ) : (
                '-'
              ),
              ownerName,
              <>
                {`${costCenter?.description}` + ' - '}
                <br />
                {vendor}
              </>,
              formatDate(timestamp),
              usd(amount),
              notes,
            ];
          },
        )}
      />
      <PrintParagraph tag="h2">Per Diem</PrintParagraph>
      {perDiems
        .sort((a, b) => (a.dateSubmitted > b.dateSubmitted ? -1 : 1))
        .map(
          ({
            id,
            department,
            ownerName,
            dateSubmitted,
            approvedByName,
            dateApproved,
            notes,
            rowsList,
          }) => {
            const totalMeals = MEALS_RATE * rowsList.length;
            const totalLodging = rowsList.reduce(
              (aggr, { id, mealsOnly }) =>
                aggr + (mealsOnly ? 0 : lodgings[id]),
              0,
            );
            if (totalMeals == 0 && totalLodging == 0) {
              return <></>; // Don't show it
            }
            return (
              <div key={id}>
                <PrintParagraph tag="h3">
                  Per Diem{' '}
                  {dateSubmitted.split(' ')[0] != NULL_TIME.split(' ')[0]
                    ? '-'
                    : ''}{' '}
                  {dateSubmitted.split(' ')[0] != NULL_TIME.split(' ')[0]
                    ? dateSubmitted.split(' ')[0]
                    : ''}{' '}
                  {ownerName ? '-' : ''} {ownerName}
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
                          department!,
                        ),
                        ownerName,
                        dateSubmitted != NULL_TIME
                          ? formatDate(dateSubmitted)
                          : '-' || '-',
                        approvedByName || '-',
                        dateApproved != NULL_TIME
                          ? formatDate(dateApproved)
                          : '-' || '-',
                        usd(totalMeals),
                        totalLodging != 0 ? usd(totalLodging) : '-',
                        notes,
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
                    data={rowsList.map(
                      ({
                        id,
                        dateString,
                        zipCode,
                        mealsOnly,
                        notes,
                        perDiemId,
                      }) => {
                        return [
                          formatDate(dateString),
                          zipCode,
                          mealsOnly ? 'Yes' : 'No',
                          usd(MEALS_RATE),
                          lodgings[id] ? usd(lodgings[id]) : '-',
                          notes,
                        ];
                      },
                    )}
                  />
                </div>
              </div>
            );
          },
        )}
      <PrintParagraph tag="h2">Timesheet Lines</PrintParagraph>
      {timesheets.map(
        ({
          id,
          departmentName,
          timeStarted,
          timeFinished,
          adminApprovalUserName,
          notes,
          briefDescription,
          technicianUserName,
          technicianUserId,
        }) => {
          let hrsWorked =
            getMinutesFromTimeString(timeFinished, timeStarted) / 60;
          return (
            <div key={id}>
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
                    technicianUserName + ` (${technicianUserId})`,
                    departmentName,
                    adminApprovalUserName,
                    formatDate(timeStarted) || '-',
                    formatDate(timeFinished) || '-',
                    briefDescription,
                    hrsWorked != 0
                      ? hrsWorked > 1
                        ? `${hrsWorked} hrs`
                        : `${hrsWorked} hr`
                      : '-',
                    notes,
                  ],
                ]}
              />
            </div>
          );
        },
      )}
    </PrintPage>
  );
};
