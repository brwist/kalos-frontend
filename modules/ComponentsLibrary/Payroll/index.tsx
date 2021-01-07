import React, { FC, useState, useCallback, useEffect } from 'react';
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
} from '../../../helpers';
import { OPTION_ALL } from '../../../constants';
import { PerDiem } from './components/PerDiem';
import './styles.less';

interface Props {
  userID: number;
}

type FilterData = {
  departmentId: number;
  employeeId: number;
};

export const Payroll: FC<Props> = ({ userID }) => {
  const [initiated, setInitiated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterData>({
    departmentId: 0,
    employeeId: 0,
  });
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [employees, setEmployees] = useState<UserType[]>([]);
  const init = useCallback(async () => {
    const departments = await loadTimesheetDepartments();
    setDepartments(departments);
    const employees = await loadTechnicians();
    setEmployees(employees);
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
                    loggedUserId={userID}
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
