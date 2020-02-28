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
}

type State = {
  calls: Event.AsObject[];
  completedCalls: Event.AsObject[];
  reminders: Event.AsObject[];
  isLoading: boolean;
  showCompleted: boolean;
  totalCount: number,
  fetchedCount: number,
  page: number,
}

type Action =
  | { type: 'toggleShowCompleted' }
  | { type: 'toggleLoading' }
  | { type: 'addData', data: Event.AsObject[], totalCount: number, page: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
  case 'addData': {
    const completedCalls = action.data.filter(call => call.logJobStatus === 'Completed');
    const calls = action.data.filter(call => call.logJobStatus !== 'Completed' && call.color !== 'ffbfbf');
    const reminders = action.data.filter(call => call.color === 'ffbfbf');
    return {
      ...state,
      completedCalls: [...state.completedCalls, ...completedCalls],
      calls: [...state.calls, ...calls],
      reminders: [...state.reminders, ...reminders],
      totalCount: action.totalCount,
      fetchedCount: state.fetchedCount + action.data.length,
      page: action.page,
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
  totalCount: 0,
  fetchedCount: 0,
  page: 0,
};

const Column = ({ date }: Props) => {
  const [
    {
      calls,
      completedCalls,
      reminders,
      showCompleted,
      isLoading,
      fetchedCount,
      totalCount,
      page
    },
    dispatch
  ] = useReducer(reducer, initialState);

  const fetchCalls = (page = 0) => {
    (async () => {
      if (page === 0) {
        dispatch({ type: 'toggleLoading' });
      }
      const reqObj = new Event();
      reqObj.setDateStarted(date);
      reqObj.setPageNumber(page);
      const res = (await eventClient.BatchGet(reqObj)).toObject();
      await dispatch({ type: 'addData', data: res.resultsList, totalCount: res.totalCount, page });
      if (page === 0) {
        dispatch({ type: 'toggleLoading' });
      }
    })();
  };

  useEffect(fetchCalls, []);
  useEffect(() => {
    if(fetchedCount < totalCount) {
      fetchCalls(page + 1);
    }
  }, [fetchedCount]);

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