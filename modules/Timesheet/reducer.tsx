import * as jspb from 'google-protobuf';
import { User } from '@kalos-core/kalos-rpc/User/index';
import { TimesheetLine, TimesheetReq } from '@kalos-core/kalos-rpc/TimesheetLine/index';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered/index';
import { addDays, differenceInMinutes, eachDayOfInterval, format } from "date-fns";

type DayData = {
  servicesRenderedList: ServicesRendered.AsObject[],
  timesheetLineList: TimesheetLine.AsObject[],
};

type DataList = {
  [key: string]: DayData,
}

interface EditedEntry extends TimesheetLine.AsObject {
  action: string
};

type EditingState = {
  entry: TimesheetLine.AsObject,
  modalShown: boolean,
  action: 'create' | 'update' | 'convert' | 'delete' | 'approve' | 'reject' | '',
  editedEntries: EditedEntry[],
  hiddenSR: ServicesRendered.AsObject[],
  convertingSR?: ServicesRendered.AsObject,
};

type State = {
  user?: User.AsObject;
  owner?: User.AsObject;
  fetchingTimesheetData: boolean;
  data: DataList;
  selectedDate: Date;
  shownDates: string[];
  payroll: {
    total: number | null,
    billable: number | null,
    unbillable: number | null,
  };
  editing: EditingState;
  error: '';
}

type TimesheetData = {
  getDatesMap(): jspb.Map<string, TimesheetReq>;
};

type Action =
  | { type: 'setUsers', data: {user: User.AsObject, owner: User.AsObject} }
  | { type: 'fetchingTimesheetData' }
  | { type: 'fetchedTimesheetData', data: TimesheetData }
  | { type: 'changeDate', value: Date }
  | { type: 'addNewTimesheet' }
  | { type: 'editTimesheetCard', data: TimesheetLine.AsObject }
  | { type: 'editServicesRenderedCard', data: ServicesRendered.AsObject }
  | { type: 'saveTimecard', data: TimesheetLine.AsObject, action: string }
  | { type: 'closeEditingModal' }
  | { type: 'error', text: string };


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
        owner: action.data.owner
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
      const { data, totalPayroll } = state.shownDates.reduce(({ data, totalPayroll }, date) => {
        const dayData = datesMap.get(date);
        const srList = dayData?.getServicesRenderedList().map(i => i.toObject()) || [];
        const servicesRenderedList = srList.filter((item: ServicesRendered) => !item.hideFromTimesheet && item.status !== 'Completed' && item.status !== 'Incomplete')
        const timesheetLineList = dayData?.getTimesheetLineList().map(i => i.toObject()) || [];

        const payroll = timesheetLineList.reduce((acc, item) => {
          const payrollDiff = differenceInMinutes(new Date(item.timeFinished), new Date(item.timeStarted)) / 60;
          return {
            ...acc,
            billable: item.classCode?.billable ? acc.billable + payrollDiff : acc.billable,
            unbillable: item.classCode?.billable ? acc.unbillable : acc.unbillable + payrollDiff,
            total: acc.total + payrollDiff,
          }
        }, {billable: 0, unbillable: 0, total: 0});

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
        return {data, totalPayroll};
      }, {
        data: [],
        totalPayroll: {
          billable: 0,
          unbillable: 0,
          total: 0
        },
      });

      return {
        ...state,
        data,
        payroll: totalPayroll,
        fetchingTimesheetData: false,
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
        }
      };
    case 'editServicesRenderedCard': {
      const card = action.data;
      const entry = new TimesheetLine().toObject();
      Object.keys(entry).forEach(key => {
        if (card.hasOwnProperty(key)) {
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
      const data = {...state.data};
      const entry = state.editing.entry;
      const card = action.data;
      const entryDate = entry?.timeStarted ? format(new Date(entry.timeStarted), 'yyyy-MM-dd') : '';
      const cardDate = format(new Date(card.timeStarted), 'yyyy-MM-dd');
      const datePresented = state.shownDates.indexOf(cardDate) >= 0;
      if (action.action === 'create' && datePresented) {
        data[cardDate].timesheetLineList.push(card);
      }
      else if (action.action === 'convert') {
        const sr = data[entryDate].servicesRenderedList.find(item => item.id === entry.servicesRenderedId);
        sr.hideFromTimesheet! = 1;
        if (datePresented) {
          data[cardDate].timesheetLineList.push(card);
        }
      } else if (action.action === 'update') {
        if (entryDate === cardDate) {
          const list = data[entryDate].timesheetLineList;
          const existingIndex = list.findIndex(item => item.id === card.id);
          if (existingIndex >= 0) {
            list[existingIndex] = {...list[existingIndex], ...card};
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
    default:
      return state;
  }
};