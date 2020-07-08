import React, { FC } from 'react';
import { format, addDays, getDay, getDaysInYear } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { formatTime } from '../../../helpers';
import { WEEK_DAYS } from '../../../constants';

export type CalendarEvent = {
  startDate: string;
  startHour: string;
  endDate: string;
  endHour: string;
  notes: string;
  status?: number;
  priority?: number;
};

interface Props {
  events: CalendarEvent[];
}

const GAP = 1;

const useStyles = makeStyles(theme => ({
  calendar: {
    ...theme.typography.body1,
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridGap: GAP,
    backgroundColor: theme.palette.grey[300],
    borderWidth: GAP,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300],
  },
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
    backgroundColor: '#1562a1',
    marginRight: -GAP,
    color: '#FFF',
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(0.25),
    minHeight: 20,
    position: 'relative',
  },
  hour: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(0.5),
    opacity: 0.5,
  },
}));

export const CalendarEvents: FC<Props> = ({ events }) => {
  const classes = useStyles();
  const startDate = new Date('2020-01-01 00:00:00');
  const offset = getDay(startDate);
  console.log({ events });
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
              .map(({ startDate, endDate, notes, startHour, endHour }, idx) => (
                <div
                  key={idx}
                  className={classes.event}
                  style={{
                    ...(startDate === date ? { marginLeft: 4 } : {}),
                    ...(endDate === date ? { marginRight: 4 } : {}),
                  }}
                >
                  {startDate === date && notes}
                  {startDate === date && (
                    <div className={classes.hour}>
                      {formatTime(startHour, false)}
                    </div>
                  )}
                  {endDate === date && startDate !== endDate && (
                    <div className={classes.hour}>
                      ends {formatTime(endHour, false)}
                    </div>
                  )}
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
};
