import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, startOfWeek } from 'date-fns';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { CalendarHeader } from '../ComponentsLibrary/CalendarHeader';
import { Tabs } from '../ComponentsLibrary/Tabs';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { Field } from '../ComponentsLibrary/Field';
import { PerDiemComponent } from '../ComponentsLibrary/PerDiem';
import { PerDiem } from './component/PerDiem';
import { Loader } from '../Loader/main';
import {
  UserType,
  UserClientService,
  getCustomerName,
  TimesheetDepartmentType,
  loadTimesheetDepartments,
  getDepartmentName,
  loadUsersByFilter,
  getPerDiemRowIds,
} from '../../helpers';
import { TripSummary } from '../ComponentsLibrary/TripSummary';

interface Props {
  userID: number;
  loggedUserId: number;
}

export const Payroll: FC<Props & PageWrapperProps> = props => {
  const { loggedUserId, userID } = props;
  const [initiated, setInitiated] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [department, setDepartment] = useState<number>();
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 6 }),
  );
  const [user, setUser] = useState<UserType>(); // TODO is it useful?
  const [users, setUsers] = useState<UserType[]>([]);
  const [perDiemRowId, setPerDiemRowId] = useState<number[]>([]);
  const handlePerDiemRowIdChange = useCallback(
    async (newDate: Date) => {
      const perDiemRowId = await getPerDiemRowIds(newDate);
      let arr = perDiemRowId?.toArray();
      setPerDiemRowId(arr!);
    },
    [setPerDiemRowId],
  );
  const handleDateChange = useCallback(
    async date => {
      setSelectedDate(date);
      await handlePerDiemRowIdChange(date);
    },
    [setSelectedDate],
  );
  const handleDepartmentChanged = useCallback(async id => {
    setLoaded(false);
    setDepartment(id);
    const users = await loadUsersByFilter({
      page: -1,
      filter: {
        employeeDepartmentId: id,
      },
      sort: {
        orderByField: 'lastname',
        orderDir: 'ASC',
        orderBy: 'user_lastname',
      },
    });
    setUsers(users.results);
    setLoaded(true);
  }, []);
  const initiate = useCallback(async () => {
    const user = await UserClientService.loadUserById(userID);
    setUser(user);
    const departments = await loadTimesheetDepartments();
    setDepartments(departments);
    const department = user.employeeDepartmentId;
    await handleDepartmentChanged(department);
    await handlePerDiemRowIdChange(selectedDate);
  }, [userID]);

  useEffect(() => {
    if (!initiated) {
      setInitiated(true);
      initiate();
    }
  }, [initiated]);
  return (
    <PageWrapper {...props} userID={loggedUserId} withHeader>
      {loaded && department ? (
        <>
          <CalendarHeader
            selectedDate={selectedDate}
            title="Payroll"
            asideTitle={
              <span
                style={{
                  marginLeft: 16,
                  display: 'inline-block',
                  width: 160,
                }}
              >
                <Field
                  label="Select Department"
                  name="test"
                  options={departments.map(p => ({
                    label: getDepartmentName(p),
                    value: p.id,
                  }))}
                  value={department}
                  onChange={id => handleDepartmentChanged(+id)}
                  white
                />
              </span>
            }
            onDateChange={handleDateChange}
            // onSubmit={() => console.log('SUBMIT')}
            weekStartsOn={6}
          />
          {users.map(user => (
            <SectionBar key={user.id} title={getCustomerName(user)}>
              <Tabs
                tabs={[
                  {
                    label: 'Timeoff requests',
                    content: <div style={{ height: 100 }} />,
                  },
                  {
                    label: 'Timesheet',
                    content: <div />,
                  },
                  {
                    label: 'Per Diem',
                    content: (
                      <PerDiem
                        departmentId={department}
                        userId={user.id}
                        dateStarted={format(selectedDate, 'yyyy-MM-dd')}
                      />
                    ),
                  },
                  {
                    label: 'Trips',
                    content:
                      perDiemRowId.length > 0 ? (
                        <TripSummary
                          cannotDeleteTrips
                          loggedUserId={user.id}
                          perDiemRowIds={perDiemRowId}
                          key={perDiemRowId[0]}
                        />
                      ) : perDiemRowId != undefined ? (
                        <Loader />
                      ) : (
                        <TripSummary
                          cannotDeleteTrips
                          loggedUserId={user.id}
                          perDiemRowIds={[-1]} // a bit hacky, but it will show no results found
                          key={perDiemRowId}
                        />
                      ),
                  },
                ]}
              />
            </SectionBar>
          ))}
        </>
      ) : (
        <Loader />
      )}
    </PageWrapper>
  );
};