import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import CallCard from './CallCard';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event/index';
import { ENDPOINT } from '../../../constants';
import { useFetchAll } from '../hooks';

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
};

const Column = ({ date }: Props) => {
  const classes = useStyles();
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchCalls = useCallback( async (page) => {
    const reqObj = new Event();
    reqObj.setDateStarted(`${date} 00:00:00%`);
    reqObj.setPageNumber(page);
    return (await eventClient.BatchGet(reqObj)).toObject();
  }, []);

  const { data } = useFetchAll(fetchCalls);

  const completedCalls = data.filter(call => call.logJobStatus === 'Completed');
  const calls = data.filter(call => call.logJobStatus !== 'Completed' && call.color !== 'ffbfbf');
  const reminders = data.filter(call => call.color === 'ffbfbf');

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
