import * as jspb from 'google-protobuf';
import { User } from '@kalos-core/kalos-rpc/User/index';
import {
  TimesheetLine,
  TimesheetReq,
} from '@kalos-core/kalos-rpc/TimesheetLine/index';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered/index';
import {
  addDays,
  differenceInMinutes,
  eachDayOfInterval,
  format,
  parseISO,
} from 'date-fns';

export type Payroll = {
  total: number | null;
  billable: number | null;
  unbillable: number | null;
};

type RawDayData = {
  servicesRenderedList: ServicesRendered.AsObject[];
  timesheetLineList: TimesheetLine.AsObject[];
  getServicesRenderedList: () => ServicesRendered[];
  getTimesheetLineList: () => TimesheetLine[];
};

type DayData = {
  servicesRenderedList: ServicesRendered.AsObject[];
  timesheetLineList: TimesheetLine.AsObject[];
  payroll: Payroll;
};

type DataList = {
  [key: string]: DayData;
};

interface EditedEntry extends TimesheetLine.AsObject {
  action: string;
}

type EditingState = {
  entry: TimesheetLine.AsObject;
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
  hiddenSR: ServicesRendered.AsObject[];
  convertingSR?: ServicesRendered.AsObject;
};

export type State = {
  user?: User.AsObject;
  owner?: User.AsObject;
  fetchingTimesheetData: boolean;
  data: DataList;
  pendingEntries: boolean;
  selectedDate: Date;
  shownDates: string[];
  payroll: {
    total: number | null;
    billable: number | null;
    unbillable: number | null;
  };
  editing: EditingState;
  error: '';
  receiptsIssue: {
    shown: boolean;
    hasReceiptsIssue: boolean;
    receiptsIssueStr: string;
  };
};

type TimesheetData = {
  getDatesMap(): jspb.Map<string, RawDayData>;
};

