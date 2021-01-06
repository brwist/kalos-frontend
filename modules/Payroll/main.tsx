import React, { FC, useState, useEffect, useCallback } from 'react';
import { startOfWeek } from 'date-fns';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { CalendarHeader } from '../ComponentsLibrary/CalendarHeader';
import { Tabs } from '../ComponentsLibrary/Tabs';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { Field } from '../ComponentsLibrary/Field';
import { PerDiemComponent } from '../ComponentsLibrary/PerDiem';
import { Loader } from '../Loader/main';
import {
  UserType,
  UserClientService,
  getCustomerName,
  TimesheetDepartmentType,
  loadTimesheetDepartments,
  getDepartmentName,
  loadUsersByFilter,
  getPerDiemRowId,
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
    startOfWeek(new Date()),
  );
  const [user, setUser] = useState<UserType>(); // TODO is it useful?
  const [users, setUsers] = useState<UserType[]>([]);
  const [perDiemRowId, setPerDiemRowId] = useState<number>(0);
  const handlePerDiemRowIdChange = useCallback(
    async (newDate: Date) => {
      const perDiemRowId = await getPerDiemRowId(newDate);
      setPerDiemRowId(perDiemRowId!);
    },
    [setPerDiemRowId],
  );
  const handleDateChange = useCallback(
    async date => {
      setSelectedDate(date);
      handlePerDiemRowIdChange(date);
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
      {loaded ? (
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
                    content: <PerDiemComponent loggedUserId={user.id} />,
                  },
                  {
                    label: 'Trips',
                    content:
                      perDiemRowId > 0 ? (
                        <TripSummary
                          canAddTrips={false}
                          cannotDeleteTrips
                          loggedUserId={user.id}
                          perDiemRowId={perDiemRowId}
                        />
                      ) : (
                        <Loader />
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
