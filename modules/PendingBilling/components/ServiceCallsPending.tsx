import React, { FC, useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Modal } from '../../ComponentsLibrary/Modal';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { ServiceCall } from '../../ComponentsLibrary/ServiceCall';
import { AddServiceCall } from '../../AddServiceCallGeneral/components/AddServiceCall';
import {
  getCFAppUrl,
  loadEventsByFilter,
  EventType,
  makeFakeRows,
  getBusinessName,
  getCustomerName,
  getPropertyAddress,
  formatDate,
  deleteEventById,
  EventsFilter,
  EventsSort,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

export interface Props {
  loggedUserId: number;
}

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: theme.spacing(),
  },
}));

export const ServiceCallsPending: FC<Props> = ({ loggedUserId }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [events, setEvents] = useState<EventType[]>([]);
  const [formKey, setFormKey] = useState<number>(0);
  const [pendingDelete, setPendingDelete] = useState<EventType>();
  const [pendingEdit, setPendingEdit] = useState<EventType>();
  const [pendingCreate, setPendingCreate] = useState<boolean>(false);
  const [filter, setFilter] = useState<EventsFilter>({});
  const [sort, setSort] = useState<EventsSort>({
    orderByField: 'logDateCompleted',
    orderBy: 'log_dateCompleted',
    orderDir: 'DESC',
  });
  const load = useCallback(async () => {
    setLoading(true);
    const { results, totalCount } = await loadEventsByFilter({
      page,
      filter,
      sort,
      pendingBilling: true,
    });
    setEvents(results);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading, setEvents, setCount, setLoading, filter, page, sort]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleFilterClear = useCallback(() => {
    setFilter({});
    setFormKey(formKey + 1);
    setLoaded(false);
  }, [setFilter, formKey, setFormKey, setLoaded]);
  const handleTogglePendingDelete = useCallback(
    (pendingDelete?: EventType) => () => setPendingDelete(pendingDelete),
    [],
  );
  const handleTogglePendingEdit = useCallback(
    (pendingEdit?: EventType) => () => setPendingEdit(pendingEdit),
    [],
  );
  const handleTogglePendingCreate = useCallback(
    (pendingCreate: boolean) => () => setPendingCreate(pendingCreate),
    [],
  );
  const handleDeleteServiceCall = useCallback(async () => {
    if (pendingDelete) {
      const { id } = pendingDelete;
      setPendingDelete(undefined);
      setLoading(true);
      await deleteEventById(id);
      load();
    }
  }, [pendingDelete, setLoading, setPendingDelete]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setLoaded, setPage],
  );
  const handleSortChange = useCallback(
    (sort: EventsSort) => () => {
      setSort(sort);
      setPage(0);
      setLoaded(false);
    },
    [setSort, setPage, setLoaded],
  );
  const handleSearch = useCallback(() => {
    setPage(0);
    setLoaded(false);
  }, [setPage, setLoaded]);
  const SCHEMA: Schema<EventsFilter> = [
    [
      {
        name: 'firstname',
        label: 'First Name',
        type: 'search',
      },
      {
        name: 'lastname',
        label: 'Last Name',
        type: 'search',
      },
      {
        name: 'businessname',
        label: 'Business Name',
        type: 'search',
      },
      {
        name: 'logJobNumber',
        label: 'Job #',
        type: 'search',
      },
    ],
    [
      {
        name: 'address',
        label: 'Address',
        type: 'search',
      },
      {
        name: 'city',
        label: 'City',
        type: 'search',
      },
      {
        name: 'zip',
        label: 'Zip Code',
        type: 'search',
      },
      {
        name: 'logDateCompleted',
        label: 'Date Completed',
        type: 'date',
        actions: [
          {
            label: 'Reset',
            variant: 'outlined',
            onClick: handleFilterClear,
          },
          {
            label: 'Search',
            onClick: handleSearch,
          },
        ],
      },
    ],
  ];
  const COLUMNS: Columns = [
    {
      name: 'Firstname/Lastname',
    },
    {
      name: 'Business Name',
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
        orderDir: sort.orderDir === 'ASC' ? 'DESC' : 'ASC',
      }),
    },
    {
      name: 'Date Completed',
      ...(sort.orderByField === 'logDateCompleted'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'logDateCompleted',
        orderBy: 'log_dateCompleted',
        orderDir: sort.orderDir === 'ASC' ? 'DESC' : 'ASC',
      }),
    },
    {
      name: 'Address',
    },
  ];
  const data: Data = loading
    ? makeFakeRows(5, 3)
    : events.map(event => {
        const { customer, property, logJobNumber, logDateCompleted } = event;
        return [
          { value: getCustomerName(customer) },
          { value: getBusinessName(customer) },
          { value: logJobNumber },
          { value: formatDate(logDateCompleted) },
          {
            value: getPropertyAddress(property),
            actions: [
              <IconButton key="edit" onClick={handleTogglePendingEdit(event)}>
                <EditIcon />
              </IconButton>,
              <IconButton
                key="delete"
                onClick={handleTogglePendingDelete(event)}
              >
                <DeleteIcon />
              </IconButton>,
            ],
          },
        ];
      });
  return (
    <>
      <SectionBar
        actions={[
          {
            label: 'New Service Call',
            onClick: handleTogglePendingCreate(true),
          },
          {
            label: 'Customers',
            url: getCFAppUrl('admin:customers.dashboard'),
          },
          {
            label: 'Properties',
            url: getCFAppUrl('admin:properties.list'),
          },
          {
            label: 'Contracts',
            url: getCFAppUrl('admin:contracts.dashboard'),
          },
          {
            label: 'Service Call Search',
            url: getCFAppUrl('admin:service.calls'),
          },
        ]}
        fixedActions
      />
      <SectionBar
        title="Pending Billing"
        pagination={{
          page,
          count,
          onChangePage: handlePageChange,
          rowsPerPage: ROWS_PER_PAGE,
        }}
      />
      <PlainForm
        key={formKey}
        schema={SCHEMA}
        data={filter}
        onChange={setFilter}
        compact
        className={classes.form}
      />
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
      {pendingDelete && (
        <ConfirmDelete
          open
          onConfirm={handleDeleteServiceCall}
          onClose={handleTogglePendingDelete(undefined)}
          kind="Service Call"
          name={`with Job Number ${pendingDelete.logJobNumber}`}
        />
      )}
      {pendingEdit && pendingEdit.property && pendingEdit.customer && (
        <Modal open onClose={handleTogglePendingEdit(undefined)} fullScreen>
          <ServiceCall
            loggedUserId={loggedUserId}
            propertyId={pendingEdit.property.id}
            userID={pendingEdit.customer.id}
            serviceCallId={pendingEdit.id}
            onClose={handleTogglePendingEdit(undefined)}
          />
        </Modal>
      )}
      {pendingCreate && (
        <Modal open onClose={handleTogglePendingCreate(false)} fullScreen>
          <AddServiceCall
            loggedUserId={loggedUserId}
            onClose={handleTogglePendingCreate(false)}
          />
        </Modal>
      )}
    </>
  );
};
