import React, {FC, useCallback, useLayoutEffect, useState} from 'react';
import clsx from 'clsx';
import { format } from "date-fns";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  ServicesRenderedClient,
  ServicesRendered,
} from '@kalos-core/kalos-rpc/ServicesRendered';
import {
  TimesheetLineClient,
  TimesheetLine
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { ENDPOINT } from '../../../constants';
import { useFetchAll } from '../../ComponentsLibrary/hooks';
import { TimesheetLineCard, ServicesRenderedCard } from './TimesheetCard';

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
  }),
);

const srClient = new ServicesRenderedClient(ENDPOINT);
const tslClient = new TimesheetLineClient(ENDPOINT);

type Props = {
  date: string,
  userId: number,
};

const Column: FC<Props> = ({ date, userId }) => {
  const classes = useStyles();
  const [dayView, setDayView] = useState(false);

  const dateObj = new Date(date);

  const fetchServicesRendered = useCallback( async (page) => {
    const req = new ServicesRendered();
    req.setTimeStarted(`${date}%`);
    req.setTechnicianUserId(userId);
    req.setPageNumber(page);
    return (await srClient.BatchGet(req)).toObject();
  }, []);

  const fetchTimesheetLine = useCallback( async (page) => {
    const req = new TimesheetLine();
    req.setTimeStarted(`${date}%`);
    req.setTechnicianUserId(userId);
    req.setPageNumber(page);
    return (await tslClient.BatchGet(req)).toObject();
  }, []);

  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'));
  useLayoutEffect(() => {
    document.body.style.overflow = dayView ? 'hidden' : 'visible';
  }, [dayView]);

  const { data:servicesRendered, isLoading:servicesRenderedLoading } = useFetchAll(fetchServicesRendered);
  const { data:timesheetLine, isLoading:timesheetLineLoading } = useFetchAll(fetchTimesheetLine);
  const cards = [...servicesRendered, ...timesheetLine].sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted));
  return (
    <Box className={clsx(dayView && classes.dayView)}>
      {dayView && (
        <Button
          startIcon={<BackIcon />}
          onClick={() => setDayView(false)}
        >
          {`Back to Week View`}
        </Button>
      )}
      <Box className={classes.dateHeading}>
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
      </Box>
      {cards.map(card => {
        if (card.hideFromTimesheet === 0) {
          return <ServicesRenderedCard key={`src-${card.id}`} card={card} />
        }
        return <TimesheetLineCard key={`tlc-${card.id}`} card={card} />
      })}
    </Box>
  );
};

export default Column;
