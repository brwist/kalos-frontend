import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
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
import {
  makeFakeRows,
  loadEventsByFilter,
  EventType,
  getPropertyAddress,
  getCustomerName,
  formatDate,
  EventsSort,
  getCFAppUrl,
  EventsFilter,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

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
  const [entries, setEntries] = useState<EventType[]>([]);
  const [printEntries, setPrintEntries] = useState<EventType[]>([]);
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [sort, setSort] = useState<EventsSort>({
    orderBy: 'date_started',
    orderByField: 'dateStarted',
    orderDir: 'DESC',
  });
  const [pendingEdit, setPendingEdit] = useState<EventType>();
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
    const { results, totalCount } = await loadEventsByFilter({
      page,
      filter,
      sort,
    });
    setEntries(results);
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
    (sort: EventsSort) => () => {
      setSort(sort);
      setPage(0);
      reload();
    },
    [setSort, reload],
  );
  const handlePendingEditToggle = useCallback(
    (pendingEdit?: EventType) => () => setPendingEdit(pendingEdit),
    [setPendingEdit],
  );
  const handleOpenTasks = useCallback(
    (entry: EventType) => () => {
      window.open(
        [
          getCFAppUrl('admin:tasks.list'),
          'code=servicecall',
          `id=${entry.id}`,
        ].join('&'),
      );
    },
    [],
  );
  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    const { results } = await loadEventsByFilter({
      page: -1,
      filter: {
        logJobStatus: status,
        dateStarted: startDate, // TODO: use dateRangeList
        dateEnded: endDate,
      },
      sort,
    });
    setPrintEntries(results);
    setPrintStatus('loaded');
  }, [setPrintEntries, status, startDate, endDate, sort, setPrintStatus]);
  const COLUMNS: Columns = [
    {
      name: 'Property',
      ...(sort.orderByField === 'address'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'address',
        orderBy: 'property_address',
        orderDir:
          sort.orderByField === 'address' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
    {
      name: 'Customer Name',
      ...(sort.orderByField === 'lastname'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'lastname',
        orderBy: 'user_lastname', // FIXME: RPC doesn't sort properly
        orderDir:
          sort.orderByField === 'lastname' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
    {
      name: 'Job #',
      ...(sort.orderByField === 'logJobNumber'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'logJobNumber',
        orderBy: 'log_jobNumber',
        orderDir:
          sort.orderByField === 'logJobNumber' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
    {
      name: 'Date',
      ...(sort.orderByField === 'dateStarted'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'dateStarted',
        orderBy: 'date_started',
        orderDir:
          sort.orderByField === 'dateStarted' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
    ...(kind === 'jobStatus'
      ? [
          {
            name: 'Job Status',
            ...(sort.orderByField === 'logJobStatus'
              ? {
                  dir: sort.orderDir,
                }
              : {}),
            onClick: handleSortChange({
              orderByField: 'logJobStatus',
              orderBy: 'log_jobStatus', // FIXME: RPC doesn't sort properly
              orderDir:
                sort.orderByField === 'logJobStatus' && sort.orderDir === 'ASC'
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
            ...(sort.orderByField === 'logPaymentStatus'
              ? {
                  dir: sort.orderDir,
                }
              : {}),
            onClick: handleSortChange({
              orderByField: 'logPaymentStatus',
              orderBy: 'log_paymentStatus', // FIXME: RPC doesn't sort properly
              orderDir:
                sort.orderByField === 'logPaymentStatus' &&
                sort.orderDir === 'ASC'
                  ? 'DESC'
                  : 'ASC',
            }),
          },
        ]
      : []),
  ];
  const getData = (entries: EventType[]): Data =>
    loading
      ? makeFakeRows(5, 5)
      : entries.map(entry => {
          const {
            property,
            customer,
            logJobNumber,
            dateStarted,
            logJobStatus,
            logPaymentStatus,
          } = entry;
          return [
            { value: getPropertyAddress(property) },
            { value: getCustomerName(customer, true) },
            { value: logJobNumber },
            { value: formatDate(dateStarted) },
            {
              value: kind === 'jobStatus' ? logJobStatus : logPaymentStatus,
              actions: [
                <IconButton
                  key="edit"
                  size="small"
                  onClick={handlePendingEditToggle(entry)}
                >
                  <EditIcon />
                </IconButton>,
                <IconButton
                  key="tasks"
                  size="small"
                  onClick={handleOpenTasks(entry)}
                >
                  <AssignmentIcon />
                </IconButton>,
              ],
            },
          ];
        });
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
      <SectionBar
        title={title}
        actions={[
          { label: 'Export to Excel' },
          { label: 'Tasks' },
          ...(onClose
            ? [
                {
                  label: 'Close',
                  onClick: onClose,
                },
              ]
            : []),
        ]}
        pagination={{
          page,
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handlePageChange,
        }}
        asideContent={
          <PrintPage
            headerProps={{
              title: 'Job Status Report',
              subtitle: printHeaderSubtitle,
            }}
            onPrint={allPrintData ? undefined : handlePrint}
            status={printStatus}
          >
            <PrintTable
              columns={[
                'Property',
                'Customer Name',
                'Job #',
                'Date',
                { title: 'Job Status', align: 'right' },
              ]}
              data={getData(allPrintData ? entries : printEntries).map(row =>
                row.map(({ value }) => value),
              )}
            />
          </PrintPage>
        }
      />
      <InfoTable columns={COLUMNS} data={getData(entries)} loading={loading} />
      {pendingEdit && pendingEdit.property && pendingEdit.customer && (
        <Modal open onClose={handlePendingEditToggle(undefined)} fullScreen>
          <ServiceCall
            loggedUserId={loggedUserId}
            onClose={handlePendingEditToggle(undefined)}
            propertyId={pendingEdit.property.id}
            userID={pendingEdit.customer.id}
            serviceCallId={pendingEdit.id}
            onSave={reload}
          />
        </Modal>
      )}
    </>
  );
};
