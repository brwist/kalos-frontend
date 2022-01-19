/* 

  Description: The interface to create a new Trello board from scratch.

  Design Specification / Document: This module should allow for the creation of new Trello
  boards and interface with Trello to assign the owner of the board, set the description, 
  set the title, etc. 
  
*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { reducer, ACTIONS } from './reducer';
import { Devlog } from '@kalos-core/kalos-rpc/Devlog';
import { Board } from '@kalos-core/kalos-rpc/compiled-protos/trello_pb';
import { DevlogClientService, TrelloClientService } from '../../../helpers';
import { format } from 'date-fns';
import { Button } from '../Button';

// add any prop types here
interface props {
  loggedUserId: number;
}

export const CreateTrelloBoard: FC<props> = ({ loggedUserId }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    error: undefined,
  });

  const load = useCallback(() => {
    // RPCs that are in here should be stubbed in the tests at least 9 times out of 10.
    // This ensures that the fake data gets "loaded" instantly and the tests can progress quickly and without RPC errors
    // For some examples, check out /test/modules/Teams or /test/modules/Payroll

    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, []);

  const cleanup = useCallback(() => {
    // TODO clean up your function calls here (called once the component is unmounted, prevents "Can't perform a React state update on an unmounted component" errors)
    // This is important for long-term performance of our components
  }, []);

  const handleCreateBoard = useCallback(async () => {
    // Name: "Test Board", Description: "Testing this out", OrganizationId: "5edf43af38c7c94094cd4279"
    let req = new Board();
    req.setName('Test Board');
    req.setDescription('Testing this out');
    let res = await TrelloClientService.CreateBoard(req);
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
          `An error occurred in CreateTrelloBoard: ${errorToSet}`,
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

  return (
    <>
      <Button label="Create" onClick={() => handleCreateBoard()} />
    </>
  );
};
