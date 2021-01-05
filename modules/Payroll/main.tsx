import React, { FC, useState, useEffect, useCallback } from 'react';
import { startOfWeek } from 'date-fns';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { CalendarHeader } from '../ComponentsLibrary/CalendarHeader';
import { UserType, UserClientService, getCustomerName } from '../../helpers';

interface Props {
  userID: number;
  loggedUserId: number;
}

export const Payroll: FC<Props & PageWrapperProps> = props => {
  const { loggedUserId, userID } = props;
  const [initiated, setInitiated] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfWeek(new Date()),
  );
  const [user, setUser] = useState<UserType>();
  const initiate = useCallback(async () => {
    const user = await UserClientService.loadUserById(userID);
    setUser(user);
  }, [userID]);
  useEffect(() => {
    if (!initiated) {
      setInitiated(true);
      initiate();
    }
  }, [initiated]);
  return (
    <PageWrapper {...props} userID={loggedUserId} withHeader>
      <CalendarHeader
        selectedDate={selectedDate}
        title={getCustomerName(user)}
        onDateChange={setSelectedDate}
        onSubmit={() => console.log('SUBMIT')}
        weekStartsOn={6}
      />
    </PageWrapper>
  );
};
