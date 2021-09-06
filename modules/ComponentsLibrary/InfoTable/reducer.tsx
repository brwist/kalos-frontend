import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { User } from '@kalos-core/kalos-rpc/User';
import React from 'react';
import { Modes } from '.';

export type State = {
  isAddingRow: boolean; // True when a row is being added via the Add New Row button
  mode: Modes;
  technicians: User[] | undefined;
  departments: TimesheetDepartment[] | undefined;
};

export enum ACTIONS {
  SET_IS_ADDING_ROW = 'set-is-adding-row',
  SET_MODE = 'set-editing',
  SET_TECHNICIANS = 'set-technicians',
  SET_DEPARTMENTS = 'set-departments',
}

export type Action =
  | {
      type: ACTIONS.SET_IS_ADDING_ROW;
      payload: boolean;
    }
  | {
      type: ACTIONS.SET_MODE;
      payload: Modes;
    }
  | {
      type: ACTIONS.SET_TECHNICIANS;
      payload: User[];
    }
  | {
      type: ACTIONS.SET_DEPARTMENTS;
      payload: TimesheetDepartment[];
    };

export const Reducer: React.Reducer<State, Action> = (
  state: State,
  action: Action,
) => {
  switch (action.type) {
    case ACTIONS.SET_IS_ADDING_ROW:
      console.log('Setting is adding row', action.payload);
      return { ...state, isAddingRow: action.payload };
    case ACTIONS.SET_MODE:
      console.log('Setting editing', action.payload);
      return { ...state, mode: action.payload };
    case ACTIONS.SET_TECHNICIANS:
      console.log('Setting technicians', action.payload);
      return { ...state, technicians: action.payload };
    case ACTIONS.SET_DEPARTMENTS:
      console.log('Setting departments: ', action.payload);
      return { ...state, departments: action.payload };
    default:
      console.error('Unexpected type passed to the reducer function.');
      return { ...state };
  }
};
