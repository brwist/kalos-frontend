import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event/index';
import { ENDPOINT } from '../../../constants';
import { useCalendarData } from '../hooks';
import CallCard from './CallCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

const eventClient = new EventClient(ENDPOINT);
type FilterOption = {
  customer: any;
  zip: string | null;
}
type Props = {
  date: string;
  filters: Filters;
  addFilterOptions: (arg0: FilterOption) => void;
};

const Column = ({ date}: Props) => {
  const classes = useStyles();
  const [showCompleted, setShowCompleted] = useState(false);
  const { fetchingCalendarData, datesMap, filters } = useCalendarData();

  const filterCalls = useCallback(calendarDay => {
    const { customers, zip, propertyUse, jobType, jobSubType } = filters;
    return Object.keys(calendarDay).reduce((acc, key) => {
      let calls = calendarDay[key];
      acc[key] = calls.filter(call => {
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
        if (jobSubType && jobType !== call?.jobSubTypeId) {
          return false;
        }
        return true;
      });
      return acc;
    }, {});
  }, [filters]);

  if (fetchingCalendarData) {
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
    <div>
      {format(new Date(date), 'MMMM d, yyyy')}
      {!!completedServiceCallsList.length && (
        <Button onClick={() => setShowCompleted(!showCompleted)}>
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
            <CallCard key={call.id} card={call} />
          ))}
      </Collapse>
      {remindersList
        .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
        .map(call => (
          <CallCard key={call.id} card={call} reminder />
        ))}
      {serviceCallsList
        .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
        .map(call => (
          <CallCard key={call.id} card={call} />
        ))}
    </div>
  );
};

export default Column;
