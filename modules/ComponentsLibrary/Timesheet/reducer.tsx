import * as jspb from 'google-protobuf';
import { User } from '../../../@kalos-core/kalos-rpc/User/index';
import {
  TimesheetLine,
  Timesheet,
} from '../../../@kalos-core/kalos-rpc/TimesheetLine/index';
import { ServicesRendered } from '../../../@kalos-core/kalos-rpc/ServicesRendered/index';
import {
  addDays,
  differenceInMinutes,
  eachDayOfInterval,
  format,
  parseISO,
} from 'date-fns';
import { TimeoffRequestTypes } from '../../../helpers';
import { NULL_TIME_VALUE } from './constants';
import { TimeoffRequest } from '../../../@kalos-core/kalos-rpc/TimeoffRequest';

export type Payroll = {
  total: number | null;
  billable: number | null;
  unbillable: number | null;
};
export type FilterData = {
  week: string;
};
type RawDayData = {
  servicesRenderedList: ServicesRendered[];
  timesheetLineList: TimesheetLine[];
  getServicesRenderedList: () => ServicesRendered[];
  getTimesheetLineList: () => TimesheetLine[];
};

type DayData = {
  servicesRenderedList: ServicesRendered[];
  timesheetLineList: TimesheetLine[];
  payroll: Payroll;
  timeoffs: TimeoffRequest[];
};

export type DataList = {
  [key: string]: DayData;
};

interface EditedEntry extends TimesheetLine {
  action: string;
}

type EditingState = {
  entry: TimesheetLine;
  modalShown: boolean;
  action:
    | 'create'
    | 'update'
    | 'convert'
    | 'delete'
    | 'approve'
    | 'reject'
    | '';
  editedEntries: EditedEntry[];
  hiddenSR: ServicesRendered[];
  convertingSR?: ServicesRendered;
};

export type State = {
  user?: User;
  owner?: User;
  fetchingTimesheetData: boolean;
  data: DataList;
  timeoffOpen: boolean;
  tripsOpen: boolean;
  perDiemRowId: number[] | null;
  pendingEntries: boolean;
  selectedDate: Date;
  timeoffRequestTypes: TimeoffRequestTypes | undefined;
  shownDates: string[];
  payroll: {
    total: number | null;
    billable: number | null;
    unbillable: number | null;
  };
  editing: EditingState;
  error: string;
  receiptsIssue: {
    shown: boolean;
    hasReceiptsIssue: boolean;
    receiptsIssueStr: string;
  };
};

export type TimesheetData = {
  getDatesMap(): jspb.Map<string, RawDayData>;
};

export type Action =
  | {
      type: 'setUsers';
      data: {
        user: User;
        owner: User;
        hasReceiptsIssue: boolean;
        receiptsIssueStr: string;
      };
    }
  | { type: 'fetchingTimesheetData' }
  | {
      type: 'fetchedTimesheetData';
      data: Timesheet;
      timeoffs: TimeoffRequest[];
    }
  | { type: 'changeDate'; value: Date }
  | { type: 'addNewTimesheet' }
  | { type: 'editTimesheetCard'; data: TimesheetLine }
  | { type: 'editServicesRenderedCard'; data: ServicesRendered }
  | { type: 'saveTimecard'; data: TimesheetLine; action: string }
  | { type: 'closeEditingModal' }
  | { type: 'error'; text: string }
  | { type: 'submitTimesheet' }
  | { type: 'timeoffOpen'; value: boolean }
  | { type: 'tripsOpen'; value: boolean }
  | { type: 'setPersonalReportOpen'; value: boolean }
  | { type: 'timeoffRequestTypes'; value: TimeoffRequestTypes }
  | { type: 'perDiemRowId'; value: number[] }
  | { type: 'approveTimesheet' }
  | { type: 'processTimesheet' }
  | { type: 'rejectTimesheet' }
  | { type: 'denyTimesheet' }
  | { type: 'showReceiptsIssueDialog'; value: boolean }
  | {
      type: 'setReceiptsIssue';
      data: { hasReceiptsIssue: boolean; receiptsIssueStr: string };
    };

