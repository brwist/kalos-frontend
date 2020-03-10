import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import CallCard from './CallCard';
import { Event } from '@kalos-core/kalos-rpc/Event/index';

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



type Props = {
  date: string;
  data: Event.AsObject[];
  filters: Filters;
};

const Column = ({ date, data = [], filters }: Props) => {
  const classes = useStyles();
  const [showCompleted, setShowCompleted] = useState(false);

  const {completedCalls, calls, reminders} = data.reduce((acc, call) => {
    if (filters.customers.length) {
      if (!filters.customers.includes(call?.customer?.id)) {
        return acc;
      }
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
    return acc;
  }, { completedCalls: [], calls: [], reminders: []});

  return (
    <div>
      {format(new Date(date), 'MMMM d, yyyy')}
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
