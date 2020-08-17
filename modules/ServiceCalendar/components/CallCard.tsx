import React from 'react';
import clsx from 'clsx';
import { isSameDay, format } from 'date-fns';
import { Event } from '@kalos-core/kalos-rpc/Event';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb';
import { SkeletonCard } from '../../ComponentsLibrary/SkeletonCard';
import { useEmployees } from '../hooks';
import {
  colorsMapping,
  repeatsMapping,
  requestTypeMappping,
} from './constants';
import './callCard.less';

type ColorIndicatorProps = {
  type?: string;
  requestType?: number;
  logJobStatus?: string;
  color?: string;
};

const ColorIndicator = ({
  type,
  requestType,
  logJobStatus,
  color,
}: ColorIndicatorProps) => {
  let colorToUse;
  if (type === 'timeoff') {
    colorToUse =
      requestType === 10 ? colorsMapping.timeoff10 : colorsMapping.timeoff;
  } else {
    colorToUse =
      colorsMapping[logJobStatus || '*'] || colorsMapping[color || '*'];
  }
  return (
    <span
      className="ServiceCalendarCallCardColorIndicator"
      style={{ backgroundColor: colorToUse }}
    />
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
  const { employees, employeesLoading } = useEmployees();

  let title, subheader, dates, time;
  const started = new Date(timeStarted);
  const finished = new Date(timeFinished);
  const sameDay = isSameDay(started, finished);
  if (requestType === 10) {
    if (employeesLoading) {
      return <SkeletonCard />;
    }
    const empl = employees.find((emp) => emp.id === +userId);
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
      className="ServiceCalendarCallCardCard"
      onClick={() => {
        const win = window.open(
          `https://app.kalosflorida.com/index.cfm?action=admin:timesheet.addtimeoffrequest&rid=${id}`,
          '_blank'
        );
        if (win) {
          win.focus();
        }
      }}
    >
      <CardActionArea>
        <CardHeader
          className="ServiceCalendarCallCardCardHeader"
          avatar={<ColorIndicator type="timeoff" requestType={requestType} />}
          title={title}
          subheader={subheader}
        />
        <CardContent className="ServiceCalendarCallCardCardContent">
          {dates && (
            <Typography
              className="ServiceCalendarCallCardDate"
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {dates} {time}
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary" component="p">
            {name}
          </Typography>
          {requestType && (
            <Typography variant="body2" color="textSecondary" component="p">
              {requestTypeMappping[requestType]}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

type CallProps = {
  card: Event.AsObject;
  type?: string;
};

export const CallCard = ({ card, type }: CallProps): JSX.Element => {
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
  const { employees, employeesLoading } = useEmployees();
  const technicianIds =
    logTechnicianAssigned !== '0' && logTechnicianAssigned !== ''
      ? logTechnicianAssigned.split(',')
      : [];
  if (technicianIds.length && employeesLoading) {
    return <SkeletonCard />;
  }

  const title = logJobStatus ? logJobStatus : null;
  const subheader = isAllDay
    ? 'All Day Event'
    : `${timeStarted} - ${timeEnded}`;

  const technicianNames = technicianIds
    .map((id: string) => {
      const employee = employees.find((emp) => emp.id === +id);
      return `${employee?.firstname} ${employee?.lastname}`;
    })
    .join(', ');
  return (
    <Card
      className="ServiceCalendarCallCardCard"
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
          className={clsx(
            'ServiceCalendarCallCardCardHeader',
            logJobNumber && 'jobNumber'
          )}
          avatar={
            <ColorIndicator
              type={type}
              logJobStatus={logJobStatus}
              color={color}
            />
          }
          title={title}
          subheader={subheader}
          action={
            <Typography
              variant="caption"
              className="ServiceCalendarCallCardJobNumber"
            >
              {logJobNumber}
            </Typography>
          }
        />
        <CardContent className="ServiceCalendarCallCardCardContent">
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
