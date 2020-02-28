import React, { useReducer, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import CallCard from './CallCard';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event/index';
import { ENDPOINT } from '../../../constants';

const eventClient = new EventClient(ENDPOINT);

type Props = {
  date: string,
  eventClient: EventClient,
}

type State = {
  calls: Event.AsObject[];
  completedCalls: Event.AsObject[];
  reminders: Event.AsObject[];
  isLoading: boolean;
  showCompleted: boolean;
}

type Action =
  | { type: 'toggleShowCompleted' }
  | { type: 'toggleLoading' }
  | { type: 'addData', data: Event.AsObject[] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
  case 'addData': {
    console.log(action.data);
    const completedCalls = action.data.filter(call => call.logJobStatus === 'Completed');
    const calls = action.data.filter(call => call.logJobStatus !== 'Completed' && call.color !== 'ffbfbf');
    const reminders = action.data.filter(call => call.color === 'ffbfbf');
    console.log(state)
    return {
      ...state,
      completedCalls: [...state.completedCalls, ...completedCalls],
      calls: [...state.calls, ...calls],
      reminders: [...state.reminders, ...reminders],
    };
  }
  case 'toggleShowCompleted': {
    return {
      ...state,
      showCompleted: !state.showCompleted,
    };
  }
  case 'toggleLoading': {
    return {
      ...state,
      isLoading: !state.isLoading,
    };
  }
  default: 
    return {...state};
  }
};

const initialState: State = {
  isLoading: false,
  showCompleted: false,
  calls: [],
  completedCalls: [],
  reminders: [],
};

const Column = ({ date }: Props) => {
  const [{calls, completedCalls, reminders, showCompleted, isLoading}, dispatch] = useReducer(reducer, initialState);
  const fetchCalls = (page = 0) => {
    (async () => {
      if (page === 0) {
        await dispatch({ type: 'toggleLoading' });
      }
      const reqObj = new Event();
      reqObj.setDateStarted(date);
      reqObj.setPageNumber(page);
      const res = (await eventClient.BatchGet(reqObj)).toObject();
      await dispatch({ type: 'addData', data: res.resultsList });
      await dispatch({ type: 'toggleLoading'});
      /*if ((calls.length + completedCalls.length + reminders.length) !== res.totalCount) {
        page = page + 1;
        await fetchCalls(page);
      } else {
        await dispatch({ type: 'toggleLoading'});
      }*/
    })();
  };

  useEffect(fetchCalls, []);

  if (isLoading) {
    return null;
  }

  return (
    <>
      {!!completedCalls.length && (
        <IconButton
          /*className={clsx(classes.expand, {
        [classes.expandOpen]: expanded,
      })}*/
          onClick={() => dispatch({ type: 'toggleShowCompleted' })}
          aria-expanded={showCompleted}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
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
    </>
  );
};

export default Column;