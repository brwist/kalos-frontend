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
import { Alert } from '../Alert';
import {
  makeFakeRows,
  formatDate,
  TimesheetLineClientService,
} from '../../../helpers';
import { format, differenceInHours, parseISO } from 'date-fns';
import { ExportJSON } from '../ExportJSON';
import { ROWS_PER_PAGE } from '../../../constants';
import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import { differenceInMinutes } from 'date-fns/esm';

interface Props {
  loggedUserId: number;
  onClose?: () => void;
  dateStarted: string;
  dateEnded: string;
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
  'Time Started',
  'Time Finished',
  'Approver',
  'Class Code',
  'Job Number',
  'Description',
  'Notes',
  'Billable',
  'Processed',
];
const EXPORT_COLUMNS = [
  {
    label: 'Hours Worked',
    value: 'hoursWorked',
  },
  {
    label: 'Employee Name',
    value: 'employee',
  },
  {
    label: 'Id',
    value: 'employeeId',
  },
  {
    label: 'Time Started',
    value: 'timeStarted',
  },
  {
    label: 'Time Finished',
    value: 'timeFinished',
  },
  {
    label: 'Approver ID',
    value: 'adminApprovalUserId',
  },
  {
    label: 'Class Code ID',
    value: 'classCodeId',
  },
  {
    label: 'Class Code Description',
    value: 'classCodeDescription',
  },
  {
    label: 'Job Number',
    value: 'referenceNumber',
  },
  {
    label: 'Description',
    value: 'description',
  },
  {
    label: 'Notes',
    value: 'notes',
  },
  {
    label: 'Billable',
    value: 'billable',
  },
];
export const TimesheetValidationReport: FC<Props> = ({
  loggedUserId,
  dateStarted,
  dateEnded,
  onClose,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<TimesheetLine[]>([]);
  const [printEntries, setPrintEntries] = useState<TimesheetLine[]>([]);
  const [page, setPage] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [exportStatus, setExportStatus] = useState<Status>('idle');
  const [form, setForm] = useState<FilterForm>({
    dateStarted,
    dateEnded,
    isActive: false,
  });
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const load = useCallback(async () => {
    setLoading(true);
    console.log({ form });
    const timesheetReq = new TimesheetLine();
    timesheetReq.setIsActive(1);
    timesheetReq.setPageNumber(page);
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
  }, [setLoading, page, form]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [setLoaded, loaded, load]);
  const reload = useCallback(() => {
    setError('');
    setLoaded(false);
  }, [setLoaded]);

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
  const handleSearch = useCallback(() => {
    setPage(0);
    setLoaded(false);
  }, []);

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
  const handleExport = useCallback(async () => {
    setExportStatus('loading');
    await loadPrintEntries();
    setExportStatus('loaded');
  }, [loadPrintEntries, setExportStatus]);
  const handleExported = useCallback(
    () => setExportStatus('idle'),
    [setExportStatus],
  );
  const handleProcess = useCallback(async () => {
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
    setLoading(true);

    const results = await TimesheetLineClientService.BatchGet(timesheetReq);
    const ids = results
      .getResultsList()
      .filter(item => item.getPayrollProcessed() == false)
      .map(item => item.getId());

    await TimesheetLineClientService.Process(ids, loggedUserId);
  }, [form.dateStarted, form.dateEnded, loggedUserId]);

  const confirmProcess = async () => {
    const ok = confirm(`Are you sure you want ALL timesheets as Processed?`);
    if (ok) {
      setLoading(true);
      try {
        await handleProcess();
      } catch (err) {
        setError('Unable to process timesheets, please contact webtech');
      }
      reload();
    }
  };

  const getData = (entries: TimesheetLine[]): Data =>
    loading
      ? makeFakeRows(5, 5)
      : entries.map(entry => {
          const hours = (
            differenceInMinutes(
              new Date(parseISO(entry.getTimeFinished())),
              new Date(parseISO(entry.getTimeStarted())),
            ) / 60
          ).toFixed(2);
          const employee = entry.getTechnicianUserName();
          const timeStarted = entry.getTimeStarted();
          const timeFinished = entry.getTimeFinished();
          const approver = entry.getAdminApprovalUserName();
          const description = entry.getBriefDescription();
          const classCodeDescription = entry.getClassCode()?.getDescription();
          const jobNumber = entry.getReferenceNumber();
          const notes = entry.getNotes();
          const billable = entry.getClassCode()?.getBillable();
          const processed = entry.getPayrollProcessed();

          return [
            {
              value: hours,
            },
            {
              value: employee,
            },
            {
              value: formatDate(timeStarted),
            },
            {
              value: formatDate(timeFinished),
            },
            {
              value: approver,
            },
            {
              value: classCodeDescription,
            },
            {
              value: jobNumber,
            },
            {
              value: description,
            },
            {
              value: notes,
            },
            {
              value: billable === true ? 'Yes' : 'No',
            },
            {
              value: processed === true ? 'Yes' : 'No',
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
            <Alert open={error != ''} onClose={() => setError('')}></Alert>
            <Button
              label="Process All Timesheets"
              onClick={confirmProcess}
            ></Button>
            <ExportJSON
              json={printEntries.map(entry => ({
                hoursWorked: (
                  differenceInMinutes(
                    new Date(parseISO(entry.getTimeFinished())),
                    new Date(parseISO(entry.getTimeStarted())),
                  ) / 60
                ).toFixed(2),
                employee: entry.getTechnicianUserName(),
                employeeId: entry.getTechnicianUserId(),
                timeStarted: entry.getTimeStarted(),
                timeFinished: entry.getTimeFinished(),
                adminApprovalUserId: entry.getAdminApprovalUserId(),
                classCodeId: entry.getClassCodeId(),
                classCodeDescription: entry.getClassCode()?.getDescription(),
                referenceNumber: entry.getReferenceNumber(),
                description: entry.getBriefDescription(),
                notes: entry.getNotes(),
                billable: entry.getClassCode()?.getBillable() === true ? 1 : 0,
              }))}
              fields={EXPORT_COLUMNS}
              filename={`Timesheet_Validation_Report${format(
                new Date(),
                'yyyy-MM-dd hh:mm:ss',
              )}`}
              onExport={allPrintData ? undefined : handleExport}
              onExported={handleExported}
              status={exportStatus}
            />

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
