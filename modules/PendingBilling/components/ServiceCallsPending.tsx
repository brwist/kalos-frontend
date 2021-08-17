import React, { FC, useState, useCallback, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Modal } from '../../ComponentsLibrary/Modal';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { ServiceCall } from '../../ComponentsLibrary/ServiceCall';
import { getPropertyAddress } from '@kalos-core/kalos-rpc/Property';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event';
import { ENDPOINT } from '@kalos-core/kalos-rpc/constants';
import { AddServiceCall } from '../../AddServiceCallGeneral/components/AddServiceCall';
import {
  getCFAppUrl,
  loadEventsByFilter,
  makeFakeRows,
  formatDate,
  EventsFilter,
  EventsSort,
  cfURL,
  UserClientService,
  EventClientService,
} from '../../../helpers';
import { NULL_TIME, ROWS_PER_PAGE } from '../../../constants';
import './serviceCallsPending.less';

export interface Props {
  loggedUserId: number;
}

export const ServiceCallsPending: FC<Props> = ({ loggedUserId }) => {
  //window.location.href =
  //  'https://app.kalosflorida.com/index.cfm?action=admin:service.callsPending_old';
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [formKey, setFormKey] = useState<number>(0);
  const [pendingDelete, setPendingDelete] = useState<Event>();
  const [pendingEdit, setPendingEdit] = useState<Event>();
  const [pendingCreate, setPendingCreate] = useState<boolean>(false);
  const [filter, setFilter] = useState<EventsFilter>({});
  const [sort, setSort] = useState<EventsSort>({
    orderByField: 'getLogDateCompleted',
    orderBy: 'LogDatecompleted',
    orderDir: 'DESC',
  });
  const load = useCallback(async () => {
    setLoading(true);
    const tempFilter = filter;
    const req = new Event();
    req.setFieldMaskList(['LogDatecompleted']);
    const client = new EventClient(ENDPOINT);
    const results = await loadEventsByFilter({
      page,
      filter: tempFilter,
      sort,
      pendingBilling: true,
      req,
    });
    /*
    const { resultsList, totalCount } = await loadEventsByFilter({
      page,
      sort,
      filter: {
        ...filter,
        logDateCompleted: filter.logDateCompleted
          ? filter.logDateCompleted
          : NULL_TIME,
        notEqualsList: filter.logDateCompleted ? [] : ['LogDateCompleted'],
      },
      pendingBilling: true,
    });
    */
    setEvents(results.resultsList);
    setCount(results.totalCount);
    setLoading(false);
  }, [setEvents, setCount, setLoading, filter, page, sort]);
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
    (pendingDelete?: Event) => () => setPendingDelete(pendingDelete),
    [],
  );
  const handleTogglePendingEdit = useCallback(
    (pendingEdit?: Event) => () => setPendingEdit(pendingEdit),
    [],
  );
  const handleTogglePendingCreate = useCallback(
    (pendingCreate: boolean) => () => setPendingCreate(pendingCreate),
    [],
  );
  const handleDeleteServiceCall = useCallback(async () => {
    if (pendingDelete) {
      const id = pendingDelete;
      setPendingDelete(undefined);
      setLoading(true);
      await EventClientService.deleteEventById(id.getId());
      load();
    }
  }, [pendingDelete, setLoading, setPendingDelete, load]);
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
      ...(sort.orderByField === 'getLogJobNumber'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'getLogJobNumber',
        orderBy: 'log_jobNumber',
        orderDir: sort.orderDir === 'ASC' ? 'DESC' : 'ASC',
      }),
    },
    {
      name: 'Job Type-Subtype',
      ...(sort.orderByField === 'getJobType'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'getLogDateCompleted',
        orderBy: 'LogDatecompleted',
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
        const customer = event.getCustomer();
        const property = event.getProperty();
        const logJobNumber = event.getLogJobNumber();
        const jobType = `${event.getJobType()}-${event.getJobSubtype()}`;
        const openEditServiceCall = (event: Event) => {
          return () => {
            window.open(
              cfURL(
                'admin:service.editServiceCall',
                `&id=${event.getId()}&user_id=${event
                  .getProperty()
                  ?.getUserId()}&property_id=${event.getPropertyId()}`,
              ),
              '_blank',
            );
          };
        };
        return [
          {
            value: UserClientService.getCustomerName(customer!),
            onClick: openEditServiceCall(event),
          },
          {
            value: UserClientService.getBusinessName(customer!),
            onClick: openEditServiceCall(event),
          },
          {
            value: logJobNumber,
            onClick: openEditServiceCall(event),
          },
          {
            value: jobType,
            onClick: openEditServiceCall(event),
          },
          {
            value: getPropertyAddress(property),
            onClick: openEditServiceCall(event),
            actions: [
              <IconButton key="edit" onClick={openEditServiceCall(event)}>
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
          onPageChange: handlePageChange,
          rowsPerPage: ROWS_PER_PAGE,
        }}
      />
      <PlainForm
        key={formKey}
        schema={SCHEMA}
        data={filter}
        onChange={setFilter}
        compact
        className="ServiceCallsPendingForm"
      />
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
      {pendingDelete && (
        <ConfirmDelete
          open
          onConfirm={handleDeleteServiceCall}
          onClose={handleTogglePendingDelete(undefined)}
          kind="Service Call"
          name={`with Job Number ${pendingDelete.getLogJobNumber()}`}
        />
      )}
      {pendingEdit && pendingEdit.getProperty() && pendingEdit.getCustomer() && (
        <Modal open onClose={handleTogglePendingEdit(undefined)} fullScreen>
          <ServiceCall
            loggedUserId={loggedUserId}
            propertyId={pendingEdit.getProperty()!.getId()}
            userID={pendingEdit.getCustomer()!.getId()}
            serviceCallId={pendingEdit.getId()}
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
