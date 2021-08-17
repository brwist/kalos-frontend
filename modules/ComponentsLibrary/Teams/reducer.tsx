import React from 'react';
import { State, Action, ACTIONS } from '.';

export const Reducer: React.Reducer<State, Action> = (
  state: State,
  action: Action,
): State => {
  switch (action.type) {
    case ACTIONS.SET_TEAMS:
      return { ...state, teams: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_CREATE_TEAM_MODEL_OPEN:
      return { ...state, createTeamModalOpen: action.payload };
    default:
      console.error(action);
      throw new Error(
        `An invalid action was dispatched to the reducer, logged above.`,
      );
  }
};
