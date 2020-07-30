import React, { FC, useState, useCallback, useEffect } from 'react';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema } from '../PlainForm';
import { Tabs } from '../Tabs';
import { CalendarEvents } from '../CalendarEvents';
import { GanttChart } from '../GanttChart';
import { EditProject } from '../EditProject';
import { Modal } from '../Modal';
import { loadEventsByFilter, EventType } from '../../../helpers';
import './styles.less';

export interface Props {
  loggedUserId: number;
}

type Filter = {
  dateStarted: string;
  dateEnded: string;
  departmentId: number;
};

export const Projects: FC<Props> = ({ loggedUserId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);
  const [filter, setFilter] = useState<Filter>({
    dateStarted: '2020-07-01',
    dateEnded: '2020-07-31',
    departmentId: 0,
  });
  const [events, setEvents] = useState<EventType[]>([]);
  const [openedEvent, setOpenedEvent] = useState<EventType>();
  const load = useCallback(async () => {
    setLoading(true);
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
  }, [filter, setLoading, setEvents]);
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
  const { dateStarted, dateEnded } = filter;
  return (
    <div>
      <SectionBar title="Projects" />
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
                  } = event;
                  const [startDate, startHour] = dateStart.split(' ');
                  const [endDate, endHour] = dateEnd.split(' ');
                  return {
                    id,
                    startDate,
                    endDate,
                    startHour,
                    endHour,
                    notes: [logJobNumber, description].join(', '),
                    onClick: handleOpenEvent(event),
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
                  } = event;
                  const [startDate, startHour] = dateStart.split(' ');
                  const [endDate, endHour] = dateEnd.split(' ');
                  return {
                    id,
                    startDate,
                    endDate,
                    startHour,
                    endHour,
                    notes: [logJobNumber, description].join(', '),
                    onClick: handleOpenEvent(event),
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
