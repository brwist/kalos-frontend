import React, { FC, useCallback } from 'react';
import difference from 'lodash/difference';
import { format, addDays, getDay, getDaysInYear } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '../Tooltip';
import { PROJECT_TASK_PRIORITY_ICONS } from '../EditProject';
import { formatDate, formatTime } from '../../../helpers';
import { WEEK_DAYS, PROJECT_TASK_STATUS_COLORS } from '../../../constants';

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
  onAdd?: (startDate: string) => void;
}

const GAP = 1;

const useStyles = makeStyles(theme => ({
  calendar: ({ loading }: Style) => ({
    ...theme.typography.body1,
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridGap: GAP,
    backgroundColor: theme.palette.grey[300],
    borderWidth: GAP,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300],
    ...(loading
      ? {
          filter: 'grayscale(1)',
          pointerEvents: 'none',
        }
      : {}),
  }),
  day: {
    backgroundColor: theme.palette.common.white,
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(0.25),
    minHeight: 100,
  },
  weekDay: {
    padding: theme.spacing(),
    textAlign: 'right',
    backgroundColor: theme.palette.grey[100],
    textTransform: 'uppercase',
    position: 'sticky',
    top: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: theme.palette.grey[300],
    zIndex: 1,
  },
  dayDate: {
    textAlign: 'right',
    paddingRight: theme.spacing(),
    marginBottom: theme.spacing(0.5),
  },
  dayDateValue: {
    cursor: 'pointer',
  },
  event: {
    backgroundColor: theme.palette.grey[200],
    marginRight: -GAP,
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(0.25),
    minHeight: 20,
    position: 'relative',
    cursor: 'pointer',
  },
  hour: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(0.5),
    opacity: 0.5,
  },
  status: {
    marginTop: theme.spacing(-0.5),
    marginBottom: theme.spacing(-0.5),
    marginLeft: theme.spacing(-1),
    marginRight: theme.spacing(-1),
    padding: theme.spacing(),
  },
}));

export const CalendarEvents: FC<Props> = ({ events, loading, onAdd }) => {
  const classes = useStyles({ loading });
  const startDate = new Date('2020-01-01 00:00:00'); // FIXME
  const offset = getDay(startDate);
  const handleAddClick = useCallback(
    (startDate: string) => () => {
      if (onAdd) {
        onAdd(startDate);
      }
    },
    [onAdd],
  );
  let offsets: { [key: number]: number } = {};
  return (
    <div className={classes.calendar}>
      {[...Array(7)].map((_, idx) => (
        <div key={idx} className={classes.weekDay}>
          {WEEK_DAYS[idx]}
        </div>
      ))}
      {[...Array(getDaysInYear(2020) + offset + 1)].map((_, idx) => {
        const day = addDays(startDate, idx - offset);
        const date = format(day, 'yyyy-MM-dd');
        const weekDay = +format(day, 'i');
        Object.keys(offsets).forEach(id => {
          if (
            !events
              .filter(
                ({ startDate, endDate }) =>
                  startDate <= date && date <= endDate,
              )
              .map(({ id }) => id)
              .includes(+id)
          ) {
            delete offsets[+id];
          }
        });
        if (weekDay === 7) {
          offsets = Object.keys(offsets)
            .sort((a, b) => {
              const A = offsets[+a];
              const B = offsets[+b];
              if (A < B) return -1;
              if (A > B) return 1;
              return 0;
            })
            .reduce((aggr, id, idx) => ({ ...aggr, [id]: idx }), {});
        }
        return (
          <div key={idx} className={classes.day}>
            <div className={classes.dayDate}>
              <span
                className={classes.dayDateValue}
                onClick={handleAddClick(date)}
              >
                {format(day, 'd') === '1' && format(day, 'MMMM ')}
                {format(day, 'd')}
              </span>
            </div>
            {events
              .filter(
                ({ startDate, endDate }) =>
                  startDate <= date && date <= endDate,
              )
              .map(
                (
                  {
                    id,
                    notes,
                    startDate,
                    endDate,
                    startHour,
                    endHour,
                    status,
                    statusId,
                    statusColor,
                    priorityId,
                    priority,
                    assignee,
                    onClick,
                  },
                  idx,
                ) => {
                  const PriorityIcon = priorityId
                    ? PROJECT_TASK_PRIORITY_ICONS[priorityId]
                    : null;
                  if (startDate === date) {
                    const min = Math.min(
                      ...difference(
                        [...Array(100)].map((_, idx) => idx),
                        Object.values(offsets).sort(),
                      ),
                    );
                    offsets[id] = Object.keys(offsets).length ? min : 0;
                  }
                  const offset = offsets[id] || 0;
                  return (
                    <Tooltip
                      key={id}
                      content={
                        <div
                          className={classes.status}
                          style={{ backgroundColor: statusColor }}
                        >
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
                      }
                      placement="bottom"
                      maxWidth={300}
                    >
                      <div
                        className={classes.event}
                        style={{
                          ...(statusId
                            ? {
                                backgroundColor:
                                  PROJECT_TASK_STATUS_COLORS[statusId],
                              }
                            : {}),
                          ...(startDate === date ? { marginLeft: 4 } : {}),
                          ...(endDate === date ? { marginRight: 4 } : {}),
                          top: offset !== idx ? (offset - idx) * 30 : 0,
                        }}
                        onClick={onClick}
                      >
                        {(startDate === date || weekDay === 7) && (
                          <>
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
                            {notes}
                            {startDate === date && (
                              <div className={classes.hour}>
                                {formatTime(startHour, false)}
                              </div>
                            )}
                          </>
                        )}
                        {endDate === date && startDate !== endDate && (
                          <div className={classes.hour}>
                            ends {formatTime(endHour, false)}
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  );
                },
              )}
          </div>
        );
      })}
    </div>
  );
};
