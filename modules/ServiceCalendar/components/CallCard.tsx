import React, { useState } from 'react';
import clsx from 'clsx';
import isSameDay from 'date-fns/isSameDay';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { differenceInMinutes } from 'date-fns';
import { Event } from '@kalos-core/kalos-rpc/Event';
import Card from '@material-ui/core/Card';
import Badge from '@material-ui/core/Badge';
import CardActionArea from '@material-ui/core/CardActionArea';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/TimeoffRequest';
import { SkeletonCard } from '../../ComponentsLibrary/SkeletonCard';
import { Modal } from '../../ComponentsLibrary/Modal';
import { TimeOff } from '../../ComponentsLibrary/TimeOff';
import { useEmployees } from '../hooks';
import {
  colorsMapping,
  repeatsMapping,
  requestTypeMappping,
} from './constants';
import {
  formatTime,
  makeSafeFormObject,
  roundNumber,
  TimeoffRequestClientService,
} from '../../../helpers';
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
  card: TimeoffRequest & {
    requestTypeName?: string;
  };
  loggedUserId: number;
}

export const TimeoffCard = ({
  card,
  loggedUserId,
}: TimeoffProps): JSX.Element | null => {
  /*
  const {
    id,
    requestType,
    adminApprovalUserId,
    requestStatus,
    timeStarted,
    timeFinished,
    userName,
    userId,
    allDayOff,
    requestTypeName,
    requestClass,
  } = card;
  */
  const id = card.getId();

  const requestType = card.getRequestType();
  const adminApprovalUserId = card.getAdminApprovalUserId();
  const requestStatus = card.getRequestStatus();
  const timeStarted = card.getTimeStarted();
  const timeFinished = card.getTimeFinished();
  const userName = card.getUserName();
  const userId = card.getUserId();
  const allDayOff = card.getAllDayOff();
  const requestClass = card.getRequestClass();
  const requestTypeName = requestType;
  // if (adminApprovalUserId === 0) {
  //   return null;
  // }
  let subheader, dates, time;
  const [editId, setEditId] = useState<number>();
  try {
    const employees = useEmployees().employees;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const employeesLoading = useEmployees().employeesLoading;
    if (employeesLoading) {
      return <SkeletonCard />;
    }
    console.log({ employees });
    const empl = employees.find(emp => emp.getId() === +userId);
    subheader = empl ? `${empl?.getFirstname()} ${empl?.getLastname()}` : '';
  } catch (e) {
    console.log(e);
  }
  const started = parseISO(timeStarted);
  const finished = parseISO(timeFinished);
  const sameDay = isSameDay(started, finished);
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
    <>
      <Card
        className="ServiceCalendarCallCardCard"
        onClick={() => {
          // const win = window.open(
          //   `https://app.kalosflorida.com/index.cfm?action=admin:timesheet.addtimeoffrequest&rid=${id}`,
          //   '_blank',
          // );
          // if (win) {
          //   win.focus();
          // }
          setEditId(id); // TODO: replace with above to revert react edit modal
        }}
      >
        <CardActionArea>
          <CardHeader
            className="ServiceCalendarCallCardCardHeader"
            avatar={<ColorIndicator type="timeoff" requestType={requestType} />}
            title={
              adminApprovalUserId === 0
                ? 'Pending Approval'
                : requestStatus === 0
                ? 'Not Approved'
                : 'Approved'
            }
            subheader={requestTypeName}
          />
          <CardContent className="ServiceCalendarCallCardCardContent">
            {subheader && (
              <Typography variant="body2" component="p">
                {subheader}
              </Typography>
            )}
            {dates && (
              <Typography
                className="ServiceCalendarCallCardDate"
                variant="body2"
                component="p"
              >
                {dates} {time}
              </Typography>
            )}
            {!allDayOff ? (
              <strong>
                {roundNumber(
                  differenceInMinutes(
                    parseISO(timeFinished),
                    parseISO(timeStarted),
                  ) / 60,
                )}
              </strong>
            ) : (
              8
            )}
            {requestTypeName && (
              <Typography variant="body2" component="p">
                {requestClass}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
      {editId && (
        <Modal open onClose={() => setEditId(undefined)} fullScreen>
          <TimeOff
            requestOffId={id}
            onCancel={() => setEditId(undefined)}
            loggedUserId={loggedUserId}
            userId={+userId}
            onSaveOrDelete={() => {
              setEditId(undefined);
              document.location.reload();
            }}
            onAdminSubmit={() => {
              setEditId(undefined);
              document.location.reload();
            }}
            cancelLabel="Close"
          />
        </Modal>
      )}
    </>
  );
};

type CallProps = {
  card: Event;
  type?: string;
};

export const CallCard = ({ card, type }: CallProps): JSX.Element => {
  /*
  let {
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
    isLmpc,
  } = card;
*/
  const id = card.getId();
  const propertyId = card.getPropertyId();
  const name = card.getName();
  const customer = card.getCustomer();
  const timeEnded = card.getTimeEnded();
  const description = card.getDescription();
  const logTechnicianAssigned = card.getLogTechnicianAssigned();
  const logJobNumber = card.getLogJobNumber();
  const logJobStatus = card.getLogJobStatus();
  const color = card.getColor();
  const isAllDay = card.getIsAllDay();
  const repeatType = card.getRepeatType();
  const dateEnded = card.getDateEnded();
  const timeStarted = card.getTimeStarted();
  const isLmpc = card.getIsLmpc();
  const { employees, employeesLoading } = useEmployees();
  const [contentTextCollapsed, setContentTextCollapsed] = useState(true);
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
    : `${formatTime(timeStarted)} - ${formatTime(timeEnded)}`;

  const technicianNames = technicianIds
    .map((id: string) => {
      const employee = employees.find(emp => emp.getId() === +id);
      return `${employee?.getFirstname()} ${employee?.getLastname()}`;
    })
    .join(', ');
  const isWhiteText = color === '000000';
  const invisible = isLmpc === 1 ? false : true;
  return (
    <Card
      style={{
        backgroundColor: `#${color === '55e552' ? '7ebf36' : color}`,
        ...(isWhiteText
          ? {
              filter: 'invert(1)',
            }
          : {}),
      }}
      className="ServiceCalendarCallCardCard"
      onClick={() => {
        if (contentTextCollapsed) {
          return setContentTextCollapsed(false);
        }
        let url;
        if (type === 'reminder') {
          url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editReminder&id=${id}`;
        } else {
          url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${id}&property_id=${propertyId}&user_id=${customer?.getId()}`;
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
            logJobNumber && 'jobNumber',
          )}
          title={
            <>
              {!invisible ? (
                <Badge
                  style={{ paddingLeft: '7.5%' }}
                  badgeContent="LMPC"
                  color="primary"
                  invisible={invisible}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                />
              ) : null}
              <Typography variant="body2" component="p">
                {title}
              </Typography>
            </>
          }
          subheader={
            <Typography variant="body2" component="p">
              {subheader}
            </Typography>
          }
          action={
            <Typography
              variant="caption"
              className="ServiceCalendarCallCardJobNumber"
            >
              {logJobNumber}
            </Typography>
          }
        />
        <CardContent
          className={`ServiceCalendarCallCardCardContent ${
            contentTextCollapsed ? 'collapsed' : ''
          }`}
        >
          {(!type || type === 'completed') && (
            <Typography variant="body1" component="p">
              <strong>
                {customer?.getBusinessname() ||
                  `${customer?.getFirstname()} ${customer?.getLastname()}`}
              </strong>
            </Typography>
          )}
          {technicianNames.length ? (
            <Typography variant="body1" component="p">
              Technician: {technicianNames}
            </Typography>
          ) : null}
          <Typography variant="body1" component="p">
            {name}
          </Typography>
          {repeatType ? (
            <Typography variant="body1" component="p">
              Repeats {repeatsMapping[repeatType]}
              {dateEnded ? ` until ${dateEnded}` : ' forever'}
            </Typography>
          ) : null}
          {description ? (
            <Typography
              variant="body1"
              component="p"
              dangerouslySetInnerHTML={{
                __html: description.replace('\r\n', '<br />'),
              }}
            />
          ) : null}
          <span
            className="ServiceCalendarCallCardCollapseIcon"
            onClick={event => {
              event.stopPropagation();
              setContentTextCollapsed(!contentTextCollapsed);
            }}
          >
            {contentTextCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </span>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
