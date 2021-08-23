import React from 'react';

export type State = {
  isAddingRow: boolean; // True when a row is being added via the Add New Row button
};

export enum ACTIONS {
  SET_IS_ADDING_ROW = 'set-is-adding-row',
}

export type Action = {
  type: ACTIONS.SET_IS_ADDING_ROW;
  payload: boolean;
};

export const Reducer: React.Reducer<State, Action> = (
  state: State,
  action: Action,
) => {
  switch (action.type) {
    case ACTIONS.SET_IS_ADDING_ROW:
      console.log('Adding row');
      return { ...state, isAddingRow: action.payload };
  }
};
