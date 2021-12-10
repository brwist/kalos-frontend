/* 

  Description: The logs for service calls (to replace admin:service.viewlogs)

  Design Specification / Document: admin:service.viewlogs
  
*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { reducer, ACTIONS } from './reducer';
import { Devlog } from '@kalos-core/kalos-rpc/Devlog';
import {
  ActivityLogClientService,
  DevlogClientService,
} from '../../../helpers';
import { format } from 'date-fns';
import Typography from '@material-ui/core/Typography';
import { SectionBar } from '../SectionBar';
import { Loader } from '../../Loader/main';
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import { Alert } from '../Alert';

// add any prop types here
interface props {
  loggedUserId: number;
  eventId: number;
}

export const ServiceCallLogs: FC<props> = ({ loggedUserId, eventId }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    error: undefined,
    activityLogs: undefined,
  });

  const handleError = useCallback(
    async (errorToSet: string) => {
      // This will send out an error devlog automatically when called
      // The idea is that this will be used for any errors which we should be able to look up for debugging

      try {
        let errorLog = new Devlog();
        errorLog.setUserId(loggedUserId);
        errorLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        errorLog.setIsError(1);
        errorLog.setDescription(
          `An error occurred in ServiceCallLogs: ${errorToSet}`,
        );
        await DevlogClientService.Create(errorLog);
        dispatch({ type: ACTIONS.SET_ERROR, data: errorToSet });
      } catch (err) {
        console.error(`An error occurred while saving a devlog: ${err}`);
      }
    },
    [loggedUserId],
  );

  const loadActivityLogs = useCallback(async () => {
    try {
      let req = new ActivityLog();
      req.setEventId(eventId);
      const res = await ActivityLogClientService.BatchGet(req);
      dispatch({ type: ACTIONS.SET_ACTIVITY_LOGS, data: res.getResultsList() });
    } catch (err) {
      console.error(`An error occurred while getting activity logs: ${err}`);
      dispatch({
        type: ACTIONS.SET_ERROR,
        data: `An error occurred while getting activity logs: ${err}`,
      });
      dispatch({ type: ACTIONS.SET_LOADED, data: true });

      await handleError(`${err}`);
    }
  }, [eventId, handleError]);

  const load = useCallback(async () => {
    await loadActivityLogs();

    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [loadActivityLogs]);

  const cleanup = useCallback(() => {
    // TODO clean up your function calls here (called once the component is unmounted, prevents "Can't perform a React state update on an unmounted component" errors)
    // This is important for long-term performance of our components
  }, []);

  useEffect(() => {
    if (!state.isLoaded) load();

    return () => {
      cleanup();
    };
  }, [load, cleanup, state.isLoaded]);

  return (
    <>
      <SectionBar title={`Service Call Logs of Event ID: ${eventId}`}>
        {!state.activityLogs && <Loader />}
        {state.activityLogs && state.activityLogs.length === 0 && (
          <Typography>No activity logs found for this event.</Typography>
        )}
        <Alert
          open={state.error !== undefined}
          onClose={() => dispatch({ type: ACTIONS.SET_ERROR, data: undefined })}
          title="Error"
        >
          {state.error}
        </Alert>
      </SectionBar>
    </>
  );
};
