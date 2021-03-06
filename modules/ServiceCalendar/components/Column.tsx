import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from 'react';
import clsx from 'clsx';
import compact from 'lodash/compact';
import { format, parseISO } from 'date-fns';
import { Event } from '../../../@kalos-core/kalos-rpc/Event';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBack';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useCalendarData } from '../hooks';
import { CallCard, TimeoffCard } from './CallCard';
import { SkeletonCard } from '../../ComponentsLibrary/SkeletonCard';
import { colorsMapping } from './constants';
import { TimeoffRequestTypes } from '../../../helpers';
import { CalendarDay } from '../../../@kalos-core/kalos-rpc/compiled-protos/event_pb';
import { TimeoffRequest } from '../../../@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb';
import './Column.module.less';

type Props = {
  date: string;
  viewBy?: string;
  userId: number;
  isAdmin: boolean;
  timeoffRequestTypes?: TimeoffRequestTypes;
};

type CallsList = {
  [key: string]: Event[] | TimeoffRequest[];
  completedServiceCallsList: Event[];
  remindersList: Event[];
  serviceCallsList: Event[];
  timeoffRequestsList: TimeoffRequest[];
};
const Column = ({
  date,
  viewBy,
  userId,
  isAdmin,
  timeoffRequestTypes,
}: Props): JSX.Element => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [showTimeoff, setShowTimeoff] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  const [dayView, setDayView] = useState(false);
  const [autoScrollInitialized, setAutoScrollInitialized] = useState(false);
  useLayoutEffect(() => {
    document.body.style.overflow = dayView ? 'hidden' : 'visible';
  }, [dayView]);
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const { fetchingCalendarData, datesMap, filters } = useCalendarData();
  const dateObj = parseISO(date);
  console.log(datesMap);
  useEffect(() => {
    if (!(fetchingCalendarData || !datesMap?.get(date))) {
      const id = `ServiceCalendarColumnDateHeading_${format(
        new Date(),
        'dd_MM_yyyy',
      )}`;
      const currBox = document.getElementById(id);
      if (!autoScrollInitialized && !dayView && currBox) {
        setAutoScrollInitialized(true);
        currBox.scrollIntoView({
          behavior: 'auto',
          block: 'start',
          inline: 'center',
        });
      }
    }
  }, [date, autoScrollInitialized, datesMap, dayView, fetchingCalendarData]);
  const filterCalls = useCallback(
    (calendarDay: CalendarDay) => {
      const {
        customers,
        zip,
        propertyUse,
        jobType,
        jobSubType,
        serviceCallDepartmentIds,
        states,
        techIds: techIdsFilter,
      } = filters!;
      const callList = [
        calendarDay.getCompletedServiceCallsList(),
        calendarDay.getRemindersList(),
        calendarDay.getServiceCallsList(),
      ];
      for (let i = 0; i < callList.length; i++) {
        const jobTypeIdsFilterArry = compact((jobType || '0').split(','))
          .map(Number)
          .filter(e => e !== 0);
        const serviceCallDepartmentIdsFilterarray = compact(
          (serviceCallDepartmentIds || '0').split(','),
        )
          .map(Number)
          .filter(e => e !== 0);
        callList[i] = callList[i].filter((call: Event) => {
          const techIdsFilterArr = compact((techIdsFilter || '0').split(','))
            .map(Number)
            .filter(e => e !== 0);
          if (techIdsFilterArr.length > 0) {
            if (
              !call.getLogTechnicianAssigned() ||
              call.getLogTechnicianAssigned() === '0'
            )
              return false;
            const techIds = call
              .getLogTechnicianAssigned()
              .split(',')
              .map(Number);
            if (techIdsFilterArr.find(item => techIds.includes(item))) {
              return true;
            } else {
              return false;
            }
          } else if (!isAdmin && call.getLogTechnicianAssigned()) {
            const techIds = call
              .getLogTechnicianAssigned()
              .split(',')
              .map(Number);
            if (!techIds.includes(userId)) {
              return false;
            }
          }

          if (
            customers.length &&
            !customers.includes(`${call?.getCustomer()?.getId()}`)
          ) {
            return false;
          }
          if (
            zip.length &&
            !zip.includes(call?.getProperty()?.getZip() || '')
          ) {
            return false;
          }
          if (
            states.length &&
            !states.includes(call?.getProperty()?.getState() || '')
          ) {
            return false;
          }
          if (
            propertyUse.length &&
            !propertyUse.includes(`${call?.getIsResidential()}`)
          ) {
            return false;
          }

          if (
            jobTypeIdsFilterArry.length > 0 &&
            !jobTypeIdsFilterArry.includes(call?.getJobTypeId())
          ) {
            return false;
          }

          if (jobSubType && jobSubType !== call?.getJobSubtypeId()) {
            return false;
          }
          if (
            serviceCallDepartmentIdsFilterarray.length > 0 &&
            !serviceCallDepartmentIdsFilterarray.includes(
              call?.getDepartmentId(),
            )
          ) {
            return false;
          }
          return true;
        });
      }
      return {
        completedServiceCallsList: callList[0],
        remindersList: callList[1],
        serviceCallsList: callList[2],
      };
    },
    [filters, isAdmin, userId],
  );
  const filterTimeoff = useCallback(
    (requestList: TimeoffRequest[]) => {
      const { timeoffDepartmentIds } = filters!;

      const departmentIds = compact((timeoffDepartmentIds || '0').split(','))
        .map(Number)
        .filter(e => e !== 0);
      console.log('department ids', departmentIds);

      let filteredRequestList = requestList.filter((call: TimeoffRequest) => {
        console.log('call', call.toObject());
        if (
          departmentIds.length > 0 &&
          !departmentIds.includes(call?.getDepartmentCode())
        ) {
          return false;
        }

        return true;
      });

      return filteredRequestList;
    },
    [filters],
  );
  if (fetchingCalendarData || !datesMap?.get(date)) {
    if (fetchingCalendarData)
      return (
        <>
          {[...Array(5)].map((e, i) => (
            <SkeletonCard key={`${date}-skeleton-${i}`} skipAvatar />
          ))}
        </>
      );
    return (
      <Box className={clsx(dayView && 'ServiceCalendarColumnDayView')}>
        <div className="ServiceCalendarColumnSticky">
          {dayView && (
            <Button startIcon={<BackIcon />} onClick={() => setDayView(false)}>
              {`Back to ${viewBy} View`}
            </Button>
          )}
          <Box
            className="ServiceCalendarColumnDateHeading"
            id={`ServiceCalendarColumnDateHeading_${format(
              dateObj,
              'dd_MM_yyyy',
            )}`}
          >
            {viewBy === 'day' ? (
              <Typography
                className="ServiceCalendarColumnDayViewHeading"
                variant="subtitle2"
              >
                {format(dateObj, 'cccc, MMMM d, yyyy')}
              </Typography>
            ) : (
              <>
                <Typography className="ServiceCalendarColumnDayCircle">
                  {format(dateObj, 'd')}
                </Typography>
                <Typography variant="subtitle2">
                  {format(dateObj, 'cccc')}
                </Typography>
                <Tooltip title="Day View">
                  <IconButton
                    className={clsx(
                      'ServiceCalendarColumnDayViewButton',
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
            )}
          </Box>
        </div>
      </Box>
    );
  }

  const calendarDay = datesMap?.get(date);
  const filteredCalendarDay = new CalendarDay();
  filteredCalendarDay.setRemindersList(calendarDay!.getRemindersList());
  filteredCalendarDay.setTimeoffRequestsList(
    calendarDay!.getTimeoffRequestsList(),
  );
  filteredCalendarDay.setServiceCallsList(calendarDay!.getServiceCallsList());
  filteredCalendarDay.setCompletedServiceCallsList(
    calendarDay!.getCompletedServiceCallsList(),
  );
  const { completedServiceCallsList, remindersList, serviceCallsList } =
    filterCalls(filteredCalendarDay);
  const timeoffRequestsList = filterTimeoff(
    calendarDay!.getTimeoffRequestsList(),
  );
  /*
  const {
    completedServiceCallsList,
    remindersList,
    serviceCallsList,
    timeoffRequestsList,
  } = filterCalls(calendarDay);
*/
  return (
    <Box className={clsx(dayView && 'ServiceCalendarColumnDayView')}>
      <div className="ServiceCalendarColumnSticky">
        {dayView && (
          <Button startIcon={<BackIcon />} onClick={() => setDayView(false)}>
            {`Back to ${viewBy} View`}
          </Button>
        )}
        <Box
          className="ServiceCalendarColumnDateHeading"
          id={`ServiceCalendarColumnDateHeading_${format(
            dateObj,
            'dd_MM_yyyy',
          )}`}
        >
          {viewBy === 'day' ? (
            <Typography
              className="ServiceCalendarColumnDayViewHeading"
              variant="subtitle2"
            >
              {format(dateObj, 'cccc, MMMM d, yyyy')}
            </Typography>
          ) : (
            <>
              <Typography className="ServiceCalendarColumnDayCircle">
                {format(dateObj, 'd')}
              </Typography>
              <Typography variant="subtitle2">
                {format(dateObj, 'cccc')}
              </Typography>
              <Tooltip title="Day View">
                <IconButton
                  className={clsx(
                    'ServiceCalendarColumnDayViewButton',
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
          )}
        </Box>
      </div>
      {completedServiceCallsList != undefined &&
        completedServiceCallsList.length > 0 && (
          <Button
            className="ServiceCalendarColumnCompletedButton"
            onClick={() => setShowCompleted(!showCompleted)}
            style={{ background: colorsMapping.Completed }}
          >
            <ExpandMoreIcon
              className={clsx('ServiceCalendarColumnExpand', {
                ['ServiceCalendarColumnExpandOpen']: showCompleted,
              })}
            />
            Completed Service Calls
          </Button>
        )}
      {timeoffRequestsList != undefined && timeoffRequestsList.length > 0 && (
        <Button
          className="ServiceCalendarColumnTimeoffButton"
          onClick={() => setShowTimeoff(!showTimeoff)}
          style={{ background: '#dfdede' }}
        >
          <ExpandMoreIcon
            className={clsx('ServiceCalendarColumnExpand', {
              ['ServiceCalendarColumnExpandOpen']: showTimeoff,
            })}
          />
          TimeOff Requests
        </Button>
      )}
      {remindersList != undefined && remindersList.length > 0 && (
        <Button
          className="ServiceCalendarColumnReminderButton"
          onClick={() => setShowReminder(!showReminder)}
          style={{ background: colorsMapping.reminder }}
        >
          <ExpandMoreIcon
            className={clsx('ServiceCalendarColumnExpand', {
              ['ServiceCalendarColumnExpandOpen']: showReminder,
            })}
          />
          Reminders
        </Button>
      )}
      <Collapse in={showCompleted}>
        {completedServiceCallsList
          .sort(
            (a, b) =>
              parseInt(a.getTimeStarted()) - parseInt(b.getTimeStarted()),
          )
          .map(call => (
            <CallCard key={call.getId()} card={call} type="completed" />
          ))}
      </Collapse>
      <Collapse in={showTimeoff}>
        {timeoffRequestsList
          .sort(
            (a, b) =>
              parseInt(a.getTimeStarted()) - parseInt(b.getTimeStarted()),
          )
          .map(call => (
            <TimeoffCard key={call.getId()} card={call} loggedUserId={userId} />
          ))}
      </Collapse>
      <Collapse in={showReminder}>
        {remindersList
          .sort(
            (a, b) =>
              parseInt(a.getTimeStarted()) - parseInt(b.getTimeStarted()),
          )
          .map(call => (
            <CallCard key={call.getId()} card={call} type="reminder" />
          ))}
      </Collapse>
      {serviceCallsList
        .sort(
          (a, b) => parseInt(a.getTimeStarted()) - parseInt(b.getTimeStarted()),
        )
        .map(call => (
          <CallCard key={call.getId()} card={call} />
        ))}
    </Box>
  );
};

export default Column;
