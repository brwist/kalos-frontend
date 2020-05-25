import React, { FC, useState, useCallback, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { FilterForm } from '../Reports';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data, Columns } from '../InfoTable';
import { Modal } from '../Modal';
import { ServiceCall } from '../ServiceCall';
import {
  makeFakeRows,
  loadEventsByFilter,
  EventType,
  getPropertyAddress,
  getCustomerName,
  formatDate,
  EventsSort,
  getCFAppUrl,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

type Props = {
  filter?: FilterForm;
  onClose?: () => void;
  loggedUserId: number;
};

export const JobStatusReport: FC<Props> = ({
  filter: { status, startDate, endDate } = {},
  onClose,
  loggedUserId,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [entries, setEntries] = useState<EventType[]>([]);
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
    const { results, totalCount } = await loadEventsByFilter({
      page,
      filter: {
        logJobStatus: status,
        dateStarted: startDate,
        dateEnded: endDate,
      },
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
  ];
  const data: Data = loading
    ? makeFakeRows(5, 5)
    : entries.map(entry => {
        const {
          property,
          customer,
          logJobNumber,
          dateStarted,
          logJobStatus,
        } = entry;
        return [
          { value: getPropertyAddress(property) },
          { value: getCustomerName(customer, true) },
          { value: logJobNumber },
          { value: formatDate(dateStarted) },
          {
            value: logJobStatus,
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
  return (
    <>
      <SectionBar
        title="Job Status Report"
        actions={[
          { label: 'Export to Excel' },
          { label: 'Tasks' },
          { label: 'Print' },
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
      />
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
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
