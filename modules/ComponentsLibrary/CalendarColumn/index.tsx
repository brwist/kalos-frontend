import React, { FC, useState, ReactNode, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import { SkeletonCard } from '../../ComponentsLibrary/SkeletonCard';

interface Props {
  date: string;
  header?: ReactNode;
  loading?: boolean;
}

const useStyles = makeStyles(theme => ({
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
      [theme.breakpoints.up('lg')]: {
        visibility: 'hidden',
      },
    },
  },
}));

export const CalendarColumn: FC<Props> = ({
  date,
  header,
  loading,
  children,
}) => {
  const classes = useStyles();
  const [dayView, setDayView] = useState(false);
  useLayoutEffect(() => {
    document.body.style.overflow = dayView ? 'hidden' : 'visible';
  }, [dayView]);

  const dateObj = new Date(date);
  return (
    <Box className={clsx(dayView && classes.dayView)}>
      {dayView && (
        <Button startIcon={<BackIcon />} onClick={() => setDayView(false)}>
          {`Back to Week View`}
        </Button>
      )}
      {header}
      <Box className={classes.dateHeading}>
        <>
          <Typography className={classes.dayCircle}>
            {format(dateObj, 'd')}
          </Typography>
          <Typography variant="subtitle2">{format(dateObj, 'cccc')}</Typography>
          <Tooltip title="Day View">
            <IconButton
              className={clsx(classes.dayViewButton, !dayView && 'visible')}
              aria-label="dayview"
              size="small"
              onClick={() => setDayView(true)}
            >
              <ViewDayIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </>
      </Box>
      {loading ? (
        <>
          {[...Array(5)].map((e, i) => (
            <SkeletonCard key={`${date}-skeleton-${i}`} />
          ))}
        </>
      ) : (
        children
      )}
    </Box>
  );
};
