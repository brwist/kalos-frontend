import React, { FC, useState, useCallback, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { PrintPage, Status } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintHeaderSubtitleItem } from '../PrintHeader';
import { PlainForm, Schema } from '../PlainForm';
import { Button } from '../Button';
import { getPropertyAddress } from '@kalos-core/kalos-rpc/Property';
import { ServiceCall } from '../ServiceCall';
import { Modal } from '../Modal';
import {
  makeFakeRows,
  formatDate,
  UserClientService,
  loadEventsByFilterDeleted,
  TimesheetLineClientService,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';
import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';

interface Props {
  loggedUserId: number;
  onClose?: () => void;
  dateStarted: string;
  dateEnded: string;
  businessname?: string;
  lastname?: string;
}

type FilterForm = {
  businessname?: string;
  lastname?: string;
  dateStarted: string;
  dateEnded: string;
  isActive?: boolean;
};

const COLUMNS = [
  'Hours Worked',
  'Employee',
  'Employee ID',
  'Time Started',
  'Time Finished',
  'Approver',
  'Approver ID',
  'Class Code ID',
  'Class Code',
  'Job Number',
  'Description',
  'Notes',
  'Billable',
];

export const TimesheetValidationReport: FC<Props> = ({
  loggedUserId,
  dateStarted,
  dateEnded,
  businessname,
  lastname,
  onClose,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<TimesheetLine[]>([]);
  const [printEntries, setPrintEntries] = useState<TimesheetLine[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [form, setForm] = useState<FilterForm>({
    dateStarted,
    dateEnded,
    businessname,
    lastname,
    isActive: false,
  });
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [pendingEdit, setPendingEdit] = useState<Event>();
  const load = useCallback(async () => {
    setLoading(true);
    console.log({ form });
    const timesheetReq = new TimesheetLine();
    timesheetReq.setIsActive(1);
    timesheetReq.setDateTargetList(['time_started', 'time_started']);
    timesheetReq.setDateRangeList([
      '>=',
      form.dateStarted,
      '<',
      form.dateEnded,
    ]);
    timesheetReq.setNotEqualsList(['AdminApprovalUserId']);
    timesheetReq.setAdminApprovalUserId(0);
    const results = await TimesheetLineClientService.BatchGet(timesheetReq);
    setEntries(results.getResultsList());
    console.log({ results });
    setCount(results.getTotalCount());
    setLoading(false);
  }, [setLoading, form]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [setLoaded, loaded, load]);
  const reload = useCallback(() => setLoaded(false), [setLoaded]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      reload();
    },
    [setPage, reload],
  );
  const loadPrintEntries = useCallback(async () => {
    if (printEntries.length === count) return;
    const timesheetReq = new TimesheetLine();
    timesheetReq.setIsActive(1);
    timesheetReq.setWithoutLimit(true);
    timesheetReq.setDateTargetList(['time_started', 'time_started']);
    timesheetReq.setDateRangeList([
      '>=',
      form.dateStarted,
      '<',
      form.dateEnded,
    ]);
    timesheetReq.setNotEqualsList(['AdminApprovalUserId']);
    timesheetReq.setAdminApprovalUserId(0);
    const results = await TimesheetLineClientService.BatchGet(timesheetReq);
    setPrintEntries(results.getResultsList());
  }, [setPrintEntries, form, printEntries, count]);
  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    await loadPrintEntries();
    setPrintStatus('loaded');
  }, [loadPrintEntries, setPrintStatus]);
  const handlePrinted = useCallback(
    () => setPrintStatus('idle'),
    [setPrintStatus],
  );
  const handleSearch = useCallback(() => setLoaded(false), []);

  const SCHEMA: Schema<FilterForm> = [
    [
      {
        name: 'dateStarted',
        label: 'Start Date',
        type: 'date',
      },
      {
        name: 'dateEnded',
        label: 'End Date',
        type: 'date',
        actions: [{ label: 'Search', onClick: handleSearch }],
      },
    ],
  ];

  const getData = (entries: TimesheetLine[]): Data =>
    loading
      ? makeFakeRows(5, 5)
      : entries.map(entry => {
          const hours = entry.getHoursWorked();
          const employee = entry.getTechnicianUserName();
          const employeeId = entry.getTechnicianUserId();
          const dateStarted = entry.getTimeStarted();
          const dateFinished = entry.getTimeFinished();
          const approver = entry.getAdminApprovalUserName();
          const classCodeId = entry.getClassCodeId();
          const classCodeDescription = entry.getClassCode()?.getDescription();
          const jobNumber = entry.getReferenceNumber();
          const notes = entry.getNotes();
          const billable = entry.getClassCode()?.getBillable();
          return [
            {
              value: hours,
            },
            {
              value: employee,
            },
            { value: employeeId },
            {
              value: formatDate(dateStarted),
            },
            {
              value: formatDate(dateFinished),
            },
            {
              value: approver,
            },
            {
              value: classCodeId,
            },
            {
              value: classCodeDescription,
            },
            {
              value: jobNumber,
            },
            {
              value: notes,
            },
            {
              value: billable === true ? 'Yes' : 'No',
            },
          ];
        });
  const allPrintData = entries.length === count;
  const printHeaderSubtitle = (
    <>
      {dateStarted && (
        <PrintHeaderSubtitleItem label="Start date" value={dateStarted} />
      )}
      {dateEnded && (
        <PrintHeaderSubtitleItem label="End date" value={dateEnded} />
      )}
    </>
  );
  return (
    <div>
      <SectionBar
        title="Timesheet Validation Report"
        pagination={{
          page,
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: handlePageChange,
        }}
        asideContent={
          <>
            <PrintPage
              headerProps={{
                title: 'Timesheet Validation Report',
                subtitle: printHeaderSubtitle,
              }}
              onPrint={allPrintData ? undefined : handlePrint}
              onPrinted={handlePrinted}
              status={printStatus}
            >
              <PrintTable
                columns={COLUMNS}
                data={getData(allPrintData ? entries : printEntries).map(row =>
                  row.map(({ value }) => value),
                )}
              />
            </PrintPage>
            {onClose && <Button label="Close" onClick={onClose} />}
          </>
        }
      />
      <PlainForm schema={SCHEMA} data={form} onChange={setForm} />
      <InfoTable
        columns={COLUMNS.map(name => ({ name }))}
        data={getData(entries)}
        loading={loading}
        skipPreLine
      />
    </div>
  );
};
