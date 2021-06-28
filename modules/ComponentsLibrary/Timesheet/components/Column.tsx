import React, { FC, useLayoutEffect, useState } from 'react';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { TimeoffCard } from '../../../ServiceCalendar/components/CallCard';
import { TimesheetLineCard, ServicesRenderedCard } from './TimesheetCard';
import { SkeletonCard } from '../../SkeletonCard';
import { roundNumber, TimeoffRequestTypes } from '../../../../helpers';
import './column.less';

type Props = {
  date: string;
  data: any;
  loading: boolean;
  timeoffRequestTypes?: TimeoffRequestTypes;
  loggedUserId: number;
};

const Column: FC<Props> = ({
  date,
  data,
  loading,
  timeoffRequestTypes,
  loggedUserId,
}) => {
  const [dayView, setDayView] = useState(false);
  const dateObj = parseISO(date);
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'));
  useLayoutEffect(() => {
    document.body.style.overflow = dayView ? 'hidden' : 'visible';
  }, [dayView]);
  const cards = data
    ? [
        ...data?.servicesRenderedList,
        ...data?.timesheetLineList,
        ...data?.timeoffs,
      ]
    : [];
  cards.sort(
    (a, b) =>
      parseISO(a.timeStarted).getTime() - parseISO(b.timeStarted).getTime(),
  );
  return (
    <Box className={clsx(dayView && 'TimesheetColumnDayView')}>
      <div className="TimesheetColumnSticky">
        {dayView && (
          <Button startIcon={<BackIcon />} onClick={() => setDayView(false)}>
            {`Back to Week View`}
          </Button>
        )}
        <Box className="TimesheetColumnPayroll">
          <Typography className="total" variant="body2" color="textSecondary">
            Payroll: <strong>{roundNumber(data?.payroll?.total || 0)}</strong>
          </Typography>
          <div className="details">
            <Typography variant="body2" color="textSecondary">
              Billable:{' '}
              <strong>{roundNumber(data?.payroll?.billable || 0)}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Unbillable:{' '}
              <strong>{roundNumber(data?.payroll?.unbillable || 0)}</strong>
            </Typography>
          </div>
        </Box>
        <Box className="TimesheetColumnDateHeading">
          <>
            <Typography className="TimesheetColumnDayCircle">
              {format(dateObj, 'd')}
            </Typography>
            <Typography variant="subtitle2">
              {format(dateObj, 'cccc')}
            </Typography>
            <Tooltip title="Day View">
              <IconButton
                className={clsx(
                  'TimesheetColumnDayViewButton',
                  md && !dayView && 'visible',
                )}
                aria-label="dayview"
                size="small"
                onClick={() => setDayView(true)}
              >
                <ViewDayIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </>
        </Box>
      </div>
      {loading ? (
        <>
          {[...Array(5)].map((e, i) => (
            <SkeletonCard key={`${date}-skeleton-${i}`} />
          ))}
        </>
      ) : (
        <>
          {cards.map(card => {
            if (card.hideFromTimesheet === 0) {
              return (
                <ServicesRenderedCard key={`src-${card.id}`} card={card} />
              );
            }
            console.log(card);
            //eslint-disable-next-line
            if (card.getAllDayOff != undefined) {
              console.log('we are a timeoff');
              return (
                <TimeoffCard
                  key={`toc-${card.getId()}`}
                  card={{
                    ...card,
                    requestTypeName: timeoffRequestTypes
                      ? timeoffRequestTypes[card.getRequestType()]
                      : undefined,
                  }}
                  loggedUserId={loggedUserId}
                />
              );
            }
            return <TimesheetLineCard key={`tlc-${card.id}`} card={card} />;
          })}
        </>
      )}
    </Box>
  );
};

export default Column;
