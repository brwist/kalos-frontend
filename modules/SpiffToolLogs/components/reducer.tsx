import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { TaskClient, Task } from '../../@kalos-core/kalos-rpc/Task';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FlagIcon from '@material-ui/icons/Flag';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { Option } from '../../ComponentsLibrary/Field';
import { Link } from '../../ComponentsLibrary/Link';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { PlainForm } from '../../ComponentsLibrary/PlainForm';
import { Confirm } from '../../ComponentsLibrary/Confirm';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import {
  SpiffToolLogEdit,
  getStatusFormInit,
} from '../../ComponentsLibrary/SpiffToolLogEdit';
import { ServiceCall } from '../../ComponentsLibrary/ServiceCall';
import { SpiffToolAdminAction } from '../../../@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { User } from '../../../@kalos-core/kalos-rpc/User';
import { SpiffType, TaskEventData } from '../../../@kalos-core/kalos-rpc/Task';

import {
  getRPCFields,
  timestamp,
  formatDate,
  makeFakeRows,
  trailingZero,
  getWeekOptions,
  escapeText,
  formatDay,
  makeLast12MonthsOptions,
  UserClientService,
  formatWeek,
  EventClientService,
  makeSafeFormObject,
} from '../../../helpers';
import { ENDPOINT, ROWS_PER_PAGE, OPTION_ALL } from '../../../constants';
import { Event } from '../../@kalos-core/kalos-rpc/Event';
import { Payroll, RoleType } from '../../ComponentsLibrary/Payroll';
import { PropLinkServiceClient } from '../../@kalos-core/kalos-rpc/compiled-protos/prop_link_pb_service';
import { PermissionGroup } from '../../@kalos-core/kalos-rpc/compiled-protos/user_pb';

type SearchType = {
  description: string;
  month: string;
  kind: string;
  technician: number;
};
export type State = {
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  editing: Task;
  deleting: Task;
  extendedEditing: Task;
  loggedInUser: User;
  entries: Task[];
  count: number;
  departments: PermissionGroup[];
  page: number;
  searchForm: SearchType;
  searchFormKey: number;
  technicians: User[];
  loadedTechnicians: boolean;
  spiffTypes: SpiffType[];
  payrollOpen: boolean;
  userRole: RoleType;
  pendingPayroll: Task;
  pendingPayrollReject: Task;
  pendingAudit: Task;
  pendingAdd: boolean;
  serviceCallEditing: TaskEventData;
  unlinkedSpiffJobNumber: string;
  statusEditing: SpiffToolAdminAction;
};

export enum ACTIONS {
  SET_LOADING = 'setLoading',
}

export type Action = { type: ACTIONS.SET_LOADING; data: boolean };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING: {
      console.log('setting loading');
      return {
        ...state,
        loading: action.data,
      };
    }
    default:
      return state;
  }
};
