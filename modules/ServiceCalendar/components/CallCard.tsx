import React from 'react';
import clsx from 'clsx';
import { isSameDay, format } from 'date-fns';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { colorsMapping, repeatsMapping, requestTypeMappping } from '../constants';
import { useEmployees } from '../hooks';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: `${theme.spacing(1)}px 0`,
    },
    cardHeader: {
      padding: theme.spacing(1),
      '&.jobNumber': {
        paddingTop: theme.spacing(2.5),
      },
    },
    cardContent: {
      padding: `0 ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
    date: {
      fontSize: '0.75rem',
      fontWeight: 100,
    },
    colorIndicator: {
      display: 'block',
      width: theme.spacing(2),
      height: theme.spacing(2),
      borderRadius: theme.spacing(1),
    },
    jobNumber: {
      position: 'absolute',
      top: theme.spacing(0.5),
      right: theme.spacing(1),
    },
  }),
);

type ColorIndicatorProps = {
  type?: string;
  requestType?: number;
  logJobStatus?: string;
  color?: string;
}

const ColorIndicator = ({ type, requestType, logJobStatus, color }: ColorIndicatorProps) => {
  const classes = useStyles();
  let colorToUse;
  if (type === 'timeoff') {
    colorToUse = requestType === 10 ? colorsMapping.timeoff10 : colorsMapping.timeoff;
  } else {
    colorToUse = colorsMapping[logJobStatus || '*'] || colorsMapping[color || '*'];
  }
  return (
    <span
      className={classes.colorIndicator}
      style={{ backgroundColor: colorToUse }}
    />
  );
};

export const SkeletonCard = () => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<Skeleton variant="circle" width={16} height={16} />}
        title={<Skeleton width="50%" />}
        subheader={<Skeleton width="50%" />}
      />
      <CardContent className={classes.cardContent}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </CardContent>
    </Card>
  );
};

interface TimeoffProps {
  card: TimeoffRequest.AsObject;
}

export const TimeoffCard = ({ card }: TimeoffProps): JSX.Element => {
  const {
    id,
    requestType,
    adminApprovalUserId,
    timeStarted,
    timeFinished,
    userName,
    userId,
    allDayOff,
  } = card;

  const classes = useStyles();
  const { employees, employeesLoading } = useEmployees();

  let title, subheader, dates, time;
  const started = new Date(timeStarted);
  const finished = new Date(timeFinished);
  const sameDay = isSameDay(started, finished);
  if (requestType === 10) {
    if (employeesLoading) {
      return <SkeletonCard />;
    }
    const empl = employees.find(emp => emp.id === +userId);
    title = 'Training:';
    subheader = `${empl?.firstname} ${empl?.lastname}`;
  } else {
    title = `${adminApprovalUserId ? 'Time off' : 'Pending'}:`;
    subheader = userName;
  }
  if (sameDay) {
    dates = format(started, 'M/dd');
    if (allDayOff) {
      time = 'All Day';
    } else {
      time = `${format(started, 'p')} - ${format(finished, 'p')}`;
    }
  } else {
    dates = `${format(started, 'M/dd p')} - ${format(finished, 'M/dd p')}`;
  }
  return (
    <Card
      className={classes.card}
      onClick={() => {
        const win = window.open(`https://app.kalosflorida.com/index.cfm?action=admin:timesheet.addtimeoffrequest&rid=${id}`, '_blank');
        if (win) {
          win.focus();
        }
      }}
    >
      <CardActionArea>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <ColorIndicator
              type="timeoff"
              requestType={requestType}
            />
          }
          title={title}
          subheader={subheader}
        />
        <CardContent className={classes.cardContent}>
          {dates && (
            <Typography className={classes.date} variant="body2" color="textSecondary" component="p">
              {dates} {time}
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary" component="p">
            {name}
          </Typography>
          {requestType && (
            <Typography variant="body2" color="textSecondary" component="p">{requestTypeMappping[requestType]}</Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

type CallProps = {
  card: Event.AsObject;
  type?: string;
}

export const CallCard = ({ card, type}: CallProps): JSX.Element => {
  const {
    id,
    propertyId,
    name,
    customer,
    timeEnded,
    description,
    logTechnicianAssigned = '',
    logJobNumber,
    logJobStatus,
    color,
    isAllDay,
    repeatType,
    dateEnded,
    timeStarted,
  } = card;

  const classes = useStyles();
  const { employees, employeesLoading } = useEmployees();
  const technicianIds =
    logTechnicianAssigned !== '0' && logTechnicianAssigned !== ''
      ? logTechnicianAssigned.split(',')
      : [];
  if (technicianIds.length && employeesLoading) {
    return <SkeletonCard />;
  }

  const title = logJobStatus ? logJobStatus : null;
  const subheader = isAllDay ? 'All Day Event' : `${timeStarted} - ${timeEnded}`;

  const technicianNames = technicianIds
    .map((id: string) => {
      const employee = employees.find(emp => emp.id === +id);
      return `${employee?.firstname} ${employee?.lastname}`;
    })
    .join(', ');
  return (
    <Card
      className={classes.card}
      onClick={() => {
        let url;
        if (type === 'reminder') {
          url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editReminder&id=${id}`;
        } else {
          url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${id}&property_id=${propertyId}&user_id=${customer?.id}`;
        }
        const win = window.open(url, '_blank');
        if (win) {
          win.focus();
        }
      }}
    >
      <CardActionArea>
        <CardHeader
          className={clsx(classes.cardHeader, logJobNumber && 'jobNumber')}
          avatar={
            <ColorIndicator
              type={type}
              logJobStatus={logJobStatus}
              color={color}
            />
          }
          title={title}
          subheader={subheader}
          action={<Typography variant="caption" className={classes.jobNumber}>{logJobNumber}</Typography>}
        />
        <CardContent className={classes.cardContent}>
          {(!type || type === 'completed') && (
            <Typography variant="body2" color="textSecondary" component="p">
              Customer:{' '}
              {customer?.businessname ||
                `${customer?.firstname} ${customer?.lastname}`}
            </Typography>
          )}
          {technicianNames.length ? (
            <Typography variant="body2" color="textSecondary" component="p">
              Technician: {technicianNames}
            </Typography>
          ) : null}
          <Typography variant="body2" color="textSecondary" component="p">
            {name}
          </Typography>
          {repeatType ? (
            <Typography variant="body2" color="textSecondary" component="p">
              Repeats {repeatsMapping[repeatType]}
              {dateEnded ? ` until ${dateEnded}` : ' forever'}
            </Typography>
          ) : null}
          {description ? (
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              dangerouslySetInnerHTML={{
                __html: description.replace('\r\n', '<br />'),
              }}
            />
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
