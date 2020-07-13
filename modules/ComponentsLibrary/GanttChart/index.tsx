import React, {
  FC,
  useCallback,
  useState,
  useEffect,
  createRef,
  RefObject,
} from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { format, addDays, getDay, differenceInDays } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { PROJECT_TASK_PRIORITY_ICONS } from '../EditProject';
import { formatDate, formatTime } from '../../../helpers';

export type CalendarEvent = {
  id: number;
  startDate: string;
  startHour: string;
  endDate: string;
  endHour: string;
  notes: string;
  status?: string;
  statusColor?: string;
  statusId?: number;
  priority?: string;
  priorityId?: number;
  assignee?: string;
  onClick?: () => void;
};

type Style = {
  loading?: boolean;
};

interface Props extends Style {
  events: CalendarEvent[];
  startDate: string;
  endDate: string;
  onAdd?: (startDate: string) => void;
}

const GAP = 1;

const useStyles = makeStyles(theme => ({
  wrapper: {
    ...theme.typography.body1,
    display: 'flex',
    alignItems: 'flex-start',
  },
  aside: {
    width: 250,
    flexShrink: 0,
    borderRight: `1px solid ${theme.palette.grey[200]}`,
    paddingTop: 58,
    backgroundColor: theme.palette.grey[100],
  },
  asideRow: {
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    backgroundColor: theme.palette.grey[300],
    minHeight: 28,
    padding: theme.spacing(0.5),
    display: 'flex',
    justifyItems: 'center',
    flexDirection: 'column',
    wordBreak: 'break-word',
  },
  asideRowTitle: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    cursor: 'pointer',
  },
  asideRowDesc: {
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  gantt: {
    flexGrow: 1,
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingBottom: theme.spacing(2),
  },
  ganttRow: {
    display: 'flex',
  },
  day: {
    fontSize: 12,
    backgroundColor: theme.palette.common.white,
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    width: 150,
    borderLeft: `1px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    flexShrink: 0,
  },
  weekendDay: {
    backgroundColor: theme.palette.grey[50],
  },
  weekDay: {
    cursor: 'pointer',
    textAlign: 'center',
    backgroundColor: theme.palette.grey[100],
  },
  event: {
    backgroundColor: theme.palette.grey[200],
    marginLeft: -GAP,
    padding: theme.spacing(0.5),
    height: 20,
    display: 'flex',
    justifyContent: 'space-between',
  },
  hour: {
    opacity: 0.5,
  },
}));

export const GanttChart: FC<Props> = ({
  events,
  loading,
  startDate: dateStart,
  endDate: dateEnd,
  onAdd,
}) => {
  const classes = useStyles({ loading });
  const [uncollapsed, setUncollapsed] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [heights, setHeights] = useState<{ [key: number]: number }>({});
  const [elRefs, setElRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const startDate = new Date(`${dateStart}T00:00:00`);
  const endDate = new Date(`${dateEnd}T00:00:00`);
  const totalDays = differenceInDays(endDate, startDate);
  const offsetStart = getDay(startDate);
  const offsetEnd = 6 - getDay(endDate);
  const arrLength = events.length;
  useEffect(
    () =>
      setElRefs(elRefs =>
        [...Array(arrLength)].map((_, i) => elRefs[i] || createRef()),
      ),
    [arrLength],
  );
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
  return (
    <div className={classes.wrapper}>
      <div className={classes.aside}>
        {events.map(
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
            },
            idx,
          ) => {
            const PriorityIcon = priorityId
              ? PROJECT_TASK_PRIORITY_ICONS[priorityId]
              : null;
            return (
              <div
                key={id}
                className={classes.asideRow}
                onClick={handleToggleCollapse(id, idx)}
              >
                <div className={classes.asideRowTitle}>
                  {uncollapsed[id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
                  <div className={classes.asideRowDesc}>{notes}</div>
                </div>
                <div
                  style={{
                    overflow: 'hidden',
                    height: uncollapsed[id] ? 'auto' : 0,
                  }}
                >
                  <div ref={elRefs[idx]}>
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
                      {formatDate(startDate)} {formatTime(startHour)}
                    </div>
                    <div>
                      <strong>End Date: </strong>
                      {formatDate(endDate)} {formatTime(endHour)}
                    </div>
                    <div>
                      <strong>Status: </strong>
                      {status}
                    </div>
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
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
      <div className={classes.gantt}>
        <div className={classes.ganttRow}>
          {[...Array(totalDays + offsetStart + offsetEnd + 1)].map((_, idx) => {
            const day = addDays(startDate, idx - offsetStart);
            const date = format(day, 'yyyy-MM-dd');
            const weekDay = +format(day, 'i');
            return (
              <div
                key={idx}
                className={
                  classes.day +
                  ' ' +
                  classes.weekDay +
                  ' ' +
                  (weekDay >= 6 ? classes.weekendDay : '')
                }
                onClick={handleAddClick(date)}
              >
                {format(day, 'MMMM yyyy')}
              </div>
            );
          })}
        </div>
        <div className={classes.ganttRow}>
          {[...Array(totalDays + offsetStart + offsetEnd + 1)].map((_, idx) => {
            const day = addDays(startDate, idx - offsetStart);
            const date = format(day, 'yyyy-MM-dd');
            const weekDay = +format(day, 'i');
            return (
              <div
                key={idx}
                className={
                  classes.day +
                  ' ' +
                  classes.weekDay +
                  ' ' +
                  (weekDay >= 6 ? classes.weekendDay : '')
                }
                onClick={handleAddClick(date)}
              >
                {format(day, 'iiii, d')}
              </div>
            );
          })}
        </div>
        {events.map(
          ({
            id,
            startDate: dateStart,
            endDate: dateEnd,
            statusColor,
            startHour,
            endHour,
            onClick,
          }) => (
            <div key={id} className={classes.ganttRow}>
              {[...Array(totalDays + offsetStart + offsetEnd + 1)].map(
                (_, idx) => {
                  const day = addDays(startDate, idx - offsetStart);
                  const date = format(day, 'yyyy-MM-dd');
                  const weekDay = +format(day, 'i');
                  return (
                    <div
                      key={idx}
                      className={
                        classes.day +
                        ' ' +
                        (weekDay >= 6 ? classes.weekendDay : '')
                      }
                    >
                      {dateStart <= date && date <= dateEnd && (
                        <div
                          className={classes.event}
                          style={{
                            backgroundColor: statusColor,
                            ...(dateStart === date ? { marginLeft: 4 } : {}),
                            ...(dateEnd === date ? { marginRight: 4 } : {}),
                            cursor: onClick ? 'pointer' : 'default',
                            marginBottom: uncollapsed[id] ? heights[id] - 4 : 0,
                          }}
                          onClick={onClick}
                        >
                          <div className={classes.hour}>
                            {dateStart === date && formatTime(startHour, false)}
                          </div>
                          {dateEnd === date && (
                            <div className={classes.hour}>
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
    </div>
  );
};
