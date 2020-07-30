import React, { FC, useState, useCallback, useEffect } from 'react';
import { startOfMonth, lastDayOfMonth, format } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema } from '../PlainForm';
import { Tabs } from '../Tabs';
import { CalendarEvents } from '../CalendarEvents';
import { GanttChart } from '../GanttChart';
import { EditProject } from '../EditProject';
import { Modal } from '../Modal';
import { Loader } from '../../Loader/main';
import {
  loadEventsByFilter,
  EventType,
  getPropertyAddress,
  formatDate,
} from '../../../helpers';
import './styles.less';

export interface Props {
  loggedUserId: number;
  startDate?: string;
  endDate?: string;
  onClose?: () => void;
}

type Filter = {
  dateStarted: string;
  dateEnded: string;
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
  const [tab, setTab] = useState<number>(0);
  const [filter, setFilter] = useState<Filter>({
    dateStarted: startDate || format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    dateEnded: endDate || format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'),
    departmentId: 0,
  });
  const [search, setSearch] = useState<Filter>(filter);
  const [events, setEvents] = useState<EventType[]>([]);
  const [openedEvent, setOpenedEvent] = useState<EventType>();
  const load = useCallback(async () => {
    setLoading(true);
    setSearch(filter);
    const { dateStarted, dateEnded, departmentId } = filter;
    const { results } = await loadEventsByFilter({
      page: -1,
      filter: {
        dateStarted,
        dateEnded,
        departmentId,
      },
      sort: {
        orderBy: 'date_started',
        orderByField: 'dateStarted',
        orderDir: 'ASC',
      },
    });
    setEvents(results);
    setLoading(false);
  }, [filter, setLoading, setEvents, setSearch]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleSearch = useCallback(() => setLoaded(false), [setLoaded]);
  const handleOpenEvent = useCallback(
    (openedEvent?: EventType) => () => setOpenedEvent(openedEvent),
    [setOpenedEvent],
  );
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
        actions={onClose ? [{ label: 'Close', onClick: onClose }] : undefined}
        fixedActions
      />
      <PlainForm schema={SCHEMA_FILTER} data={filter} onChange={setFilter} />
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
                  } = event;
                  const [startDate] = dateStart.split(' ');
                  const [endDate] = dateEnd.split(' ');
                  return {
                    id,
                    startDate,
                    endDate,
                    notes: [logJobNumber, description].join(', '),
                    onClick: handleOpenEvent(event),
                    renderTooltip: (
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
                loading={loading}
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
                  } = event;
                  const [startDate] = dateStart.split(' ');
                  const [endDate] = dateEnd.split(' ');
                  return {
                    id,
                    startDate,
                    endDate,
                    notes: [logJobNumber, description].join(', '),
                    onClick: handleOpenEvent(event),
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
                loading={loading}
              />
            ),
          },
        ]}
        onChange={setTab}
      />
      {loading && <Loader zIndex={1200} />}
      {openedEvent && (
        <Modal open onClose={handleOpenEvent()} fullScreen>
          <EditProject
            serviceCallId={openedEvent.id}
            loggedUserId={loggedUserId}
            onClose={handleOpenEvent()}
          />
        </Modal>
      )}
    </div>
  );
};
