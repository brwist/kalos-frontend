import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays, startOfWeek } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import { Confirm } from '../../Confirm';
import PageviewIcon from '@material-ui/icons/Pageview';
import { Timesheet as TimesheetComponent } from '../../../ComponentsLibrary/Timesheet';
import {
  TimesheetLineType,
  makeFakeRows,
  UserType,
  TimesheetLineClientService,
  UserClientService,
  timestamp,
  TimesheetDepartmentClientService,
} from '../../../../helpers';
import { ROWS_PER_PAGE, OPTION_ALL } from '../../../../constants';
import {
  TimesheetLine,
  TimesheetLineClient,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { User } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT, NULL_TIME } from '../../../../constants';
import { RoleType } from '../index';
import { TimesheetSummary } from './TimesheetSummary';
import { userInfo } from 'os';

interface Props {
  departmentId: number;
  employeeId: number;
  week: string;
  type: RoleType;
  loggedUser: number;
}

const formatWeek = (date: string) => {
  const d = parseISO(date);
  return `Week of ${format(d, 'yyyy')} ${format(d, 'MMMM')}, ${format(
    d,
    'do',
  )}`;
};

export const Timesheet: FC<Props> = ({
  departmentId,
  employeeId,
  week,
  type,
  loggedUser,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [timesheets, setTimesheets] = useState<TimesheetLineType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const [
    timesheetSummaryToggle,
    setTimesheetSummaryToggle,
  ] = useState<TimesheetLineType>();
  const [startDay, setStartDay] = useState<Date>(
    startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 }),
  );
  const [endDay, setEndDay] = useState<Date>(addDays(startDay, 7));
  const [pendingView, setPendingView] = useState<TimesheetLineType>();
  const [
    pendingCreateEmptyTimesheetLine,
    setPendingCreateEmptyTimesheetLine,
  ] = useState<TimesheetLineType>();
  const load = useCallback(async () => {
    setLoading(true);
    const filter = {
      page,
      departmentId,
      employeeId,
      type: type,
      startDate: format(startDay, 'yyyy-MM-dd'),
      endDate: format(endDay, 'yyyy-MM-dd'),
    };
    if (week !== OPTION_ALL && type != 'Payroll') {
      Object.assign(filter, {
        startDate: week,
        endDate: format(addDays(new Date(week), 7), 'yyyy-MM-dd'),
      });
    }

    const getTimesheets = createTimesheetFetchFunction(filter, type);
    const { resultsList, totalCount } = (await getTimesheets()).toObject();
    const tempResults = [];
    if (
      departmentId &&
      departmentId != 0 &&
      employeeId == 0 &&
      type === 'Manager'
    ) {
      const departmentTimesheetsReq = new TimesheetLine();
      departmentTimesheetsReq.setIsActive(1);
      departmentTimesheetsReq.setWithoutLimit(true);
      const searchUser = new User();
      searchUser.setEmployeeDepartmentId(departmentId);
      departmentTimesheetsReq.setSearchUser(searchUser);
      departmentTimesheetsReq.setGroupBy('technician_user_id');
      departmentTimesheetsReq.setDateRangeList([
        '>=',
        filter.startDate,
        '<=',
        filter.endDate,
      ]);
      const departmentResults = (
        await TimesheetLineClientService.BatchGet(departmentTimesheetsReq)
      ).getResultsList();
      console.log({ departmentResults });
      const allUsers = await UserClientService.loadUsersByDepartmentId(
        departmentId,
      );
      for (let i = 0; i < allUsers.length; i++) {
        let found = false;
        for (let j = 0; j < departmentResults.length; j++) {
          if (departmentResults[j].getTechnicianUserId() === allUsers[i].id) {
            console.log(
              'we found' + departmentResults[j].getTechnicianUserId(),
            );
            found = true;
          }
        }
        if (found == false) {
          console.log('we did not find someone');
          let tempTimesheet = new TimesheetLine();
          tempTimesheet.setAdminApprovalDatetime(NULL_TIME);
          tempTimesheet.setUserApprovalDatetime(NULL_TIME);
          tempTimesheet.setTechnicianUserId(allUsers[i].id);
          tempTimesheet.setReferenceNumber('auto');
          tempTimesheet.setDepartmentName(
            allUsers[i].department!.value +
              ' - ' +
              allUsers[i].department!.description,
          );
          tempTimesheet.setTechnicianUserName(
            allUsers[i].firstname + ' ' + allUsers[i].lastname,
          );
          resultsList.push(tempTimesheet.toObject());
        }
      }
    }
    if (employeeId && employeeId != 0 && type === 'Manager') {
      const employeeReq = new TimesheetLine();
      employeeReq.setIsActive(1);
      employeeReq.setWithoutLimit(true);
      const searchUser = new User();
      searchUser.setId(employeeId);
      employeeReq.setSearchUser(searchUser);
      employeeReq.setGroupBy('technician_user_id');
      employeeReq.setDateRangeList([
        '>=',
        filter.startDate,
        '<=',
        filter.endDate,
      ]);
      const employeeResults = (
        await TimesheetLineClientService.BatchGet(employeeReq)
      ).getResultsList();
      console.log({ employeeResults });
      const tempUser = new User();
      tempUser.setId(employeeId);
      const userResult = await UserClientService.Get(tempUser);
      if (employeeResults.length < 1) {
        console.log('we did not find the single employee, create one');
        let tempTimesheet = new TimesheetLine();
        tempTimesheet.setAdminApprovalDatetime(NULL_TIME);
        tempTimesheet.setUserApprovalDatetime(NULL_TIME);
        tempTimesheet.setTechnicianUserId(employeeId);
        tempTimesheet.setReferenceNumber('auto');
        tempTimesheet.setDepartmentName(userResult.department!.value);
        tempTimesheet.setTechnicianUserName(
          userResult.firstname + ' ' + userResult.lastname,
        );
        resultsList.push(tempTimesheet.toObject());
      }
    }

    let sortedResultsLists = resultsList.sort((a, b) =>
      a.technicianUserName.split(' ')[1] > b.technicianUserName.split(' ')[1]
        ? 1
        : -1,
    );
    setTimesheets(sortedResultsLists);
    setCount(sortedResultsLists.length);
    setLoading(false);
  }, [page, departmentId, employeeId, week, endDay, startDay, type]);
  useEffect(() => {
    load();
  }, [load]);
  const handleTogglePendingView = useCallback(
    (pendingView?: TimesheetLineType) => () => {
      setPendingView(pendingView);
      load();
    },
    [load],
  );
  const createEmptyTimesheetLine = useCallback(
    async (emptyTimesheetLine?: TimesheetLineType) => {
      console.log('we pressed button');
      if (emptyTimesheetLine) {
        setPendingCreateEmptyTimesheetLine(undefined);
        const tempTimesheet = new TimesheetLine();
        const time = timestamp();
        tempTimesheet.setUserApprovalDatetime(time);
        tempTimesheet.setAdminApprovalDatetime(time);
        tempTimesheet.setAdminApprovalUserId(loggedUser);
        tempTimesheet.setClassCodeId(41);
        tempTimesheet.setTimeStarted(
          format(addDays(startDay, 1), 'yyyy-MM-dd'),
        );
        tempTimesheet.setTimeFinished(
          format(addDays(startDay, 1), 'yyyy-MM-dd'),
        );
        tempTimesheet.setTechnicianUserId(emptyTimesheetLine.technicianUserId);
        tempTimesheet.setDepartmentCode(departmentId);
        tempTimesheet.setIsActive(1);
        tempTimesheet.setReferenceNumber('NO TIMESHEET THIS WEEK');

        const result = await TimesheetLineClientService.Create(tempTimesheet);
        load();
      }
    },
    [loggedUser, startDay, load, departmentId],
  );
  return (
    <div>
      <SectionBar
        title="Timesheet"
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: setPage,
        }}
      />
      <InfoTable
        columns={[
          { name: 'Employee' },
          { name: 'Department' },
          { name: type === 'Manager' ? 'Status' : 'Week Approved' },
        ]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(3, 3)
            : timesheets.map(e => {
                return [
                  {
                    value: e.technicianUserName,
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: e.departmentName,
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value:
                      type === 'Manager'
                        ? e.userApprovalDatetime === NULL_TIME
                          ? e.referenceNumber === 'auto'
                            ? 'No Timesheet Submitted'
                            : 'Timesheet Pending'
                          : 'Submitted'
                        : formatWeek(e.adminApprovalDatetime),
                    onClick: handleTogglePendingView(e),
                    actions: [
                      <IconButton
                        key="view"
                        onClick={handleTogglePendingView(e)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>,
                      type === 'Payroll' && (
                        <IconButton
                          key="summary"
                          onClick={() => setTimesheetSummaryToggle(e)}
                          size="small"
                          disabled={type != 'Payroll'}
                        >
                          <PageviewIcon />
                        </IconButton>
                      ),
                      e.referenceNumber === 'auto' && (
                        <IconButton
                          key="createEmpty"
                          onClick={() => setPendingCreateEmptyTimesheetLine(e)}
                          size="small"
                          disabled={type != 'Manager'}
                        >
                          <PageviewIcon />
                        </IconButton>
                      ),
                    ],
                  },
                ];
              })
        }
      />
      {pendingView && (
        <Modal open onClose={handleTogglePendingView(undefined)} fullScreen>
          <TimesheetComponent
            timesheetOwnerId={pendingView.technicianUserId}
            userId={loggedUser}
            week={pendingView.timeStarted}
            onClose={handleTogglePendingView(undefined)}
            startOnWeek={type === 'Payroll' || type === 'Manager'}
          />
        </Modal>
      )}
      {timesheetSummaryToggle && (
        <Modal
          open
          onClose={() => setTimesheetSummaryToggle(undefined)}
          fullScreen
        >
          <TimesheetSummary
            userId={timesheetSummaryToggle.technicianUserId}
            loggedUserId={loggedUser}
            notReady={false}
            onClose={() => setTimesheetSummaryToggle(undefined)}
            username={timesheetSummaryToggle.technicianUserName}
          ></TimesheetSummary>
        </Modal>
      )}
      {pendingCreateEmptyTimesheetLine && (
        <Confirm
          title="Confirm Approve"
          open
          onClose={() => setPendingCreateEmptyTimesheetLine(undefined)}
          onConfirm={() =>
            createEmptyTimesheetLine(pendingCreateEmptyTimesheetLine)
          }
        >
          Are you sure you want to create a Fake Timesheet entry? This means
          this user does not have a Timesheet this week.
        </Confirm>
      )}
    </div>
  );
};

