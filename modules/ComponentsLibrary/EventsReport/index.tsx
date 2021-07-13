import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { FilterForm } from '../Reports';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data, Columns } from '../InfoTable';
import { Modal } from '../Modal';
import { ServiceCall } from '../ServiceCall';
import { PrintPage, Status } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintHeaderSubtitleItem } from '../PrintHeader';
import { ExportJSON } from '../ExportJSON';
import { Button } from '../Button';
import { getPropertyAddress } from '@kalos-core/kalos-rpc/Property';
import {
  makeFakeRows,
  loadEventsByFilter,
  formatDate,
  UserClientService,
  EventsSort,
  getCFAppUrl,
  EventsFilter,
  getCurrDate,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { Tasks } from '../Tasks';

type Props = {
  kind: 'jobStatus' | 'paymentStatus';
  filter?: FilterForm;
  onClose?: () => void;
  loggedUserId: number;
};

export const EventsReport: FC<Props> = ({
  kind,
  filter: { status, startDate, endDate } = {},
  onClose,
  loggedUserId,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [entries, setEntries] = useState<Event[]>([]);
  const [printEntries, setPrintEntries] = useState<Event[]>([]);
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [exportStatus, setExportStatus] = useState<Status>('idle');
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [sort, setSort] = useState<EventsSort>({
    orderBy: 'date_started',
    orderByField: 'getDateStarted',
    orderDir: 'DESC',
  });
  const [pendingEdit, setPendingEdit] = useState<Event>();
  const [tasksOpenEvent, setTasksOpenEvent] = useState<Event | undefined>(
    undefined,
  );
  const handleSetTasksOpenEvent = useCallback(
    (event: Event | undefined) => setTasksOpenEvent(event),
    [setTasksOpenEvent],
  );
  const load = useCallback(async () => {
    setLoading(true);
    const filter: EventsFilter = {
      dateStarted: startDate, // TODO: use dateRangeList
      dateEnded: endDate,
    };
    if (kind === 'jobStatus') {
      filter.logJobStatus = status;
    }
    if (kind === 'paymentStatus') {
      filter.logPaymentStatus = status;
    }
    const { resultsList, totalCount } = await loadEventsByFilter({
      page,
      filter,
      sort,
      req: new Event(),
    });
    setEntries(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [
    setLoading,
    page,
    setEntries,
    setCount,
    status,
    startDate,
    endDate,
    sort,
    kind,
  ]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const reload = useCallback(() => setLoaded(false), [setLoaded]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      reload();
    },
    [setPage, reload],
  );
  const handleSortChange = useCallback(
    (sort: EventsSort) => {
      setSort(sort);
      setPage(0);
      reload();
    },
    [setSort, reload],
  );
  const handlePendingEditToggle = useCallback(
    (pendingEdit?: Event) => setPendingEdit(pendingEdit),
    [setPendingEdit],
  );
  const handleOpenTasks = useCallback(
    (entry: Event) => {
      handleSetTasksOpenEvent(entry);
      // ? Keeping this around in case we need to revert
      //  Replace with react Tasks module, once it's built
      // window.open(
      //   [
      //     getCFAppUrl('admin:tasks.list'),
      //     'code=servicecall',
      //     `id=${entry.getId()}`,
      //   ].join('&'),
      // );
    },
    [handleSetTasksOpenEvent],
  );
  const loadPrintEntries = useCallback(async () => {
    if (printEntries.length === count) return;
    const filter: EventsFilter = {
      logJobStatus: status,
      dateStarted: startDate, // TODO: use dateRangeList
      dateEnded: endDate,
    };
    if (kind === 'jobStatus') {
      filter.logJobStatus = status;
    }
    if (kind === 'paymentStatus') {
      filter.logPaymentStatus = status;
    }
    const { resultsList } = await loadEventsByFilter({
      page: -1,
      filter,
      sort,
      req: new Event(),
    });
    setPrintEntries(resultsList);
  }, [status, startDate, endDate, sort, kind, printEntries, count]);
  const handleExport = useCallback(async () => {
    setExportStatus('loading');
    await loadPrintEntries();
    setExportStatus('loaded');
  }, [loadPrintEntries, setExportStatus]);
  const handleExported = useCallback(
    () => setExportStatus('idle'),
    [setExportStatus],
  );
  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    await loadPrintEntries();
    setPrintStatus('loaded');
  }, [loadPrintEntries, setPrintStatus]);
  const handlePrinted = useCallback(
    () => setPrintStatus('idle'),
    [setPrintStatus],
  );
  const COLUMNS: Columns = [
    {
      name: 'Property',
      ...(sort.orderByField === 'getAddress'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: () =>
        handleSortChange({
          orderByField: 'getAddress',
          orderBy: 'property_address',
          orderDir:
            sort.orderByField === 'getAddress' && sort.orderDir === 'ASC'
              ? 'DESC'
              : 'ASC',
        }),
    },
    {
      name: 'Customer Name',
      ...(sort.orderByField === 'getLastname'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: () =>
        handleSortChange({
          orderByField: 'getLastname',
          orderBy: 'user_lastname',
          orderDir:
            sort.orderByField === 'getLastname' && sort.orderDir === 'ASC'
              ? 'DESC'
              : 'ASC',
        }),
    },
    {
      name: 'Job #',
      ...(sort.orderByField === 'getLogJobNumber'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: () =>
        handleSortChange({
          orderByField: 'getLogJobNumber',
          orderBy: 'log_jobNumber',
          orderDir:
            sort.orderByField === 'getLogJobNumber' && sort.orderDir === 'ASC'
              ? 'DESC'
              : 'ASC',
        }),
    },
    {
      name: 'Date',
      ...(sort.orderByField === 'getDateStarted'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: () =>
        handleSortChange({
          orderByField: 'getDateStarted',
          orderBy: 'date_started',
          orderDir:
            sort.orderByField === 'getDateStarted' && sort.orderDir === 'ASC'
              ? 'DESC'
              : 'ASC',
        }),
    },
    ...(kind === 'jobStatus'
      ? [
          {
            name: 'Job Status',
            ...(sort.orderByField === 'getLogJobStatus'
              ? {
                  dir: sort.orderDir,
                }
              : {}),
            onClick: () =>
              handleSortChange({
                orderByField: 'getLogJobStatus',
                orderBy: 'log_jobStatus', // FIXME: RPC doesn't sort properly
                orderDir:
                  sort.orderByField === 'getLogJobStatus' &&
                  sort.orderDir === 'ASC'
                    ? 'DESC'
                    : 'ASC',
              }),
          },
        ]
      : []),
    ...(kind === 'paymentStatus'
      ? [
          {
            name: 'Payment Status',
            ...(sort.orderByField === 'getLogPaymentStatus'
              ? {
                  dir: sort.orderDir,
                }
              : {}),
            onClick: () =>
              handleSortChange({
                orderByField: 'getLogPaymentStatus',
                orderBy: 'getLog_paymentStatus', // FIXME: RPC doesn't sort properly
                orderDir:
                  sort.orderByField === 'getLogPaymentStatus' &&
                  sort.orderDir === 'ASC'
                    ? 'DESC'
                    : 'ASC',
              }),
          },
        ]
      : []),
  ];
  const getData = (entries: Event[]): Data =>
    loading
      ? makeFakeRows(5, 5)
      : entries.map(entry => {
          return [
            {
              value: getPropertyAddress(entry.getProperty()),
              onClick: () => handlePendingEditToggle(entry),
            },
            {
              value: UserClientService.getCustomerName(
                entry.getCustomer()!,
                true,
              ),
              onClick: () => handlePendingEditToggle(entry),
            },
            {
              value: entry.getLogJobNumber(),
              onClick: () => handlePendingEditToggle(entry),
            },
            {
              value: formatDate(entry.getDateStarted()),
              onClick: () => handlePendingEditToggle(entry),
            },
            {
              value:
                kind === 'jobStatus'
                  ? entry.getLogJobStatus()
                  : entry.getLogPaymentStatus(),
              onClick: () => handlePendingEditToggle(entry),
              actions: [
                <IconButton
                  key="edit"
                  size="small"
                  onClick={() => handlePendingEditToggle(entry)}
                >
                  <EditIcon />
                </IconButton>,
                <IconButton
                  key="tasks"
                  size="small"
                  onClick={() => handleOpenTasks(entry)}
                >
                  <AssignmentIcon />
                </IconButton>,
              ],
            },
          ];
        });
  const EXPORT_COLUMNS = [
    { label: 'Property', value: 'property' },
    { label: 'Customer', value: 'customer' },
    { label: 'Job #', value: 'jobNumber' },
    { label: 'Date', value: 'date' },
    {
      label: kind === 'jobStatus' ? 'Job Status' : 'Payment Status',
      value: 'status',
    },
  ];
  const allPrintData = entries.length === count;
  const title = useMemo(() => {
    if (kind === 'jobStatus') return 'Job Status Report';
    if (kind === 'paymentStatus') return 'Billing Status Report';
    return '';
  }, [kind]);
  const printHeaderSubtitle = (
    <>
      {status && <PrintHeaderSubtitleItem label="Status" value={status} />}
      {startDate && (
        <PrintHeaderSubtitleItem label="Start date" value={startDate} />
      )}
      {endDate && <PrintHeaderSubtitleItem label="End date" value={endDate} />}
    </>
  );
  return (
    <>
      {tasksOpenEvent && (
        <Modal
          key={tasksOpenEvent.toString()}
          open={true}
          onClose={() => handleSetTasksOpenEvent(undefined)}
        >
          <>
            <SectionBar
              actions={[
                {
                  label: 'CLOSE ',
                  onClick: () => handleSetTasksOpenEvent(undefined),
                },
              ]}
            />
            <Tasks
              loggedUserId={loggedUserId}
              externalCode="servicecalls"
              externalId={Number(tasksOpenEvent.getLogTechnicianAssigned())}
            />
          </>
        </Modal>
      )}
      <SectionBar
        title={title}
        // actions={[{ label: 'Tasks', onClick: () => handleOpenTasks(entry) }]}
        // TODO integrate the new Tasks with events report
        pagination={{
          page,
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: handlePageChange,
        }}
        asideContent={
          <>
            <ExportJSON
              json={(allPrintData ? entries : printEntries).map(data => ({
                property: getPropertyAddress(data.getProperty()),
                customer: UserClientService.getCustomerName(
                  data.getCustomer()!,
                ),
                jobNumber: data.getLogJobNumber(),
                date: formatDate(data.getDateStarted()),
                status:
                  kind === 'jobStatus'
                    ? data.getLogJobStatus()
                    : data.getLogPaymentStatus(),
              }))}
              fields={EXPORT_COLUMNS}
              filename={`${
                kind === 'jobStatus' ? 'Job' : 'Billing'
              }_Status_Report_${getCurrDate()}`}
              onExport={allPrintData ? undefined : handleExport}
              onExported={handleExported}
              status={exportStatus}
            />
            <PrintPage
              headerProps={{
                title: `${
                  kind === 'jobStatus' ? 'Job' : 'Billing'
                } Status Report`,
                subtitle: printHeaderSubtitle,
              }}
              onPrint={allPrintData ? undefined : handlePrint}
              onPrinted={handlePrinted}
              status={printStatus}
            >
              <PrintTable
                columns={[
                  'Property',
                  'Customer Name',
                  'Job #',
                  'Date',
                  {
                    title:
                      kind === 'jobStatus' ? 'Job Status' : 'Payment Status',
                    align: 'right',
                  },
                ]}
                data={getData(allPrintData ? entries : printEntries).map(row =>
                  row.map(({ value }) => value),
                )}
              />
            </PrintPage>
            {onClose && <Button label="Close" onClick={onClose} />}
          </>
        }
      />
      <InfoTable columns={COLUMNS} data={getData(entries)} loading={loading} />
      {pendingEdit && pendingEdit.getProperty() && pendingEdit.getCustomer() && (
        <Modal
          open
          onClose={() => handlePendingEditToggle(undefined)}
          fullScreen
        >
          <ServiceCall
            loggedUserId={loggedUserId}
            onClose={() => handlePendingEditToggle(undefined)}
            propertyId={pendingEdit.getProperty()!.getId()}
            userID={pendingEdit.getCustomer()!.getId()}
            serviceCallId={pendingEdit.getId()}
            onSave={reload}
          />
        </Modal>
      )}
    </>
  );
};
