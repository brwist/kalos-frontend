/* 

  Description: The documentation for the Trello Slash command bot on our Slack. 

  Design Specification / Document: Slack app: https://api.slack.com/apps/A02SJF64ND7 (you will see "There's been a glitch" if you do not have the correct permissions to view the app)
  
*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { reducer, ACTIONS } from './reducer';
import { Devlog } from '@kalos-core/kalos-rpc/Devlog';
import { DevlogClientService } from '../../../helpers';
import { format } from 'date-fns';

// add any prop types here
interface props {
  loggedUserId: number;
}

export const TrelloSlashCommandDocumentation: FC<props> = ({
  loggedUserId,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    error: undefined,
  });

  const loadCommands = useCallback(async () => {
    // TODO load commands here
  }, [])

  const load = useCallback(async () => {
    await loadCommands();

    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [loadCommands]);

  const cleanup = useCallback(() => {
  }, []);

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
          `An error occurred in TrelloSlashCommandDocumentation: ${errorToSet}`,
        );
        await DevlogClientService.Create(errorLog);
        dispatch({ type: ACTIONS.SET_ERROR, data: errorToSet });
      } catch (err) {
        console.error(`An error occurred while saving a devlog: ${err}`);
      }
    },
    [loggedUserId],
  );

  useEffect(() => {
    if (!state.isLoaded) load();

    return () => {
      cleanup();
    };
  }, [load, cleanup, state.isLoaded]);

  /*
    ! Should be able to get all commands in a request to Core and that should return 
    ! a typed array of objects 
  */
  return <>
  
  </>;
};
