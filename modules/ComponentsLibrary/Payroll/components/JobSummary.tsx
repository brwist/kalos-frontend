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
import Alert from '@material-ui/lab/Alert';
import { PlainForm, Schema, Option } from '../../PlainForm';
import { User } from '@kalos-core/kalos-rpc/User';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import {
  format,
  differenceInMinutes,
  parseISO,
  differenceInCalendarDays,
  startOfWeek,
  subDays,
  addDays,
} from 'date-fns';
import { OPTION_ALL } from '../../../../constants';
import {
  roundNumber,
  makeFakeRows,
  getWeekOptions,
  UserClientService,
  downloadCSV,
  timestamp,
} from '../../../../helpers';
import { Loader } from '../../../Loader/main';
export type FilterData = {
  jobNumber: number;
  week: string;
};
interface Props {
  employees: User[];
  departments: TimesheetDepartment[];
  onClose: () => void;
}
export type Action = {
  time: number;
  userName: string;
  billable: boolean;
  departmentCode: string;
  day: string;
};
export type Job = {
  jobId: string;
  actions: Action[];
};
type State = {
  downloadButton: boolean;
};

type ActionType = { type: 'setDownloadButton'; value: boolean };

const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case 'setDownloadButton':
      return {
        ...state,
        downloadButton: action.value,
      };
    default:
      return state;
  }
};
export const JobSummary: FC<Props> = ({ employees, departments, onClose }) => {
  const [state, dispatch] = useReducer(reducer, {
    downloadButton: true,
  });
  const [timesheets, setTimesheets] = useState<TimesheetLine[]>();
  const [timesheetsJobs, setTimesheetsJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const weekOptions = useMemo(
    () => [
      { label: OPTION_ALL, value: OPTION_ALL },
      ...getWeekOptions(52, 0, -1),
    ],
    [],
  );
  const [filter, setFilter] = useState<FilterData>({
    jobNumber: 0,
    week: OPTION_ALL,
  });
  const handleSelectNewWeek = useCallback(async dateString => {
    console.log(dateString);
  }, []);
  const formatDateFns = (date: Date) => format(date, 'yyyy-MM-dd');
  const SCHEMA: Schema<FilterData> = [
    [
      {
        name: 'jobNumber',
        label: 'Job Number',
        type: 'eventId',
      },
      {
        name: 'week' as const,
        label: 'Select Week',
        options: weekOptions,
        onChange: async (date: React.ReactText) => handleSelectNewWeek(date),
      },
    ],
  ];
  const getTimesheetTotals = useCallback(async () => {
    if (filter.week != OPTION_ALL && filter.jobNumber != 0) {
      dispatch({ type: 'setDownloadButton', value: false });
      const timesheetReq = new TimesheetLine();
      //Add reference number
      timesheetReq.setIsActive(1);
      timesheetReq.setWithoutLimit(true);
      timesheetReq.setReferenceNumber(filter.jobNumber.toString());
      const endDate = formatDateFns(addDays(new Date(filter.week), 7));
      timesheetReq.setDateRangeList(['>=', filter.week, '<', endDate]);
      const client = new TimesheetLineClient(ENDPOINT);

      let results = (await client.BatchGet(timesheetReq)).getResultsList();
      let tempJobs = [];
      for (let i = 0; i < results.length; i++) {
        if (
          !results[i].toObject().referenceNumber.includes('PTO') &&
          !results[i].toObject().briefDescription.includes('PTO')
        ) {
          let tempJob = {
            jobId:
              results[i].toObject().eventId === 0
                ? results[i].toObject().referenceNumber === ''
                  ? 'None'
                  : results[i].toObject().referenceNumber
                : results[i].toObject().eventId.toString(),
            actions: [
              {
                time: roundNumber(
                  differenceInMinutes(
                    parseISO(results[i].toObject().timeFinished),
                    parseISO(results[i].toObject().timeStarted),
                  ) / 60,
                ),

                billable: results[i].toObject().classCode!.billable,
                day: format(
                  parseISO(results[i].toObject().timeStarted),
                  'yyyy-MM-dd',
                ),
                departmentCode: results[i].toObject().departmentName,
                userName: results[i].getTechnicianUserName(),
              },
            ],
          };

          tempJobs.push(tempJob);
        }
      }
      let completeEmployeeListOfHours = [];
      for (let j = 0; j < tempJobs.length; j++) {
        if (completeEmployeeListOfHours.length > 0) {
          for (let l = 0; l < completeEmployeeListOfHours.length; l++) {
            if (
              tempJobs[j].actions[0].userName ===
              completeEmployeeListOfHours[l].actions[0].userName
            ) {
              completeEmployeeListOfHours[l].actions[0].time +=
                tempJobs[j].actions[0].time;
              break;
            } else {
              completeEmployeeListOfHours.push(tempJobs[j]);
              break;
            }
          }
        } else {
          completeEmployeeListOfHours.push(tempJobs[j]);
        }
      }
      setTimesheets(results);
      setLoaded(true);
      setLoading(false);
      return completeEmployeeListOfHours;
    } else {
      dispatch({ type: 'setDownloadButton', value: true });
      setLoaded(true);
      setLoading(false);
      setTimesheets([]);
      return [];
    }
  }, [filter.jobNumber, filter.week]);
  const downloadReport = () => {
    if (timesheetsJobs) {
      let fullString = 'Employee,Hours,Job Number' + `\r\n`;
      for (let i = 0; i < timesheetsJobs.length; i++) {
        let tempString =
          timesheetsJobs[i].actions[0].userName +
          ',' +
          timesheetsJobs[i].actions[0].time +
          ',' +
          timesheetsJobs[i].jobId +
          `\r\n`;
        fullString = fullString + tempString;
      }

      downloadCSV(timestamp(), fullString);
    }
  };
  const load = useCallback(async () => {
    setTimesheetsJobs(await getTimesheetTotals());
  }, [getTimesheetTotals]);

  const handleSetFilter = (d: FilterData) => {
    if (!d.week) {
      d.week = OPTION_ALL;
    }
    if (!d.jobNumber) {
      d.jobNumber = 0;
    }

    setFilter(d);
    setLoading(true);
    // {departmentId: 18, week: undefined, employeeId: undefined}
  };
  useEffect(() => {
    if (loading) {
      load();
    }
  }, [load, loading, filter.jobNumber, filter.week]);
  return loaded ? (
    <SectionBar key="title" title={`Job Summary`} uncollapsable={true}>
      <PlainForm
        data={filter}
        onChange={handleSetFilter}
        schema={SCHEMA}
        className="PayrollFilter"
      />
      <InfoTable
        columns={[
          { name: 'Employee' },
          { name: ' Hours' },
          { name: 'Job Number Searched For' },
        ]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(3, 3)
            : timesheetsJobs.map(e => {
                return [
                  {
                    value: e.actions[0].userName,
                  },
                  {
                    value: e.actions[0].time,
                  },
                  {
                    value: e.jobId,
                  },
                ];
              })
        }
      />

      {timesheets?.length === 0 && (
        <div key="No records">
          <strong>No Timesheet Records Found</strong>
        </div>
      )}
      <Button label={'Close'} onClick={() => onClose()}></Button>
      <Button
        label={'Download'}
        disabled={state.downloadButton}
        onClick={() => downloadReport()}
      ></Button>
    </SectionBar>
  ) : (
    <Loader />
  );
};
