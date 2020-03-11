import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event/index';
import { ENDPOINT } from '../../../constants';
import { useFetchAll } from '../hooks';
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

type Props = {
  date: string;
  filters: Filters;
  addFilterOptions: (object) => void;
};

const Column = ({ date, filters, addFilterOptions }: Props) => {
  const classes = useStyles();
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchCalls = useCallback( async (page) => {
    const event = new Event();
    event.setDateStarted(`${date} 00:00:00%`);
    event.setPageNumber(page);
    return (await eventClient.BatchGet(event)).toObject();
  }, []);

  const { data } = useFetchAll(fetchCalls);
  const {completedCalls, calls, reminders} = data.reduce((acc, call) => {
    if (filters.customers.length && !filters.customers.includes(`${call?.customer?.id}`)) {
      return acc;
    }
    if (filters.zip.length && !filters.zip.includes(call?.property?.zip)) {
      return acc;
    }
    if (call.logJobStatus === 'Completed') {
      acc.completedCalls.push(call);
    }
    if (call.logJobStatus !== 'Completed' && call.color !== 'ffbfbf') {
      acc.calls.push(call);
    }
    if (call.color === 'ffbfbf') {
      acc.reminders.push(call);
    }
    addFilterOptions({
      customer: call.customer,
      zip: call?.property?.zip ?? null,
    });
    return acc;
  }, { completedCalls: [], calls: [], reminders: []});

  return (
    <div>
      {format(new Date(date), 'MMMM d, yyyy')}
      {!data.length && (
        [...Array(5)].map((e, i) => (
          <CallCard key={`${date}-skeleton-${i}`} skeleton />
        ))
      )}
      {!!completedCalls.length && (
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
        {completedCalls
          .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
          .map(call => (
            <CallCard key={call.id} card={call} />
          ))}
      </Collapse>
      {reminders
        .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
        .map(call => (
          <CallCard key={call.id} card={call} reminder />
        ))}
      {calls
        .sort((a, b) => parseInt(a.timeStarted) - parseInt(b.timeStarted))
        .map(call => (
          <CallCard key={call.id} card={call} />
        ))}
    </div>
  );
};

export default Column;
