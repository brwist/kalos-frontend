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
import { CostReport } from '../../CostReport';
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
  week: string;
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
export const JobSummaryNew: FC<Props> = ({ loggedUserId, onClose }) => {
  const [state, dispatch] = useReducer(reducer, {
    downloadButton: true,
  });
  const [timesheets, setTimesheets] = useState<TimesheetLine[]>();
  const [timesheetsJobs, setTimesheetsJobs] = useState<WeekForEmployee[]>([]);
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [days, setDays] = useState<Day[]>();
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
      const employeeWeekData = [];
      timesheetReq.setIsActive(1);
      timesheetReq.setWithoutLimit(true);
      timesheetReq.setReferenceNumber(filter.jobNumber.toString());
      const endDate = formatDateFns(addDays(new Date(filter.week), 7));
      timesheetReq.setDateRangeList([
        '>=',
        `${filter.week}`,
        '<',
        `${endDate}`,
      ]);
      timesheetReq.setDateTargetList(['time_started']);
      const client = new TimesheetLineClient(ENDPOINT);

      let results = (await client.BatchGet(timesheetReq)).getResultsList();
      //curent data struct for week, Week has 7 days, each day will have date string, with work hours and travel hours
      console.log(results);

      let temp = [];
      let dayListFinal = [];
      for (let i = 0; i < results.length; i++) {
        let dayList = [];
        for (let j = 0; j < 7; j++) {
          const newDate = formatDateFns(addDays(new Date(filter.week), j));
          dayList.push({ date: newDate, workHours: 0, travelHours: 0 });
        }
        console.log(results[i].getTechnicianUserId());

        const id = results[i].getTechnicianUserId();
        const name = results[i].getTechnicianUserName();
        let travelTime = 0;
        let workTime = 0;
        const time = roundNumber(
          differenceInMinutes(
            parseISO(results[i].getTimeFinished()),
            parseISO(results[i].getTimeStarted()),
          ) / 60,
        );
        if (results[i].getClassCodeId() === 37) {
          travelTime = time;
          workTime = 0;
        } else {
          travelTime = 0;
          workTime = time;
        }
        let tempDays = dayList;
        tempDays[
          tempDays.findIndex(
            day => day.date === results[i].getTimeStarted().slice(0, 10),
          )
        ].travelHours = travelTime;
        tempDays[
          tempDays.findIndex(
            day => day.date === results[i].getTimeStarted().slice(0, 10),
          )
        ].workHours = workTime;

        temp.push({ employeeId: id, username: name, week: tempDays });
        dayListFinal = dayList;
        setDays(dayListFinal);
      }
      //now lets clean up the dupes
      console.log(temp);
      let tempData = temp;
      let filteredList = [];
      for (let i = 0; i < tempData.length; i++) {
        if (filteredList.length > 0) {
          let found = false;
          for (let j = 0; j < filteredList.length; j++) {
            if (tempData[i].employeeId === filteredList[j].employeeId) {
              if (found == false) {
                for (let m = 0; m < filteredList[j].week.length; m++) {
                  filteredList[j].week[m].travelHours +=
                    tempData[i].week[m].travelHours;
                  filteredList[j].week[m].workHours +=
                    tempData[i].week[m].workHours;
                }
              }
              found = true;
              break;
            }
          }
          if (found === false) {
            filteredList.push(temp[i]);
          }
        } else {
          filteredList.push(temp[i]);
        }
      }
      setTimesheets(results);
      setLoaded(true);
      setLoading(false);
      return filteredList;
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
      let fullString = `Employee , Sat ${days![0].date} ,Sun ${
        days![1]!.date
      },Mon ${days![2]!.date},Tue ${days![3]!.date},Wed ${days![4]!.date},Thu ${
        days![5]!.date
      },Fri ${days![6]!.date},\r\n`;
      for (let i = 0; i < timesheetsJobs.length; i++) {
        let tempWeekString = timesheetsJobs[i].username;
        for (let j = 0; j < timesheetsJobs[i].week.length; j++) {
          if (
            timesheetsJobs[i].week[j].travelHours > 0 ||
            timesheetsJobs[i].week[j].workHours > 0
          ) {
            tempWeekString += `,Travel Hours ${timesheetsJobs[i].week[j].travelHours}: Work Hours ${timesheetsJobs[i].week[j].workHours}`;
          } else {
            tempWeekString += ',';
          }
        }
        fullString = fullString + (tempWeekString + '\r\n');
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
          {
            name: `Sat
          ${days ? days[0].date : 'No Date'}`,
          },
          {
            name: `Sun
          ${days ? days[1].date : 'No Date'}`,
          },
          {
            name: `Mon
          ${days ? days[2].date : 'No Date'}`,
          },
          {
            name: `Tue
          ${days ? days[3].date : 'No Date'}`,
          },
          {
            name: `Wed
          ${days ? days[4].date : 'No Date'}`,
          },
          {
            name: `Thu
          ${days ? days[5].date : 'No Date'}`,
          },
          {
            name: `Fri
          ${days ? days[6].date : 'No Date'}`,
          },
        ]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(3, 3)
            : timesheetsJobs.map(e => {
                return [
                  {
                    value: e.username,
                  },
                  {
                    value:
                      e.week[0].travelHours != 0 || e.week[0].workHours != 0
                        ? `Travel Hours ${e.week[0].travelHours}\n Work Hours ${e.week[0].workHours}`
                        : '',
                  },
                  {
                    value:
                      e.week[1].travelHours != 0 || e.week[1].workHours != 0
                        ? `Travel Hours ${e.week[1].travelHours}\n Work Hours ${e.week[1].workHours}`
                        : '',
                  },
                  {
                    value:
                      e.week[2].travelHours != 0 || e.week[2].workHours != 0
                        ? `Travel Hours ${e.week[2].travelHours}\n Work Hours ${e.week[2].workHours}`
                        : '',
                  },
                  {
                    value:
                      e.week[3].travelHours != 0 || e.week[3].workHours != 0
                        ? `Travel Hours ${e.week[3].travelHours}\n Work Hours ${e.week[3].workHours}`
                        : '',
                  },
                  {
                    value:
                      e.week[4].travelHours != 0 || e.week[4].workHours != 0
                        ? `Travel Hours ${e.week[4].travelHours}\n Work Hours ${e.week[4].workHours}`
                        : '',
                  },
                  {
                    value:
                      e.week[5].travelHours != 0 || e.week[5].workHours != 0
                        ? `Travel Hours ${e.week[5].travelHours}\n Work Hours ${e.week[5].workHours}`
                        : '',
                  },
                  {
                    value:
                      e.week[6].travelHours != 0 || e.week[6].workHours != 0
                        ? `Travel Hours ${e.week[6].travelHours}\n Work Hours ${e.week[6].workHours}`
                        : '',
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
      {openReport && (
        <CostReport
          serviceCallId={filter.jobNumber}
          loggedUserId={loggedUserId}
        ></CostReport>
      )}
      <Button label={'Close'} onClick={() => onClose()}></Button>
      <Button
        label={'Download Weekly Hourly Report'}
        disabled={state.downloadButton}
        onClick={() => downloadReport()}
      ></Button>
      <Button
        label={'Full Job Report'}
        disabled={state.downloadButton}
        onClick={() => setOpenReport(true)}
      ></Button>
    </SectionBar>
  ) : (
    <Loader />
  );
};
