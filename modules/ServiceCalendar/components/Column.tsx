import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from 'react';
import clsx from 'clsx';
import compact from 'lodash/compact';
import { format, parseISO } from 'date-fns';
import { Event } from '@kalos-core/kalos-rpc/Event';
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
import { CalendarDay } from '@kalos-core/kalos-rpc/compiled-protos/event_pb';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb';
import './column.less';

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
        techIds: techIdsFilter,
      } = filters!;
      const callList = [
        calendarDay.getCompletedServiceCallsList(),
        calendarDay.getRemindersList(),
        calendarDay.getServiceCallsList(),
      ];
      for (let i = 0; i < callList.length; i++) {
        //
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
            propertyUse.length &&
            !propertyUse.includes(`${call?.getIsResidential()}`)
          ) {
            return false;
          }
          if (jobType && jobType !== call?.getJobTypeId()) {
            return false;
          }
          if (jobSubType && jobSubType !== call?.getJobSubtypeId()) {
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
  ); /*
  const filterCalls_old = useCallback(
    (calendarDay: CalendarDay): CallsList => {
      const {
        customers,
        zip,
        propertyUse,
        jobType,
        jobSubType,
        techIds: techIdsFilter,
      } = filters!;

      return Object.keys(calendarDay).reduce(
        (acc: CallsList, key) => {
          let calls = calendarDay[key];
          acc[key] = calls.filter((call: Event) => {
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
              propertyUse.length &&
              !propertyUse.includes(`${call?.getIsResidential()}`)
            ) {
              return false;
            }
            if (jobType && jobType !== call?.getJobTypeId()) {
              return false;
            }
            if (jobSubType && jobSubType !== call?.getJobSubtypeId()) {
              return false;
            }
            return true;
          });
          return acc;
        },
        {
          completedServiceCallsList: [],
          remindersList: [],
          serviceCallsList: [],
          timeoffRequestsList: [],
        },
      );
    },
    [isAdmin, userId, filters],
  );
*/
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
  const timeoffRequestsList = calendarDay!.getTimeoffRequestsList();
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
      {completedServiceCallsList != undefined && (
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
      {timeoffRequestsList
        .sort(
          (a, b) => parseInt(a.getTimeStarted()) - parseInt(b.getTimeStarted()),
        )
        .map(call => (
          <TimeoffCard key={call.getId()} card={call} loggedUserId={userId} />
        ))}
      {remindersList
        .sort(
          (a, b) => parseInt(a.getTimeStarted()) - parseInt(b.getTimeStarted()),
        )
        .map(call => (
          <CallCard key={call.getId()} card={call} type="reminder" />
        ))}
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