export type Action =
  | {
      type: 'setUsers';
      data: {
        user: User.AsObject;
        owner: User.AsObject;
        hasReceiptsIssue: boolean;
        receiptsIssueStr: string;
      };
    }
  | { type: 'fetchingTimesheetData' }
  | { type: 'fetchedTimesheetData'; data: TimesheetData }
  | { type: 'changeDate'; value: Date }
  | { type: 'addNewTimesheet' }
  | { type: 'editTimesheetCard'; data: TimesheetLine.AsObject }
  | { type: 'editServicesRenderedCard'; data: ServicesRendered.AsObject }
  | { type: 'saveTimecard'; data: TimesheetLine.AsObject; action: string }
  | { type: 'closeEditingModal' }
  | { type: 'error'; text: string }
  | { type: 'submitTimesheet' }
  | { type: 'approveTimesheet' }
  | { type: 'showReceiptsIssueDialog'; value: boolean };

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
    case 'fetchingTimesheetData': {
      return {
        ...state,
        fetchingTimesheetData: true,
      };
    }
    case 'fetchedTimesheetData': {
      const datesMap = action.data.getDatesMap();
      let pendingEntries = false;
      console.log(datesMap);
      const { data, totalPayroll } = state.shownDates.reduce(
        ({ data, totalPayroll }, date) => {
          console.log(date);
          const dayData = datesMap.get(date);
          const srList =
            dayData?.getServicesRenderedList().map(i => i.toObject()) || [];
          const servicesRenderedList = srList.filter(
            (item: ServicesRendered.AsObject) =>
              !item.hideFromTimesheet &&
              item.status !== 'Completed' &&
              item.status !== 'Incomplete',
          );
          const timesheetLineList =
            dayData?.getTimesheetLineList().map(i => i.toObject()) || [];

          const payroll = timesheetLineList.reduce(
            (acc, item) => {
              if (!item.userApprovalDatetime) {
                pendingEntries = true;
              }
              const payrollDiff =
                differenceInMinutes(
                  parseISO(item.timeFinished),
                  parseISO(item.timeStarted),
                ) / 60;
              return {
                ...acc,
                billable: item.classCode?.billable
                  ? acc.billable + payrollDiff
                  : acc.billable,
                unbillable: item.classCode?.billable
                  ? acc.unbillable
                  : acc.unbillable + payrollDiff,
                total: acc.total + payrollDiff,
              };
            },
            { billable: 0, unbillable: 0, total: 0 },
          );
          // @ts-ignore
          data[date] = {
            servicesRenderedList,
            timesheetLineList,
            payroll: payroll || {},
          };
          totalPayroll = {
            billable: totalPayroll.billable + payroll.billable,
            unbillable: totalPayroll.unbillable + payroll.unbillable,
            total: totalPayroll.total + payroll.total,
          };
          return { data, totalPayroll };
        },
        {
          data: [],
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
          entry: new TimesheetLine().toObject(),
          modalShown: true,
          action: 'create',
        },
      };
    case 'editTimesheetCard':
      return {
        ...state,
        editing: {
          entry: action.data,
          modalShown: true,
          action: 'update',
        },
      };
    case 'editServicesRenderedCard': {
      const card = action.data;
      const entry = new TimesheetLine().toObject();
      Object.keys(entry).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(card, key)) {
          // @ts-ignore
          entry[key] = card[key];
        }
      });
      entry.servicesRenderedId = card.id;
      if (card.status === 'Enroute') {
        entry.classCodeId = 37;
      }

      return {
        ...state,
        editing: {
          modalShown: true,
          entry,
          action: 'convert',
          convertingSR: card,
        },
      };
    }
    case 'saveTimecard': {
      const data = { ...state.data };
      const entry = state.editing.entry;
      const card = action.data;
      const entryDate = entry?.timeStarted
        ? format(parseISO(entry.timeStarted), 'yyyy-MM-dd')
        : '';
      const cardDate = format(parseISO(card.timeStarted), 'yyyy-MM-dd');
      const datePresented = state.shownDates.indexOf(cardDate) >= 0;
      if (action.action === 'create' && datePresented) {
        data[cardDate].timesheetLineList.push(card);
      } else if (action.action === 'convert') {
        const sr = data[entryDate].servicesRenderedList.find(
          item => item.id === entry.servicesRenderedId,
        );
        // @ts-ignore
        sr.hideFromTimesheet = 1;
        if (datePresented) {
          data[cardDate].timesheetLineList.push(card);
        }
      } else if (action.action === 'update') {
        if (entryDate === cardDate) {
          const list = data[entryDate].timesheetLineList;
          const existingIndex = list.findIndex(item => item.id === card.id);
          if (existingIndex >= 0) {
            list[existingIndex] = { ...list[existingIndex], ...card };
          }
        } else {
          const oldList = data[entryDate].timesheetLineList;
          const oldIndex = oldList.findIndex(item => item.id === card.id);
          if (oldIndex >= 0) {
            oldList.splice(oldIndex, 1);
          }
          if (datePresented) {
            data[cardDate].timesheetLineList.push(card);
          }
        }
      } else if (action.action === 'delete') {
        const list = data[entryDate].timesheetLineList;
        const existingIndex = list.findIndex(item => item.id === card.id);
        if (existingIndex >= 0) {
          list.splice(existingIndex, 1);
        }
      }
      return {
        ...state,
        data,
        editing: {
          entry: new TimesheetLine().toObject(),
          modalShown: false,
          action: '',
        },
      };
    }
    case 'submitTimesheet': {
      const data = { ...state.data };
      const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm');
      for (let i = 0; i < state.shownDates.length; i++) {
        let dayList = [...data[state.shownDates[i]].timesheetLineList];
        dayList.forEach(entry => {
          if (!entry.userApprovalDatetime) {
            entry.userApprovalDatetime = dateTime;
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
          if (!entry.adminApprovalDatetime) {
            entry.adminApprovalDatetime = dateTime;
            entry.adminApprovalUserId = state.user!.id;
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
          entry: new TimesheetLine().toObject(),
          modalShown: false,
          action: '',
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

    default:
      return state;
  }
};