interface GetTimesheetConfig {
  page?: number;
  departmentId?: number;
  employeeId: number;
  startDate?: string;
  endDate?: string;
  type: RoleType;
}

const createTimesheetFetchFunction = (
  config: GetTimesheetConfig,
  role: RoleType,
) => {
  const req = new TimesheetLine();
  console.log(config);
  req.setGroupBy('technician_user_id');
  req.setIsActive(1);
  if (config.type === 'Payroll') {
    req.setWithoutLimit(true);
  }
  if (config.type != 'Payroll' && config.page) {
    req.setPageNumber(config.page);
  }
  const client = new TimesheetLineClient(ENDPOINT);
  if (config.startDate && config.endDate) {
    req.setDateRangeList(['>=', config.startDate, '<=', config.endDate]);
  }
  if (config.departmentId) {
    //req.setDepartmentCode(config.departmentId); for class code
    const tempUser = new User();
    tempUser.setEmployeeDepartmentId(config.departmentId);
    req.setSearchUser(tempUser);
  }
  if (config.employeeId) {
    req.setTechnicianUserId(config.employeeId);
  }

  if (config.type === 'Payroll') {
    req.setNotEqualsList(['AdminApprovalUserId']);
    req.setFieldMaskList(['PayrollProcessed']);
  } else if (config.type === 'Manager') {
    req.setFieldMaskList(['AdminApprovalUserId']);
  }
  if (config.type == 'Manager') {
    return () => client.BatchGetManager(req); // Goes to the manager View in the database instead of the combined view from before, speed gains
  } else {
    return () => client.BatchGetPayroll(req); // Payroll does the same but to a specific Payroll view
  }
};

const getManagerTimesheets = () => {};

const getPayrollTimesheets = () => {};
