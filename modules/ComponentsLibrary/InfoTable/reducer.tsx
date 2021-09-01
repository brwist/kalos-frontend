import React from 'react';
import { Modes } from '.';

export type State = {
  isAddingRow: boolean; // True when a row is being added via the Add New Row button
  mode: Modes;
};

export enum ACTIONS {
  SET_IS_ADDING_ROW = 'set-is-adding-row',
  SET_MODE = 'set-editing',
}

export type Action =
  | {
      type: ACTIONS.SET_IS_ADDING_ROW;
      payload: boolean;
    }
  | {
      type: ACTIONS.SET_MODE;
      payload: Modes;
    };

export const Reducer: React.Reducer<State, Action> = (
  state: State,
  action: Action,
) => {
  switch (action.type) {
    case ACTIONS.SET_IS_ADDING_ROW:
      console.log('Adding row');
      return { ...state, isAddingRow: action.payload };
    case ACTIONS.SET_MODE:
      console.log('Setting editing');
      return { ...state, mode: action.payload };
    default:
      console.error('Unexpected type passed to the reducer function.');
      return { ...state };
  }
};
