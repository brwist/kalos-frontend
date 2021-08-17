import React from 'react';
import { State, Action } from '.';

export const Reducer: React.Reducer<State, Action> = (
  state: State,
  action: Action,
): State => {
  switch (action.type) {
    case 'set-teams':
      return { ...state, teams: action.payload };
    case 'set-loading':
      return { ...state, loading: action.payload };
    case 'set-create-team-model-open':
      return { ...state, createTeamModalOpen: action.payload };
    default:
      console.error(action);
      throw new Error(
        `An invalid action was dispatched to the reducer, logged above.`,
      );
  }
};
