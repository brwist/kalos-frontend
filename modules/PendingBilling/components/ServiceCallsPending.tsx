import React, { FC, useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Modal } from '../../ComponentsLibrary/Modal';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { PlainForm, Schema, Option } from '../../ComponentsLibrary/PlainForm';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { ServiceCall } from '../../ComponentsLibrary/ServiceCall';
import {
  getCFAppUrl,
  loadEventsByFilter,
  EventType,
  makeFakeRows,
  getBusinessName,
  getCustomerName,
  getPropertyAddress,
  formatDate,
  makeOptions,
  timestamp,
  deleteServiceCallById,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

export interface Props {
  loggedUserId: number;
}

type SearchForm = {
  searchBy: string;
  searchPhrase: string;
};

const FIELDS: Option[] = makeOptions([
  'Lastname',
  'Business Name',
  'Job Number',
  'Date Completed',
  'Address',
  'City',
  'Zip Code',
]);

const COLUMNS: Columns = [
  { name: 'Customer Name' },
  { name: 'Business Name' },
  { name: 'Job #' },
  { name: 'Date Completed' },
  { name: 'Address' },
];

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
  const searchBy = FIELDS[0].value as string;
  const [formKey, setFormKey] = useState<number>(0);
  const [pendingDelete, setPendingDelete] = useState<EventType>();
  const [pendingEdit, setPendingEdit] = useState<EventType>();
  const [filter, setFilter] = useState<SearchForm>({
    searchBy,
    searchPhrase: searchBy.includes('Date') ? timestamp(true) : '',
  });
  const load = useCallback(async () => {
    setLoading(true);
    const { searchBy, searchPhrase } = filter;
    const { results, totalCount } = await loadEventsByFilter({
      page,
      searchBy,
      searchPhrase,
    });
    setEvents(results);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading, setEvents, setCount, setLoading, filter]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleFormChange = useCallback(
    (data: SearchForm) => {
      const isSearchByChanged = data.searchBy !== filter.searchBy;
      const searchBy = FIELDS[0].value as string;
      const criteria = {
        ...data,
        ...(isSearchByChanged
          ? {
              searchPhrase: data.searchBy.includes('Date')
                ? timestamp(true)
                : '',
            }
          : {}),
      };
      setFilter(criteria);
      if (isSearchByChanged) {
        setFormKey(formKey + 1);
      }
    },
    [setFilter, filter, formKey, setFormKey],
  );
  const handleTogglePendingDelete = useCallback(
    (pendingDelete?: EventType) => () => setPendingDelete(pendingDelete),
    [],
  );
  const handleTogglePendingEdit = useCallback(
    (pendingEdit?: EventType) => () => setPendingEdit(pendingEdit),
    [],
  );
  const handleDeleteServiceCall = useCallback(async () => {
    if (pendingDelete) {
      const { id } = pendingDelete;
      setPendingDelete(undefined);
      setLoading(true);
      await deleteServiceCallById(id);
      load();
    }
  }, [pendingDelete, setLoading, setPendingDelete]);
  const SCHEMA: Schema<SearchForm> = [
    [
      { name: 'searchBy', label: 'Search By', options: FIELDS },
      {
        name: 'searchPhrase',
        label: 'Search Phrase',
        type: filter.searchBy.includes('Date') ? 'date' : 'search',
        actions: [{ label: 'Search', onClick: load }],
      },
    ],
  ];
  const data: Data = loading
    ? makeFakeRows(5, 3)
    : events.map(event => {
        const { customer, property, logJobNumber, dateEnded } = event;
        return [
          { value: getCustomerName(customer) },
          { value: getBusinessName(customer) },
          { value: logJobNumber },
          { value: formatDate(dateEnded) },
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
            url: getCFAppUrl('admin:service.addServiceCallGeneral'),
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
          onChangePage: setPage,
          rowsPerPage: ROWS_PER_PAGE,
        }}
      />
      <PlainForm
        key={formKey}
        schema={SCHEMA}
        data={filter}
        onChange={handleFormChange}
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
    </>
  );
};
