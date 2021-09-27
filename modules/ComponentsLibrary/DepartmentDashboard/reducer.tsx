import React, { useReducer, useEffect, useCallback, FC } from 'react';
import Alert from '@material-ui/lab/Alert';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema, Option } from '../PlainForm';
import { Loader } from '../../Loader/main';
import { Tabs } from '../Tabs';
import {
  UserClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import { OPTION_ALL } from '../../../constants';
import { User } from '@kalos-core/kalos-rpc/User';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';

export type FilterData = {
  departmentId: number;
};
export type State = {
  isLoaded: boolean;
  departments: TimesheetDepartment[];
  filter: FilterData;
  role: string;
  loggedUser: User;
  departmentOptions: Option[];
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_DEPARTMENTS = 'setDepartments',
  SET_FILTER = 'setFilter',
  SET_ROLE = 'setRole',
  SET_LOGGED_USER = 'setLoggedUser',
  SET_DEPARTMENT_OPTIONS = 'setDepartmentOptions',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_DEPARTMENTS; data: TimesheetDepartment[] }
  | { type: ACTIONS.SET_FILTER; data: FilterData }
  | { type: ACTIONS.SET_ROLE; data: string }
  | { type: ACTIONS.SET_DEPARTMENT_OPTIONS; data: Option[] }
  | { type: ACTIONS.SET_LOGGED_USER; data: User };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        isLoaded: action.data,
      };
    }
    case ACTIONS.SET_DEPARTMENTS: {
      return {
        ...state,
        departments: action.data,
      };
    }
    case ACTIONS.SET_FILTER: {
      return {
        ...state,
        filter: action.data,
      };
    }
    case ACTIONS.SET_ROLE: {
      return {
        ...state,
        role: action.data,
      };
    }
    case ACTIONS.SET_LOGGED_USER: {
      return {
        ...state,
        loggedUser: action.data,
      };
    }
    case ACTIONS.SET_DEPARTMENT_OPTIONS: {
      return {
        ...state,
        departmentOptions: action.data,
      };
    }
    default:
      return state;
  }
};
