import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import { startOfWeek, format, addDays } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import CardTravel from '@material-ui/icons/CardTravel';
import { CalendarHeader } from '../CalendarHeader';
import { Calendar } from '../Calendar';
import { CalendarColumn } from '../CalendarColumn';
import { CalendarCard } from '../CalendarCard';
import { AddNewButton } from '../AddNewButton';
import {
  loadUserById,
  loadPerDiemByUserIdAndDateStarted,
  UserType,
  PerDiemType,
  getCustomerName,
} from '../../../helpers';

export interface Props {
  userId: number;
}

const useStyles = makeStyles(theme => ({}));

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

export const PerDiem: FC<Props> = ({ userId }) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>();
  const [perDiem, setPerDiem] = useState<PerDiemType>();
  const [dateStarted, setDateStarted] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 6 }),
  );
  const load = useCallback(async () => {
    setLoading(true);
    const { resultsList } = await loadPerDiemByUserIdAndDateStarted(
      userId,
      formatDate(dateStarted),
    );
    setPerDiem(resultsList[0]);
    setLoading(false);
  }, [userId, setLoading, setPerDiem]);
  const loadUser = useCallback(async () => {
    setLoadingUser(true);
    const user = await loadUserById(userId);
    setUser(user);
    setLoadingUser(false);
  }, [userId, setLoadingUser, setUser]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  useEffect(() => {
    if (!userLoaded) {
      setUserLoaded(true);
      loadUser();
    }
  }, [userLoaded, setUserLoaded, loadUser]);
  const status = useMemo(() => {
    if (perDiem) {
      if (perDiem.dateApproved)
        return {
          text: 'Approved',
          color: '#004400',
        };
      if (perDiem.dateSubmitted)
        return {
          text: 'Pending approve',
          color: '#FFBB00',
        };
    }
    return {
      text: 'Pending submit',
      color: '#888888',
    };
  }, [perDiem]);
  const rowsList = perDiem ? perDiem.rowsList : [];
  return (
    <div>
      <CalendarHeader
        onDateChange={setDateStarted}
        onSubmit={console.log}
        selectedDate={dateStarted}
        userName={getCustomerName(user)}
        weekStartsOn={6}
      />
      <Calendar>
        {[...Array(7)].map((_, dayOffset) => {
          const date = formatDate(addDays(dateStarted, dayOffset));
          const rows = rowsList.filter(({ dateString }) =>
            dateString.startsWith(date),
          );
          return (
            <CalendarColumn
              key={dayOffset}
              date={date}
              loading={loading || loadingUser}
            >
              {rows.map(({ id, notes, zipCode, serviceCallId, mealsOnly }) => (
                <CalendarCard
                  key={id}
                  title={status.text}
                  statusColor={status.color}
                  onClick={console.log}
                >
                  <div>
                    <strong>Zip Code: </strong>
                    {zipCode}
                  </div>
                  <div>
                    <strong>Service Call Id: </strong>
                    {serviceCallId}
                  </div>
                  <div>
                    <strong>Meals only: </strong>
                    {mealsOnly ? 'YES' : 'NO'}
                  </div>
                  <div>
                    <strong>Notes: </strong>
                    {notes}
                  </div>
                </CalendarCard>
              ))}
            </CalendarColumn>
          );
        })}
      </Calendar>
      <AddNewButton
        options={[
          {
            name: 'Add Per Diem',
            icon: <CardTravel />,
          },
        ]}
      />
    </div>
  );
};
