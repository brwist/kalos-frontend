import React, {
  FC,
  useCallback,
  useState,
  useEffect,
  createRef,
  RefObject,
  ReactElement,
} from 'react';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import { format, addDays, getDay, differenceInDays, parseISO } from 'date-fns';
import { PROJECT_TASK_PRIORITY_ICONS } from '../EditProject';
import { formatDate, formatTime, loadProjects } from '../../../helpers';
import './styles.less';

export type CalendarEvent = {
  id: number;
  startDate: string;
  startHour?: string;
  endDate: string;
  endHour?: string;
  notes: string;
  status?: string;
  statusColor?: string;
  priority?: string;
  priorityId?: number;
  assignee?: string;
  onClick?: () => void;
  renderDetails?: ReactElement;
  label?: string;
  subtitle?: string;
};

type Style = {
  loading?: boolean;
};

export interface Props extends Style {
  events: CalendarEvent[];
  startDate: string;
  endDate: string;
  onAdd?: (startDate: string) => void;
  withLabels?: boolean;
  macro?: boolean; // Loads all of the projects into it, meant for an overview
  loggedUserId: number;
}

export const GanttChart: FC<Props> = ({
  events,
  loading,
  startDate: dateStart,
  endDate: dateEnd,
  onAdd,
  withLabels = false,
  loggedUserId,
  macro,
}) => {
  const [uncollapsed, setUncollapsed] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [heights, setHeights] = useState<{ [key: number]: number }>({});
  const [elRefs, setElRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const startDate = parseISO(`${dateStart}T00:00:00`);
  const endDate = parseISO(`${dateEnd}T00:00:00`);
  const totalDays = differenceInDays(endDate, startDate);
  const offsetStart = getDay(startDate);
  const offsetEnd = 6 - getDay(endDate);
  const [arrLength, setArrLength] = useState<number>(events.length);
  const [projects, setProjects] = useState<CalendarEvent[] | undefined>();
  const [loaded, setLoaded] = useState<boolean>();
  const loadProjectsMacro = useCallback(async () => {
    setLoaded(false);
    try {
      const projects = await loadProjects();
      setArrLength(projects.length);
      setProjects(
        projects.map(project => {
          return {
            ...project,
            startDate: project.dateStarted,
            endDate: project.dateEnded,
          } as CalendarEvent;
        }),
      );
      setElRefs(elRefs =>
        [...Array(projects.length)].map((_, i) => elRefs[i] || createRef()),
      );
    } catch (err) {
      console.error(
        `An error occurred while getting projects for the Macro Gantt Chart: ${err}`,
      );
      setLoaded(true);
    }
    setLoaded(true);
  }, [setElRefs, setProjects, setArrLength, setLoaded]);

  useEffect(() => {
    if (macro) {
      loadProjectsMacro();
    } else {
      // setElRefs requires a valid array length which cannot be known when it's a macro chart on start time, so
      // this else will be used when it's not macro, otherwise this same call will happen in loadProjectsMacro
      setLoaded(true);
      setElRefs(elRefs =>
        [...Array(arrLength)].map((_, i) => elRefs[i] || createRef()),
      );
    }
  }, [arrLength, loadProjectsMacro, macro, setLoaded]);
  const handleAddClick = useCallback(
    (startDate: string) => () => {
      if (onAdd) {
        onAdd(startDate);
      }
    },
    [onAdd],
  );
  const handleToggleCollapse = useCallback(
    (id: number, idx: number) => () => {
      setUncollapsed({ ...uncollapsed, [id]: !uncollapsed[id] });
      if (elRefs[idx] && elRefs[idx].current !== null) {
        //@ts-ignore
        const height = elRefs[idx].current.getBoundingClientRect().height;
        setHeights({ ...heights, [id]: height });
      }
    },
    [setUncollapsed, uncollapsed, elRefs, setHeights, heights],
  );
  const handleToggleCollapsed = useCallback(
    () => setCollapsed(!collapsed),
    [setCollapsed, collapsed],
  );
  return (
    <div className={clsx('GanttChart', { loading })}>
      <div className={clsx('GanttChartAside', { collapsed })}>
        {loaded && (
          <>
            {(projects ? projects : events).map(
              (
                {
                  id,
                  notes,
                  priorityId,
                  assignee,
                  startDate,
                  endDate,
                  startHour,
                  endHour,
                  priority,
                  status,
                  renderDetails,
                  subtitle,
                },
                idx,
              ) => {
                const PriorityIcon = priorityId
                  ? PROJECT_TASK_PRIORITY_ICONS[priorityId]
                  : null;
                return (
                  <div
                    key={id}
                    className="GanttChartAsideRow"
                    onClick={handleToggleCollapse(id, idx)}
                  >
                    <div className="GanttChartAsideRowTitle">
                      {uncollapsed[id] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                      {PriorityIcon && (
                        <PriorityIcon
                          style={{
                            fontSize: 16,
                            marginRight: 4,
                            verticalAlign: 'middle',
                            display: 'inline-flex',
                          }}
                        />
                      )}
                      <div
                        className={clsx('GanttChartAsideRowDesc', { subtitle })}
                      >
                        {subtitle && (
                          <div className="GanttChartAsideRowSubtitle">
                            {subtitle}
                          </div>
                        )}
                        {notes}
                      </div>
                    </div>
                    <div
                      style={{
                        overflow: 'hidden',
                        height: uncollapsed[id] ? 'auto' : 0,
                      }}
                    >
                      <div ref={elRefs[idx]}>
                        {renderDetails || (
                          <>
                            {assignee && (
                              <div>
                                <strong>Assigned Employee: </strong>
                                {assignee}
                              </div>
                            )}
                            <div>
                              <strong>Brief Description: </strong>
                              {notes}
                            </div>
                            <div>
                              <strong>Start Date: </strong>
                              {formatDate(startDate)}{' '}
                              {startHour && formatTime(startHour)}
                            </div>
                            <div>
                              <strong>End Date: </strong>
                              {formatDate(endDate)}{' '}
                              {endHour && formatTime(endHour)}
                            </div>
                            {status && (
                              <div>
                                <strong>Status: </strong>
                                {status}
                              </div>
                            )}
                            {priority && (
                              <div>
                                <strong>Priority: </strong>
                                {PriorityIcon && (
                                  <PriorityIcon
                                    style={{
                                      fontSize: 16,
                                      marginRight: 4,
                                      verticalAlign: 'middle',
                                      display: 'inline-flex',
                                    }}
                                  />
                                )}
                                {priority}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </>
        )}
      </div>
      <div className="GanttChartGantt">
        <div className="GanttChartGanttRow">
          {[...Array(totalDays + offsetStart + offsetEnd + 1)].map((_, idx) => {
            const day = addDays(startDate, idx - offsetStart);
            const date = format(day, 'yyyy-MM-dd');
            const weekDay = +format(day, 'i');
            return (
              <div
                key={idx}
                className={clsx(
                  'GanttChartDay',
                  'GanttChartWeekDay',
                  weekDay >= 6 ? 'GanttChartWeekendDay' : '',
                )}
                onClick={handleAddClick(date)}
              >
                {format(day, 'MMMM yyyy')}
              </div>
            );
          })}
        </div>
        <div className="GanttChartGanttRow">
          {[...Array(totalDays + offsetStart + offsetEnd + 1)].map((_, idx) => {
            const day = addDays(startDate, idx - offsetStart);
            const date = format(day, 'yyyy-MM-dd');
            const weekDay = +format(day, 'i');
            return (
              <div
                key={idx}
                className={clsx(
                  'GanttChartDay',
                  'GanttChartWeekDay',
                  weekDay >= 6 ? 'GanttChartWeekendDay' : '',
                )}
                onClick={handleAddClick(date)}
              >
                {format(day, 'iiii, d')}
              </div>
            );
          })}
        </div>
        {(projects ? projects : events).map(
          ({
            id,
            startDate: dateStart,
            endDate: dateEnd,
            statusColor,
            startHour,
            endHour,
            onClick,
            label,
            notes,
          }) => (
            <div key={id} className="GanttChartGanttRow">
              {[...Array(totalDays + offsetStart + offsetEnd + 1)].map(
                (_, idx) => {
                  const day = addDays(startDate, idx - offsetStart);
                  const date = format(day, 'yyyy-MM-dd');

                  const weekDay = +format(day, 'i');
                  return (
                    <div
                      key={idx}
                      className={clsx(
                        'GanttChartDay',
                        weekDay >= 6 ? 'GanttChartWeekendDay' : '',
                      )}
                    >
                      {dateStart <= date && date <= dateEnd && (
                        <div
                          className="GanttChartEvent"
                          style={{
                            backgroundColor: statusColor,
                            color: '#000',
                            ...(dateStart === date ? { marginLeft: 4 } : {}),
                            ...(dateEnd === date ? { marginRight: 4 } : {}),
                            cursor: onClick ? 'pointer' : 'default',
                            marginBottom: uncollapsed[id] ? heights[id] - 4 : 0,
                          }}
                          onClick={onClick}
                          title={
                            notes +
                            ` (${format(
                              new Date(dateStart),
                              'yyyy-MM-dd',
                            )} - ${format(new Date(dateEnd), 'yyyy-MM-dd')})`
                          }
                        >
                          <div
                            className={clsx('GanttChartHour', { withLabels })}
                          >
                            {dateStart === date &&
                              startHour &&
                              formatTime(startHour, false)}
                            {dateStart === date && withLabels && label}
                          </div>
                          {dateEnd === date && endHour && (
                            <div className="GanttChartHour">
                              ends {formatTime(endHour, false)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          ),
        )}
      </div>
      <IconButton
        className="GanttChartToggle"
        size="small"
        onClick={handleToggleCollapsed}
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </div>
  );
};
