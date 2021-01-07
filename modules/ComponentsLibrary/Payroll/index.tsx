import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema } from '../PlainForm';
import { Loader } from '../../Loader/main';
import { Tabs } from '../Tabs';
import {
  UserType,
  loadTimesheetDepartments,
  TimesheetDepartmentType,
  getDepartmentName,
  loadTechnicians,
  getCustomerName,
  getWeekOptions,
  getPerDiemRowIds,
  PerDiemClientService,
} from '../../../helpers';
import { OPTION_ALL } from '../../../constants';
import { PerDiem } from './components/PerDiem';
import './styles.less';
import { TripSummary } from '../TripSummary';
import {
  PerDiemList,
  PerDiem as pd,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { dateTimePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';

interface Props {
  userID: number;
}

type FilterData = {
  departmentId: number;
  employeeId: number;
  week: string;
};

export const Payroll: FC<Props> = ({ userID }) => {
  const [initiated, setInitiated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterData>({
    departmentId: 0,
    employeeId: 0,
    week: OPTION_ALL,
  });
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [employees, setEmployees] = useState<UserType[]>([]);
  const [loadedPerDiemIds, setLoadedPerDiemIds] = useState<number[]>([]);
  const weekOptions = useMemo(
    () => [
      { label: OPTION_ALL, value: OPTION_ALL },
      ...getWeekOptions(52, 0, -1),
    ],
    [],
  );
  const handleSelectNewWeek = useCallback(async dateString => {
    let ids: number[] | undefined = [];
    if (dateString == '-- All --') {
      ids = (await PerDiemClientService.BatchGet(new pd()))
        .getResultsList()
        .filter(perdiem => perdiem.getUserId() == userID)
        .map(perdiem => {
          return perdiem.getId();
        });
      setLoadedPerDiemIds(ids);
    } else {
      let date = new Date(dateString);
      date.setDate(date.getDate() + 1);
      let pdList = await getPerDiemRowIds(date);
      ids = pdList
        ?.getResultsList()
        .filter(perdiem => perdiem.getUserId() == userID)
        .map(pd => pd.getId());
      ids ? setLoadedPerDiemIds(ids) : setLoadedPerDiemIds([]);
    }
  }, []);
  const init = useCallback(async () => {
    const departments = await loadTimesheetDepartments();
    setDepartments(departments);
    const employees = await loadTechnicians();
    setEmployees(employees);
    handleSelectNewWeek('-- All --');
    setInitiated(true);
  }, []);
  useEffect(() => {
    if (!initiated) {
      init();
    }
  }, [initiated]);
  const SCHEMA: Schema<FilterData> = [
    [
      {
        name: 'departmentId',
        label: 'Select Department',
        options: [
          { label: OPTION_ALL, value: 0 },
          ...departments.map(el => ({
            label: getDepartmentName(el),
            value: el.id,
          })),
        ],
      },
      {
        name: 'employeeId',
        label: 'Select Employee',
        options: [
          { label: OPTION_ALL, value: 0 },
          ...employees
            .filter(el => {
              if (filter.departmentId === 0) return true;
              return el.employeeDepartmentId === filter.departmentId;
            })
            .map(el => ({
              label: getCustomerName(el),
              value: el.id,
            })),
        ],
      },
      {
        name: 'week',
        label: 'Select Week',
        options: weekOptions,
        onChange: async date => handleSelectNewWeek(date),
      },
    ],
  ];
  return (
    <div>
      <SectionBar title="Payroll" />
      {initiated ? (
        <>
          <PlainForm
            data={filter}
            onChange={setFilter}
            schema={SCHEMA}
            className="PayrollFilter"
          />
          <Tabs
            tabs={[
              {
                label: 'Per Diem',
                content: (
                  <PerDiem
                    departmentId={filter.departmentId}
                    employeeId={filter.employeeId}
                    week={filter.week}
                    loggedUserId={userID}
                  />
                ),
              },
              {
                label: 'Trips',
                content: (
                  <TripSummary
                    loggedUserId={userID}
                    perDiemRowIds={loadedPerDiemIds}
                    cannotDeleteTrips
                  />
                ),
              },
            ]}
          />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};
