import React, { FC, useState, useCallback, useEffect } from 'react';
import { startOfMonth, lastDayOfMonth, format } from 'date-fns';
import compact from 'lodash/compact';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema } from '../PlainForm';
import { Tabs } from '../Tabs';
import { CalendarEvents } from '../CalendarEvents';
import { GanttChart } from '../GanttChart';
import { EditProject } from '../EditProject';
import { Modal } from '../Modal';
import { Loader } from '../../Loader/main';
import { AddServiceCall } from '../../AddServiceCallGeneral/components/AddServiceCall';
import {
  loadEventsByFilter,
  EventType,
  formatDate,
  UserType,
  UserClientService,
} from '../../../helpers';
import { getPropertyAddress } from '@kalos-core/kalos-rpc/Property';

export interface Props {
  loggedUserId: number;
  startDate?: string;
  endDate?: string;
  onClose?: () => void;
}

type Filter = {
  dateStarted: string;
  dateEnded: string;
  logJobNumber: string;
  departmentId: number;
};

export const Projects: FC<Props> = ({
  loggedUserId,
  startDate,
  endDate,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadingInit, setLoadingInit] = useState<boolean>(false);
  const [loadedInit, setLoadedInit] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<UserType>();
  const [pendingNew, setPendingNew] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);
  const [filter, setFilter] = useState<Filter>({
    dateStarted: startDate || format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    dateEnded: endDate || format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'),
    logJobNumber: '',
    departmentId: 0,
  });
  const [filterKey, setFilterKey] = useState<number>(0);
  const [search, setSearch] = useState<Filter>(filter);
  const [events, setEvents] = useState<EventType[]>([]);
  const [openedEvent, setOpenedEvent] = useState<EventType>();
  const loadInit = useCallback(async () => {
    setLoadingInit(true);
    const loggedInUser = await UserClientService.loadUserById(loggedUserId);
    const newFilter = {
      ...filter,
      departmentId: loggedInUser.employeeDepartmentId,
    };
    setFilter(newFilter);
    setSearch(newFilter);
    setFilterKey(filterKey + 1);
    setLoggedInUser(loggedInUser);
    setLoadingInit(false);
    setLoadedInit(true);
  }, [
    loggedUserId,
    setLoadingInit,
    setLoggedInUser,
    filter,
    setFilter,
    filterKey,
    setFilterKey,
    setSearch,
    setLoadedInit,
  ]);
  const load = useCallback(async () => {
    setLoading(true);
    setSearch(filter);
    const { dateStarted, dateEnded, departmentId, logJobNumber } = filter;
    const { resultsList } = await loadEventsByFilter({
      page: -1,
      filter: {
        dateStarted,
        dateEnded,
        logJobNumber,
        departmentId,
      },
      sort: {
        orderBy: 'date_started',
        orderByField: 'dateStarted',
        orderDir: 'ASC',
      },
    });
    setEvents(resultsList);
    setLoading(false);
  }, [filter, setLoading, setEvents, setSearch]);
  useEffect(() => {
    if (!loadedInit) {
      loadInit();
    }
    if (loadedInit && !loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load, loadedInit, setLoadedInit, loadInit]);
  const handleSearch = useCallback(() => setLoaded(false), [setLoaded]);
  const handleOpenEvent = useCallback(
    (openedEvent?: EventType) => () => {
      setOpenedEvent(openedEvent);
      if (!openedEvent) load();
    },
    [setOpenedEvent, load],
  );
  const handleTogglePendingNew = useCallback(
    (pendingNew: boolean) => () => setPendingNew(pendingNew),
    [setPendingNew],
  );
  const handleSaveNewProject = useCallback(() => {
    setPendingNew(false);
    setLoaded(false);
  }, [setPendingNew, setLoaded]);
  const SCHEMA_FILTER: Schema<Filter> = [
    [
      {
        name: 'dateStarted',
        type: 'date',
        label: 'Start Date',
      },
      {
        name: 'dateEnded',
        type: 'date',
        label: 'End Date',
      },
      {
        name: 'logJobNumber',
        type: 'search',
        label: 'Job #',
      },
      {
        name: 'departmentId',
        type: 'department',
        label: 'Department',
        actions: [
          {
            label: 'Search',
            onClick: handleSearch,
          },
        ],
      },
    ],
  ];
  const { dateStarted, dateEnded } = search;
  return (
    <div>
      <SectionBar
        title="Projects"
        sticky={false}
        actions={[
          {
            label: 'Add Project',
            onClick: handleTogglePendingNew(true),
          },
          ...(onClose
            ? [
                {
                  label: 'Close',
                  onClick: onClose,
                },
              ]
            : []),
        ]}
        fixedActions
      />
      <PlainForm
        key={filterKey}
        schema={SCHEMA_FILTER}
        data={filter}
        onChange={setFilter}
      />
      <Tabs
        defaultOpenIdx={tab}
        tabs={[
          {
            label: 'Calendar',
            content: (
              <CalendarEvents
                events={events.map(event => {
                  const {
                    id,
                    logJobNumber,
                    description,
                    dateStarted: dateStart,
                    dateEnded: dateEnd,
                    property,
                    departmentId,
                    isActive,
                  } = event;
                  const [startDate] = dateStart.split(' ');
                  const [endDate] = dateEnd.split(' ');
                  return {
                    id,
                    startDate,
                    endDate,
                    isActive,
                    notes: description,
                    onClick: handleOpenEvent(event),
                    label: compact([
                      logJobNumber,
                      getPropertyAddress(property),
                    ]).join(', '),
                    renderTooltip: (
                      <div className="ProjectsTooltip">
                        <div>
                          <strong>Address: </strong>
                          {getPropertyAddress(property)}
                        </div>
                        <div>
                          <strong>Start Date: </strong>
                          {formatDate(dateStart)}
                        </div>
                        <div>
                          <strong>End Date: </strong>
                          {formatDate(dateEnd)}
                        </div>
                        <div>
                          <strong>Job Number: </strong>
                          {logJobNumber}
                        </div>
                        <div>
                          <strong>Description: </strong>
                          {description}
                        </div>
                        <div>
                          <strong>Department: </strong>
                          {departmentId} {/* TODO: show department */}
                        </div>
                      </div>
                    ),
                  };
                })}
                startDate={dateStarted.substr(0, 10)}
                endDate={dateEnded.substr(0, 10)}
                loading={loading || loadingInit}
                withLabels
              />
            ),
          },
          {
            label: 'Gantt Chart',
            content: (
              <GanttChart
                events={events.map(event => {
                  const {
                    id,
                    logJobNumber,
                    description,
                    dateStarted: dateStart,
                    dateEnded: dateEnd,
                    property,
                    departmentId,
                    isActive,
                  } = event;
                  const [startDate] = dateStart.split(' ');
                  const [endDate] = dateEnd.split(' ');
                  return {
                    id,
                    startDate,
                    endDate,
                    isActive,
                    notes: description,
                    onClick: handleOpenEvent(event),
                    label: logJobNumber,
                    subtitle: getPropertyAddress(property),
                    renderDetails: (
                      <div>
                        <div>
                          <strong>Address: </strong>
                          {getPropertyAddress(property)}
                        </div>
                        <div>
                          <strong>Start Date: </strong>
                          {formatDate(dateStart)}
                        </div>
                        <div>
                          <strong>End Date: </strong>
                          {formatDate(dateEnd)}
                        </div>
                        <div>
                          <strong>Job Number: </strong>
                          {logJobNumber}
                        </div>
                        <div>
                          <strong>Description: </strong>
                          {description}
                        </div>
                        <div>
                          <strong>Department: </strong>
                          {departmentId} {/* TODO: show department */}
                        </div>
                      </div>
                    ),
                  };
                })}
                startDate={dateStarted.substr(0, 10)}
                endDate={dateEnded.substr(0, 10)}
                loading={loading || loadingInit}
                loggedUserId={loggedUserId}
                withLabels
              />
            ),
          },
        ]}
        onChange={setTab}
      />
      {(loading || loadingInit) && <Loader zIndex={1200} />}
      {openedEvent && (
        <Modal open onClose={handleOpenEvent()} fullScreen>
          <EditProject
            serviceCallId={openedEvent.id}
            loggedUserId={loggedUserId}
            onClose={handleOpenEvent()}
          />
        </Modal>
      )}
      {pendingNew && (
        <Modal open onClose={handleTogglePendingNew(false)} fullScreen>
          <AddServiceCall
            loggedUserId={loggedUserId}
            onClose={handleTogglePendingNew(false)}
            onSave={handleSaveNewProject}
            asProject
          />
        </Modal>
      )}
    </div>
  );
};
