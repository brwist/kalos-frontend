import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import Typography from '@material-ui/core/Typography';
import { Variant } from '@material-ui/core/styles/createTypography';
import { format } from 'date-fns';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { MEALS_RATE, NULL_TIME } from '../../../../constants';
import {
  EventClientService,
  formatDate,
  PerDiemClientService,
  TimesheetDepartmentClientService,
  TimesheetLineClientService,
  TransactionClientService,
  usd,
} from '../../../../helpers';
import { Loader } from '../../../Loader/main';
import { InfoTable } from '../../InfoTable';
import { SectionBar } from '../../SectionBar';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { PerDiem } from '@kalos-core/kalos-rpc/PerDiem';

export interface Props {
  serviceCallId: number;
}

export const BillingTab: FC<Props> = ({ serviceCallId }) => {
  const sizeOfText: Variant = 'subtitle1';

  const [event, setEvent] = useState<Event>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [perDiems, setPerDiems] = useState<PerDiem[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetLine[]>();
  const [lodgings, setLodgings] = useState<{ [key: number]: number }>({});

  const [totalHoursWorked, setTotalHoursWorked] = useState<number>();
  const [totalTransactions, setTotalTransactions] = useState<number>();

  const [loadingEvent, setLoadingEvent] = useState<boolean>();

  const loadEvent = useCallback(async () => {
    setLoadingEvent(true);
    const event = await EventClientService.LoadEventByServiceCallID(
      serviceCallId,
    );
    setEvent(event);
    setLoadingEvent(false);
  }, [setEvent, setLoadingEvent, serviceCallId]);

  const loadPrintData = useCallback(async () => {
    const resultsList = (
      await PerDiemClientService.loadPerDiemsByEventId(serviceCallId)
    ).getResultsList();
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
    setTotalTransactions(
      transactions.reduce((aggr, t) => aggr + t.getAmount(), 0),
    );
    setPerDiems(resultsList);
  }, [
    serviceCallId,
    setPerDiems,
    setLodgings,
    setTransactions,
    setTotalTransactions,
  ]);

  const loadTimesheets = useCallback(async () => {
    try {
      let req = new TimesheetLine();
      req.setEventId(serviceCallId);

      setTimesheets(
        (await TimesheetLineClientService.BatchGet(req)).getResultsList(),
      );
    } catch (err) {
      console.error(
        'Error occurred while loading the timesheet lines for the cost report. Error: ',
        err,
      );
    }
  }, [setTimesheets, serviceCallId]);

  const calculateTotalHoursWorked = useCallback(() => {
    let total = 0;
    timesheets?.forEach(
      timesheet => (total = total + timesheet.getHoursWorked()),
    );
    setTotalHoursWorked(total);
  }, [timesheets]);

  const load = useCallback(() => {
    loadEvent();
    loadTimesheets();
    calculateTotalHoursWorked();
    loadPrintData();
  }, [loadEvent, loadTimesheets, calculateTotalHoursWorked, loadPrintData]);

  useEffect(() => {
    load();
  }, [load]);

  return loadingEvent ? (
    <Loader />
  ) : (
    <>
      <SectionBar title="Project Details">
        <Typography variant={sizeOfText}>
          {event?.getProperty()
            ? `Address: ${event.getProperty()?.getAddress()}`
            : ''}
        </Typography>
        <Typography variant={sizeOfText}>
          {event?.getDateStarted()
            ? `Start Date: ${format(
                new Date(event.getDateStarted()),
                'yyyy-MM-dd',
              )}`
            : ''}
        </Typography>
        <Typography variant={sizeOfText}>
          {event?.getDateEnded()
            ? `End Date: ${format(
                new Date(event.getDateEnded()),
                'yyyy-MM-dd',
              )}`
            : ''}
        </Typography>
        <Typography variant={sizeOfText}>
          {event?.getLogJobNumber()
            ? `Job Number: ${event.getLogJobNumber()}`
            : ''}
        </Typography>
      </SectionBar>

      <SectionBar title="Summary Info">
        <InfoTable
          columns={[
            { name: 'Type', align: 'left' },
            { name: 'Total', align: 'right' },
          ]}
          data={[
            [
              {
                value: 'Total Hours Worked: ',
              },
              {
                value:
                  // If totalHoursWorked is set and the totalHoursWorked > 1, displays "totalHoursWorked hrs"
                  // else if totalHoursWorked is 0 then
                  // "None"
                  // Otherwise it must be 1, so display "totalHoursWorked hr"
                  // If it is undefined, then simply display an empty character
                  // I really hope that cleared this up
                  totalHoursWorked !== undefined
                    ? totalHoursWorked > 1
                      ? `${totalHoursWorked} hrs`
                      : totalHoursWorked == 0
                      ? 'None'
                      : `${totalHoursWorked} hr`
                    : '',
              },
            ],
          ]}
        />
      </SectionBar>

      <SectionBar title="Costs">
        <InfoTable
          columns={[
            { name: 'Type', align: 'left' },
            { name: 'Cost', align: 'right' },
          ]}
          data={[
            [
              {
                value: 'Transactions',
              },
              {
                value: totalTransactions ? usd(totalTransactions) : usd(0),
              },
            ],
          ]}
        />
      </SectionBar>

      <SectionBar title="Transactions">
        <InfoTable
          columns={[
            {
              name: 'Department',
              align: 'left',
            },
            {
              name: 'Owner',
              align: 'left',
            },
            {
              name: 'Cost Center / Vendor',
              align: 'left',
            },
            {
              name: 'Date',
              align: 'left',
            },
            {
              name: 'Amount',
              align: 'left',
            },
            {
              name: 'Notes',
              align: 'right',
            },
          ]}
          data={transactions.map(t => {
            return [
              {
                value: t.getDepartment() ? (
                  <>
                    {t.getDepartment()?.getClassification()} -{' '}
                    {t.getDepartment()?.getDescription()}
                  </>
                ) : (
                  '-'
                ),
              },
              {
                value: t.getOwnerName(),
              },
              {
                value: (
                  <>
                    {`${t.getCostCenter()?.getDescription()}` + ' - '}
                    <br />
                    {t.getVendor()}
                  </>
                ),
              },
              {
                value: formatDate(t.getTimestamp()),
              },
              {
                value: usd(t.getAmount()),
              },
              {
                value: t.getNotes(),
              },
            ];
          })}
        />
      </SectionBar>

      <SectionBar title="Per Diems">
        {perDiems
          .sort((a, b) =>
            a.getDateSubmitted() > b.getDateSubmitted() ? -1 : 1,
          )
          .map(pd => {
            const rowsList = pd.getRowsList();
            const totalMeals = MEALS_RATE * rowsList.length;
            const totalLodging = rowsList.reduce(
              (aggr, r) => aggr + (r.getMealsOnly() ? 0 : lodgings[r.getId()]),
              0,
            );
            if (totalMeals == 0 && totalLodging == 0) {
              return <></>; // Don't show it
            }
            let perDiemString =
              `Per Diem ${
                pd.getDateSubmitted().split(' ')[0] != NULL_TIME.split(' ')[0]
                  ? `- ${pd.getDateSubmitted().split(' ')[0]}`
                  : ''
              }` + `${pd.getOwnerName() ? ` - ${pd.getOwnerName()}` : ''}`;
            return (
              <div key={pd.getId()}>
                <SectionBar title={perDiemString} small />
                <InfoTable
                  columns={[
                    {
                      name: 'Department',
                      align: 'left',
                    },
                    {
                      name: 'Owner',
                      align: 'left',
                    },
                    {
                      name: 'Submitted At',
                      align: 'left',
                    },
                    {
                      name: 'Approved By',
                      align: 'left',
                    },
                    {
                      name: 'Approved At',
                      align: 'left',
                    },
                    {
                      name: 'Total Meals',
                      align: 'left',
                    },
                    {
                      name: 'Total Lodging',
                      align: 'left',
                    },
                    {
                      name: 'Notes',
                      align: 'right',
                    },
                  ]}
                  data={[
                    [
                      {
                        value:
                          TimesheetDepartmentClientService.getDepartmentName(
                            pd.getDepartment()!,
                          ),
                      },
                      {
                        value: pd.getOwnerName(),
                      },
                      {
                        value:
                          pd.getDateSubmitted() != NULL_TIME
                            ? formatDate(pd.getDateSubmitted())
                            : '-' || '-',
                      },
                      {
                        value: pd.getApprovedByName() || '-',
                      },
                      {
                        value:
                          pd.getDateApproved() != NULL_TIME
                            ? formatDate(pd.getDateApproved())
                            : '-' || '-',
                      },
                      {
                        value: usd(totalMeals),
                      },
                      {
                        value: totalLodging != 0 ? usd(totalLodging) : '-',
                      },
                      {
                        value: pd.getNotes(),
                      },
                    ],
                  ]}
                />
                <SectionBar title="Per Diem Days" small />
                <InfoTable
                  columns={[
                    {
                      name: 'Date',
                      align: 'left',
                    },
                    {
                      name: 'Zip Code',
                      align: 'left',
                    },
                    {
                      name: 'Meals Only',
                      align: 'left',
                    },
                    {
                      name: 'Meals',
                      align: 'left',
                    },
                    {
                      name: 'Lodging',
                      align: 'left',
                    },
                    {
                      name: 'Notes',
                      align: 'right',
                    },
                  ]}
                  data={rowsList.map(r => {
                    return [
                      {
                        value: formatDate(r.getDateString()),
                      },
                      {
                        value: r.getZipCode(),
                      },
                      {
                        value: r.getMealsOnly() ? 'Yes' : 'No',
                      },
                      {
                        value: usd(MEALS_RATE),
                      },
                      {
                        value: lodgings[r.getId()]
                          ? usd(lodgings[r.getId()])
                          : '-',
                      },
                      {
                        value: r.getNotes(),
                      },
                    ];
                  })}
                />
              </div>
            );
          })}
      </SectionBar>
      <SectionBar title="Timesheet Lines">
        {timesheets?.map(tl => {
          return (
            <div key={tl.getId()}>
              <InfoTable
                columns={[
                  {
                    name: 'Technician',
                    align: 'left',
                  },
                  {
                    name: 'Department',
                    align: 'left',
                  },
                  {
                    name: 'Approved By',
                    align: 'left',
                  },
                  {
                    name: 'Time Started',
                    align: 'left',
                  },
                  {
                    name: 'Time Finished',
                    align: 'left',
                  },
                  {
                    name: 'Brief Description',
                    align: 'left',
                  },
                  {
                    name: 'Hours Worked',
                    align: 'left',
                  },
                  {
                    name: 'Notes',
                    align: 'right',
                  },
                ]}
                data={[
                  [
                    {
                      value: tl.getTechnicianUserName(),
                    },
                    {
                      value: tl.getDepartmentName(),
                    },
                    {
                      value: tl.getAdminApprovalUserName(),
                    },
                    {
                      value: formatDate(tl.getTimeStarted()) || '-',
                    },
                    {
                      value: formatDate(tl.getTimeFinished()) || '-',
                    },
                    {
                      value: tl.getBriefDescription(),
                    },
                    {
                      value:
                        tl.getHoursWorked() != 0
                          ? tl.getHoursWorked() > 1
                            ? `${tl.getHoursWorked()} hrs`
                            : `${tl.getHoursWorked()} hr`
                          : '-',
                    },
                    {
                      value: tl.getNotes(),
                    },
                  ],
                ]}
              />
            </div>
          );
        })}
      </SectionBar>
    </>
  );
};
