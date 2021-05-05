import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays, startOfWeek, subDays } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import {
  TimesheetLineType,
  makeFakeRows,
  UserType,
  UserClientService,
  TimesheetLineClientService,
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
import { NULL_TIME_VALUE } from '../../Timesheet/constants';
import { CostSummary } from '../../CostSummary';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
interface Props {
  departmentId: number;
  employeeId: number;
  week: string;
  type: RoleType;
  loggedUser: number;
}
const getDepartmentNameById = async (id: number) => {
  let req = new TimesheetDepartment();
  req.setId(id);
  const dept = await TimesheetDepartmentClientService.Get(req);
  return dept.value;
};
const formatWeek = (date: string) => {
  const d = parseISO(date);
  return `Week of ${format(d, 'yyyy')} ${format(d, 'MMMM')}, ${format(
    d,
    'do',
  )}`;
};
export type TechnicianSummaryType = {
  id: number;
  name: string;
  timesheetExist: boolean;
  department: string;
};
export const PayrollSummary: FC<Props> = ({
  employeeId,
  departmentId,
  week,
  type,
  loggedUser,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadedTechnicians, setLoadedTechnicians] = useState<
    TechnicianSummaryType[]
  >([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [toggle, setToggle] = useState<boolean>(false);
  const [pendingView, setPendingView] = useState<TechnicianSummaryType>();
  const [pendingViewDefault, setPendingViewDefault] = useState<boolean>(false);
  const [startDay, setStartDay] = useState<Date>(
    startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 }),
  );
  const [endDay, setEndDay] = useState<Date>(addDays(startDay, 7));
  const load = useCallback(async () => {
    setLoading(true);
    const filter = {
      page,
      employeeId,
      departmentId,
      type: type,
      toggle,
      startDate: format(startDay, 'yyyy-MM-dd'),
      endDate: format(endDay, 'yyyy-MM-dd'),
    };

    if (week !== OPTION_ALL) {
      Object.assign(filter, {
        startDate: week,
        endDate: format(addDays(new Date(week), 7), 'yyyy-MM-dd'),
      });
    }
    const req = new TimesheetLine();
    req.setDateRangeList([
      '>=',
      format(startDay, 'yyyy-MM-dd'),
      '<=',
      format(endDay, 'yyyy-MM-dd'),
    ]);
    req.setWithoutLimit(true);
    let technicians = [];
    if (departmentId) {
      technicians = await UserClientService.loadUsersByDepartmentId(
        departmentId,
      );
      const user = new User();
      user.setEmployeeDepartmentId(departmentId);
      req.setSearchUser(user);
    } else if (employeeId) {
      technicians = [await UserClientService.loadUserById(employeeId)];
    } else {
      technicians = await UserClientService.loadTechnicians();
    }
    const createdTimesheets = (
      await TimesheetLineClientService.BatchGet(req)
    ).getResultsList();
    const completeTechnicianList = [];
    const getTimesheets = createTimesheetFetchFunction(filter);

    const { resultsList } = (await getTimesheets()).toObject();
    for (let i = 0; i < technicians.length; i++) {
      let found = false;
      const userDep = await getDepartmentNameById(
        technicians[i].employeeDepartmentId,
      );
      for (let j = 0; j < createdTimesheets.length; j++) {
        if (createdTimesheets[j].getTechnicianUserId() === technicians[i].id) {
          found = true;
        }
      }
      for (let l = 0; l < resultsList.length; l++) {
        if (resultsList[l].technicianUserId === technicians[i].id) {
          found = true;
          completeTechnicianList.push({
            id: technicians[i].id,
            timesheetExist: true,
            name: technicians[i].firstname + ' ' + technicians[i].lastname,
            department: userDep,
          });
        }
      }
      if (found === false) {
        //we didnt find the tech, so either they didn't work last week, or they don't create timecards
        completeTechnicianList.push({
          id: technicians[i].id,
          timesheetExist: false,
          name: technicians[i].firstname + ' ' + technicians[i].lastname,
          department: userDep,
        });
      }
    }
    setLoadedTechnicians(completeTechnicianList);
    setCount(completeTechnicianList.length);
    setLoading(false);
  }, [page, employeeId, week, type, toggle, departmentId, endDay, startDay]);
  useEffect(() => {
    load();
  }, [load]);
  const handleTogglePendingView = useCallback(
    (pendingView?: TechnicianSummaryType) => () => {
      setPendingView(pendingView);
      load();
    },
    [load],
  );
  const handleNextEmployee = () => {
    let tempPendingView = pendingView;
    setPendingView(undefined);
    if (tempPendingView != undefined) {
      for (let i = 0; i < loadedTechnicians.length; i++) {
        if (loadedTechnicians[i].id === tempPendingView.id) {
          tempPendingView = loadedTechnicians[i + 1];
          break;
        }
      }
    }
    setTimeout(() => {
      setPendingView(tempPendingView);
    }, 1000);
  };
  const handleSetToggle = () => {
    if (toggle === true) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  };
  return (
    <div>
      <SectionBar
        title="Payroll Summary"
        pagination={{
          count,
          page: count - 1,
          rowsPerPage: 1,
          onChangePage: setPage,
        }}
      />
      {/*
      <Button
        label={
          toggle == false
            ? 'Toggle For Pending Manager Approval Records'
            : 'Toogle For Manager Approved Records'
        }
        onClick={handleSetToggle}
      ></Button>
      */}
      <InfoTable
        columns={[
          { name: 'Employee' },
          { name: 'Department' },
          { name: 'Did the User Create a Timesheet Last Week?' },
        ]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(3, 4)
            : loadedTechnicians.map(e => {
                return [
                  {
                    value: e.name,
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: e.department,
                    onClick: handleTogglePendingView(e),
                  },

                  {
                    value:
                      e.timesheetExist === false
                        ? 'No Timesheet Found'
                        : 'Timesheet Processed',
                    onClick: handleTogglePendingView(e),
                    actions: [
                      <IconButton
                        key="view"
                        onClick={handleTogglePendingView(e)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>,
                    ],
                  },
                ];
              })
        }
      />
      {pendingView && (
        <Modal
          open={pendingView ? true : false}
          onClose={handleTogglePendingView(undefined)}
          fullScreen
        >
          <CostSummary
            userId={employeeId === 0 ? pendingView.id : employeeId}
            username={pendingView.name}
            onClose={handleTogglePendingView(undefined)}
            loggedUserId={loggedUser}
            notReady={toggle}
            onNext={() => handleNextEmployee()}
          ></CostSummary>
        </Modal>
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
  toggle: boolean;
}

const createTimesheetFetchFunction = (config: GetTimesheetConfig) => {
  const req = new TimesheetLine();
  req.setPageNumber(config.page || 0);
  req.setOrderBy('time_started');
  req.setGroupBy('technician_user_id');
  req.setIsActive(1);
  req.setWithoutLimit(true);
  const client = new TimesheetLineClient(ENDPOINT);
  if (config.startDate && config.endDate) {
    req.setDateRangeList(['>=', config.startDate, '<=', config.endDate]);
  }
  if (config.employeeId) {
    req.setTechnicianUserId(config.employeeId);
  }
  if (config.departmentId) {
    //req.setDepartmentCode(config.departmentId);
    const tempUser = new User();
    tempUser.setEmployeeDepartmentId(config.departmentId);
    req.setSearchUser(tempUser);
  }

  if (config.toggle === true) {
    //look like manager
    req.setUserApprovalDatetime(NULL_TIME_VALUE);
    req.setFieldMaskList(['PayrollProcessed']);
    req.setNotEqualsList(['UserApprovalDatetime']);
  }
  if (config.toggle === false) {
    req.setAdminApprovalUserId(0);

    req.setNotEqualsList(['AdminApprovalUserId', 'PayrollProcessed']);
  }
  if (config.toggle === true) {
    //return like manager
    return () => client.BatchGetManager(req); // Goes to the manager View in the database instead of the combined view from before, speed gains
  } else {
    return () => client.BatchGetPayroll(req); // Payroll does the same but to a specific Payroll view
  }
};

const getManagerTimesheets = () => {};

const getPayrollTimesheets = () => {};