export const getShownDates = (date: Date): string[] => {
  const firstDay = date;
  const lastDay = addDays(firstDay, 6);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  return days.map(date => format(date, 'yyyy-MM-dd'));
};

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setUsers': {
      return {
        ...state,
        user: action.data.user,
        owner: action.data.owner,
        receiptsIssue: {
          shown: false,
          hasReceiptsIssue: action.data.hasReceiptsIssue,
          receiptsIssueStr: action.data.receiptsIssueStr,
        },
      };
    }
    case 'setReceiptsIssue': {
      return {
        ...state,
        receiptsIssue: {
          shown: false,
          hasReceiptsIssue: action.data.hasReceiptsIssue,
          receiptsIssueStr: action.data.receiptsIssueStr,
        },
      };
    }
    case 'fetchingTimesheetData': {
      return {
        ...state,
        fetchingTimesheetData: true,
      };
    }
    case 'fetchedTimesheetData': {
      const datesMap = action.data.getDatesMap();
      let pendingEntries = false;
      const { timeoffs } = action;
      const { data, totalPayroll } = state.shownDates.reduce(
        ({ data, totalPayroll }, date) => {
          const dayData = datesMap.get(date);
          const srList = dayData?.getServicesRenderedList() || [];
          const servicesRenderedList = srList.filter(
            (item: ServicesRendered) =>
              !item.getHideFromTimesheet() &&
              item.getStatus() !== 'Completed' &&
              item.getStatus() !== 'Incomplete',
          );
          const timesheetLineList =
            dayData
              ?.getTimesheetLineList()
              .sort((a, b) =>
                a.getTimeStarted() > b.getTimeStarted() ? 1 : -1,
              ) || [];
          const payroll = timesheetLineList.reduce(
            (acc, item) => {
              if (item.getUserApprovalDatetime() === NULL_TIME_VALUE) {
                pendingEntries = true;
              }
              const payrollDiff =
                differenceInMinutes(
                  parseISO(item.getTimeFinished()),
                  parseISO(item.getTimeStarted()),
                ) / 60;
              return {
                ...acc,
                billable: item.getClassCode()?.getBillable()
                  ? acc.billable + payrollDiff
                  : acc.billable,
                unbillable: item.getClassCode()?.getBillable()
                  ? acc.unbillable
                  : acc.unbillable + payrollDiff,
                total: acc.total + payrollDiff,
              };
            },
            { billable: 0, unbillable: 0, total: 0 },
          );
          data[date] = {
            servicesRenderedList,
            timesheetLineList,
            payroll: payroll || {},
            timeoffs: timeoffs.filter(
              to => to.getTimeStarted().substr(0, 10) === date,
            ),
          };
          totalPayroll = {
            billable: totalPayroll.billable + payroll.billable,
            unbillable: totalPayroll.unbillable + payroll.unbillable,
            total: totalPayroll.total + payroll.total,
          };
          return { data, totalPayroll };
        },
        {
          data: {} as DataList,
          totalPayroll: {
            billable: 0,
            unbillable: 0,
            total: 0,
          },
        },
      );

      return {
        ...state,
        data,
        payroll: totalPayroll,
        fetchingTimesheetData: false,
        pendingEntries,
      };
    }
    case 'changeDate':
      return {
        ...state,
        selectedDate: action.value,
        shownDates: getShownDates(action.value),
      };
    case 'addNewTimesheet':
      return {
        ...state,
        editing: {
          ...state.editing,
          entry: new TimesheetLine(),
          modalShown: true,
          action: 'create' as 'create',
        },
      };
    case 'editTimesheetCard':
      return {
        ...state,
        editing: {
          ...state.editing,
          entry: action.data,
          modalShown: true,
          action: 'update' as 'update',
        },
      };
    case 'editServicesRenderedCard': {
      const card = action.data;
      const entry = new TimesheetLine();
      Object.keys(entry).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(card, key)) {
          // @ts-ignore
          entry[key] = card[key];
        }
      });
      entry.setServicesRenderedId(card.getId());
      if (card.getStatus() === 'Enroute') {
        entry.setClassCodeId(37);
      }

      return {
        ...state,
        editing: {
          ...state.editing,
          modalShown: true,
          entry,
          action: 'convert' as 'convert',
          convertingSR: card,
        },
      };
    }
    case 'saveTimecard': {
      const data = { ...state.data };
      const entry = state.editing.entry;
      const card = action.data;
      const entryDate = entry?.getTimeStarted()
        ? format(parseISO(entry.getTimeStarted()), 'yyyy-MM-dd')
        : '';
      const cardDate = format(parseISO(card.getTimeStarted()), 'yyyy-MM-dd');
      const datePresented = state.shownDates.indexOf(cardDate) >= 0;
      if (action.action === 'create' && datePresented) {
        data[cardDate].timesheetLineList.push(card);
      } else if (action.action === 'convert') {
        const sr = data[entryDate].servicesRenderedList.find(
          item => item.getId() === entry.getServicesRenderedId(),
        );
        // @ts-ignore
        sr.hideFromTimesheet = 1;
        if (datePresented) {
          data[cardDate].timesheetLineList.push(card);
        }
      } else if (action.action === 'update') {
        if (entryDate === cardDate) {
          const list = data[entryDate].timesheetLineList;
          const existingIndex = list.findIndex(
            item => item.getId() === card.getId(),
          );
          if (existingIndex >= 0) {
            //list[existingIndex] = { ...list[existingIndex], ...card };
            list[existingIndex] = card;
          }
        } else {
          const oldList = data[entryDate].timesheetLineList;
          const oldIndex = oldList.findIndex(
            item => item.getId() === card.getId(),
          );
          if (oldIndex >= 0) {
            oldList.splice(oldIndex, 1);
          }
          if (datePresented) {
            data[cardDate].timesheetLineList.push(card);
          }
        }
      } else if (action.action === 'delete') {
        const list = data[entryDate].timesheetLineList;
        const existingIndex = list.findIndex(
          item => item.getId() === card.getId(),
        );
        if (existingIndex >= 0) {
          list.splice(existingIndex, 1);
        }
      }
      return {
        ...state,
        data,
        editing: {
          entry: new TimesheetLine(),
          modalShown: false,
          action: '' as '',
          editedEntries: [],
          hiddenSR: [],
        },
      };
    }
    case 'submitTimesheet': {
      const data = { ...state.data };
      const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm');
      for (let i = 0; i < state.shownDates.length; i++) {
        let dayList = [...data[state.shownDates[i]].timesheetLineList];
        dayList.forEach(entry => {
          if (entry.getUserApprovalDatetime() === NULL_TIME_VALUE) {
            entry.setUserApprovalDatetime(dateTime);
          }
        });
      }
      return {
        ...state,
        data,
      };
    }

    case 'approveTimesheet': {
      const data = { ...state.data };
      const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm');
      for (let i = 0; i < state.shownDates.length; i++) {
        let dayList = [...data[state.shownDates[i]].timesheetLineList];
        dayList.forEach(entry => {
          if (entry.getAdminApprovalDatetime() === NULL_TIME_VALUE) {
            entry.setAdminApprovalDatetime(dateTime);
            entry.setAdminApprovalUserId(state.user!.getId());
          }
        });
      }
      return {
        ...state,
        data,
      };
    }
    case 'processTimesheet': {
      const data = { ...state.data };
      const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm');
      for (let i = 0; i < state.shownDates.length; i++) {
        let dayList = [...data[state.shownDates[i]].timesheetLineList];
        dayList.forEach(entry => {
          if (entry.getAdminApprovalDatetime() !== NULL_TIME_VALUE) {
            entry.setPayrollProcessed(true);
          }
        });
      }
      return {
        ...state,
        data,
      };
    }
    case 'rejectTimesheet': {
      const data = { ...state.data };
      const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm');
      for (let i = 0; i < state.shownDates.length; i++) {
        let dayList = [...data[state.shownDates[i]].timesheetLineList];
        dayList.forEach(entry => {
          if (entry.getAdminApprovalDatetime() !== NULL_TIME_VALUE) {
            entry.setAdminApprovalUserId(0);
            entry.setAdminApprovalDatetime(NULL_TIME_VALUE);
          }
        });
      }
      return {
        ...state,
        data,
      };
    }
    case 'denyTimesheet': {
      const data = { ...state.data };
      const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm');
      for (let i = 0; i < state.shownDates.length; i++) {
        let dayList = [...data[state.shownDates[i]].timesheetLineList];
        dayList.forEach(entry => {
          if (entry.getUserApprovalDatetime() !== NULL_TIME_VALUE) {
            entry.setUserApprovalDatetime(NULL_TIME_VALUE);
          }
        });
      }
      return {
        ...state,
        data,
      };
    }
    case 'closeEditingModal':
      return {
        ...state,
        editing: {
          entry: new TimesheetLine(),
          modalShown: false,
          action: '' as '',
          hiddenSR: [],
          editedEntries: [],
        },
      };
    case 'error': {
      return {
        ...state,
        error: action?.text || '',
      };
    }

    case 'showReceiptsIssueDialog':
      return {
        ...state,
        receiptsIssue: {
          ...state.receiptsIssue,
          shown: action.value,
        },
      };
    case 'timeoffOpen':
      return {
        ...state,
        timeoffOpen: action.value,
      };
    case 'tripsOpen':
      return {
        ...state,
        tripsOpen: action.value,
      };
    case 'setPersonalReportOpen':
      return {
        ...state,
        personalReportOpen: action.value,
      };
    case 'perDiemRowId':
      return {
        ...state,
        perDiemRowId: action.value,
      };
    case 'timeoffRequestTypes':
      return {
        ...state,
        timeoffRequestTypes: action.value,
      };
    default:
      return state;
  }
};
