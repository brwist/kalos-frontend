import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import { Typography } from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import { format } from 'date-fns';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  EventClientService,
  EventType,
  PerDiemClientService,
  PerDiemType,
  TimesheetLineClientService,
  TransactionClientService,
  TransactionType,
  usd,
} from '../../../../helpers';
import { Loader } from '../../../Loader/main';
import { InfoTable } from '../../InfoTable';
import { SectionBar } from '../../SectionBar';

export interface Props {
  serviceCallId: number;
}

export const BillingTab: FC<Props> = ({ serviceCallId }) => {
  const sizeOfText: Variant = 'subtitle1';

  const [event, setEvent] = useState<EventType>();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetLine.AsObject[]>();
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
    setTotalTransactions(
      transactions.reduce((aggr, { amount }) => aggr + amount, 0),
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
        (await TimesheetLineClientService.BatchGet(req))
          .getResultsList()
          .map(line => line.toObject()),
      );
    } catch (err) {
      console.error(
        'Error occurred while loading the timesheet lines for the cost report. Error: ',
        err,
      );
    }
  }, [setTimesheets]);

  const calculateTotalHoursWorked = useCallback(() => {
    let total = 0;
    timesheets?.forEach(timesheet => (total = total + timesheet.hoursWorked));
    setTotalHoursWorked(total);
  }, [timesheets, setTotalHoursWorked]);

  const load = useCallback(() => {
    loadEvent();
    loadTimesheets();
    calculateTotalHoursWorked();
    loadPrintData();
  }, []);

  useEffect(() => {
    load();
  }, []);

  return loadingEvent ? (
    <Loader />
  ) : (
    <>
      <SectionBar title="Project Details" />
      <Typography variant={sizeOfText}>
        {event?.property ? `Address: ${event.property.address}` : ''}
      </Typography>
      <Typography variant={sizeOfText}>
        {event?.dateStarted
          ? `Start Date: ${format(new Date(event.dateStarted), 'yyyy-MM-dd')}`
          : ''}
      </Typography>
      <Typography variant={sizeOfText}>
        {event?.dateEnded
          ? `End Date: ${format(new Date(event.dateEnded), 'yyyy-MM-dd')}`
          : ''}
      </Typography>
      <Typography variant={sizeOfText}>
        {event?.logJobNumber ? `Job Number: ${event.logJobNumber}` : ''}
      </Typography>

      <SectionBar title="Summary Info" />
      <InfoTable
        columns={[
          { name: 'Type', align: 'left' },
          { name: 'Total', align: 'right' },
        ]}
        data={[
          [
            {
              value: `Total Hours Worked: ${
                totalHoursWorked
                  ? totalHoursWorked > 1
                    ? `${totalHoursWorked} hrs`
                    : totalHoursWorked == 0
                    ? 'None'
                    : `${totalHoursWorked} hr`
                  : ''
              }`,
            },
          ],
        ]}
      />

      <SectionBar title="Costs" />
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
    </>
  );
};
