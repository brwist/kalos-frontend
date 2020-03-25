import React, { useState, useCallback, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBack';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useCalendarData } from '../hooks';
import CallCard from './CallCard';
import { colorsMapping } from '../constants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dayView: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      background: 'white',
      height: '100%',
      overflow: 'auto',
      boxSizing: 'border-box',
      padding: '16px',
      transition: 'width 1500ms',
      zIndex: 10000,
    },
    dateHeading: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: theme.palette.grey['200'],
      margin: `${theme.spacing(1)}px 0`,
      padding: theme.spacing(1),
      textAlign: 'center',
    },
    dayViewHeading: {
      flex: '1 0 auto',
    },
    dayCircle: {
      width: '24px',
      height: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '12px',
      boxShadow: 'inset 0 2px 3px rgba(0, 0, 0, .25)',
      color: '#666',
      fontSize: '12px',
    },
    dayViewButton: {
      visibility: 'hidden',
      '&.visible': {
        visibility: 'visible',
      },
    },
    completedButton: {
      width: '100%',
      background: colorsMapping.Completed,
      fontSize: '0.75rem',
      lineHeight: 1.2,
      '&:hover': {
        background: '#88ed86',
      }
    },
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(-180deg)',
    },
  }),
);

type Props = {
  date: string;
  viewBy: 'day' | 'week' | 'month';
  userId: number;
  isAdmin: number;
};

const Column = ({ date, viewBy, userId, isAdmin}: Props) => {
  const classes = useStyles();
  const [showCompleted, setShowCompleted] = useState(false);
  const [dayView, setDayView] = useState(false);
  useLayoutEffect(() => {
    document.body.style.overflow = dayView ? 'hidden' : 'visible';
  }, [dayView]);
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const { fetchingCalendarData, datesMap, filters } = useCalendarData();
  const dateObj = new Date(date);

  const filterCalls = useCallback(calendarDay => {
    const { customers, zip, propertyUse, jobType, jobSubType } = filters;
    return Object.keys(calendarDay).reduce((acc, key) => {
      let calls = calendarDay[key];
      acc[key] = calls.filter(call => {
        if (!isAdmin && call.logTechnicianAssigned) {
          const techIds = call.logTechnicianAssigned.split(',').map(Number);
          if (!techIds.includes(userId)) {
            return false;
          }
        }
        if (customers.length && !customers.includes(`${call?.customer?.id}`)) {
          return false;
        }
        if (zip.length && !zip.includes(call?.property?.zip)) {
          return false;
        }
        if (propertyUse.length && !propertyUse.includes(`${call?.isResidential}`)) {
          return false;
        }
        if (jobType && jobType !== call?.jobTypeId) {
          return false;
        }
        if (jobSubType && jobSubType !== call?.jobSubTypeId) {
          return false;
        }
        return true;
      });
      return acc;
    }, {});
  }, [filters]);

  if (fetchingCalendarData || !datesMap.get(date)) {
    return (
      [...Array(5)].map((e, i) => (
        <CallCard key={`${date}-skeleton-${i}`} skeleton />
      ))
    );
  }

  const calendarDay = datesMap.get(date).toObject();
  const {
    completedServiceCallsList,
    remindersList,
    serviceCallsList,
    timeoffRequestsList
  } = filterCalls(calendarDay);

  return (
    <Box className={clsx(dayView && classes.dayView)}>
      {dayView && (
        <Button
          startIcon={<BackIcon />}
          onClick={() => setDayView(false)}
        >
          {`Back to ${viewBy} View`}
        </Button>
      )}
      <Box className={classes.dateHeading}>
        {viewBy === 'day' ? (
          <Typography className={classes.dayViewHeading} variant="subtitle2">
            {format(dateObj, 'cccc, MMMM d, yyyy')}
          </Typography>
        ) : (
          <>
            <Typography className={classes.dayCircle}>
              {format(dateObj, 'd')}
            </Typography>
            <Typography variant="subtitle2">
              {format(dateObj, 'cccc')}
            </Typography>
            <Tooltip title="Day View">
              <IconButton
                className={clsx(classes.dayViewButton, md && !dayView && 'visible')}
                aria-label="dayview"
                size="small"
                onClick={() => setDayView(true)}
              >
                <ViewDayIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
      {!!completedServiceCallsList.length && (
        <Button className={classes.completedButton} onClick={() => setShowCompleted(!showCompleted)}>
          <ExpandMoreIcon
            className={clsx(classes.expand, {
              [classes.expandOpen]: showCompleted,
            })}
          />
          Completed Service Calls
        </Button>
      )}
      <Collapse in={showCompleted}>
        {completedServiceCallsList
          .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
          .map(call => (
            <CallCard key={call.id} card={call} type="completed" />
          ))}
      </Collapse>
      {timeoffRequestsList
        .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
        .map(call => (
          <CallCard key={call.id} card={call} type="timeoff" />
        ))}
      {remindersList
        .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
        .map(call => (
          <CallCard key={call.id} card={call} type="reminder" />
        ))}
      {serviceCallsList
        .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
        .map(call => (
          <CallCard key={call.id} card={call} />
        ))}
    </Box>
  );
};

export default Column;
