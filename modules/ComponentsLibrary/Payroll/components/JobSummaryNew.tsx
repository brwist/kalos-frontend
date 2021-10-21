import React, {
  FC,
  useState,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import {
  TimesheetLine,
  TimesheetLineClient,
  TimesheetLineList,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { ENDPOINT, NULL_TIME } from '../../../../constants';
import { Button } from '../../Button';
import { SectionBar } from '../../SectionBar';
import { InfoTable } from '../../InfoTable';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { User } from '@kalos-core/kalos-rpc/User';
import Alert from '@material-ui/lab/Alert';
import { PlainForm, Schema, Option } from '../../PlainForm';
import { CostReportCSV } from '../../CostReportCSV';
import { format, differenceInMinutes, parseISO, addDays } from 'date-fns';
import { OPTION_ALL } from '../../../../constants';
import {
  roundNumber,
  makeFakeRows,
  getWeekOptions,
  UserClientService,
  downloadCSV,
  timestamp,
  formatWeek,
} from '../../../../helpers';
import { Loader } from '../../../Loader/main';
import { FilterList } from '@material-ui/icons';
export type FilterData = {
  jobNumber: number;
};
interface Props {
  loggedUserId: number;
  onClose: () => void;
}
export type Action = {
  time: number;
  day: string;
};
export type Job = {
  jobId: string;
  actions: Action[];
};
export type WeekForEmployee = {
  employeeId: number;
  username: string;
  week: Day[];
};
export type Day = {
  date: string;
  workHours: number;
  travelHours: number;
};
type State = {
  downloadButton: boolean;
  downloadFullButton: boolean;
};

type ActionType =
  | { type: 'setDownloadButton'; value: boolean }
  | { type: 'setDownloadFullButton'; value: boolean };

const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case 'setDownloadButton':
      return {
        ...state,
        downloadButton: action.value,
      };
    case 'setDownloadFullButton':
      return {
        ...state,
        downloadFullButton: action.value,
      };
    default:
      return state;
  }
};
export const JobSummaryNew: FC<Props> = ({ loggedUserId, onClose }) => {
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(true);

  const [filter, setFilter] = useState<FilterData>({
    jobNumber: 0,
  });

  const handleSetFilter = (d: FilterData) => {
    if (!d.jobNumber || d.jobNumber == 0) {
      d.jobNumber = 0;
    } else {
      setOpenReport(true);
    }
    setFilter(d);
  };
  useEffect(() => {}, []);

  const SCHEMA: Schema<FilterData> = [
    [
      {
        name: 'jobNumber',
        label: 'Job Number',
        type: 'eventId',
      },
    ],
  ];
  return loaded ? (
    <SectionBar key="title" title={`Job Summary`} uncollapsable={true}>
      <PlainForm
        key="costReportFilter"
        data={filter}
        onChange={handleSetFilter}
        schema={SCHEMA}
        className="PayrollFilter"
      />

      {openReport && filter.jobNumber != 0 && (
        <CostReportCSV
          key="CostReport"
          serviceCallId={filter.jobNumber}
          loggedUserId={loggedUserId}
        ></CostReportCSV>
      )}
      <Button label={'Close'} onClick={() => onClose()}></Button>
    </SectionBar>
  ) : (
    <Loader />
  );
};
