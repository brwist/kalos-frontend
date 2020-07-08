import React, { FC } from 'react';
import HighestIcon from '@material-ui/icons/Block';
import { format, addDays, getDay, getDaysInYear } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '../Tooltip';
import { PROJECT_TASK_PRIORITY_ICONS } from '../EditProject';
import { formatDate, formatTime } from '../../../helpers';
import { WEEK_DAYS, PROJECT_TASK_STATUS_COLORS } from '../../../constants';

export type CalendarEvent = {
  startDate: string;
  startHour: string;
  endDate: string;
  endHour: string;
  notes: string;
  status?: string;
  statusId?: number;
  priority?: string;
  priorityId?: number;
  onClick?: () => void;
};

type Style = {
  loading?: boolean;
};

interface Props extends Style {
  events: CalendarEvent[];
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
    paddingBottom: theme.spacing(),
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
}));

export const CalendarEvents: FC<Props> = ({ events, loading }) => {
  const classes = useStyles({ loading });
  const startDate = new Date('2020-01-01 00:00:00'); // FIXME
  const offset = getDay(startDate);
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
        return (
          <div key={idx} className={classes.day}>
            <div className={classes.dayDate}>
              {format(day, 'd') === '1' && format(day, 'MMMM ')}
              {format(day, 'd')}
            </div>
            {events
              .filter(
                ({ startDate, endDate }) =>
                  startDate <= date && date <= endDate,
              )
              .map(
                (
                  {
                    notes,
                    startDate,
                    endDate,
                    startHour,
                    endHour,
                    status,
                    statusId,
                    priorityId,
                    priority,
                    onClick,
                  },
                  idx,
                ) => {
                  const PriorityIcon = priorityId
                    ? PROJECT_TASK_PRIORITY_ICONS[priorityId]
                    : null;
                  return (
                    <Tooltip
                      key={idx}
                      content={
                        <>
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
                        </>
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
                        }}
                        onClick={onClick}
                      >
                        {startDate === date && (
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
                            <div className={classes.hour}>
                              {formatTime(startHour, false)}
                            </div>
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
