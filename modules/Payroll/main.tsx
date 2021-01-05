import React, { FC } from 'react';
import { startOfWeek } from 'date-fns';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { CalendarHeader } from '../ComponentsLibrary/CalendarHeader';

interface Props {
  userID: number;
  loggedUserId: number;
}

export const Payroll: FC<Props & PageWrapperProps> = props => {
  return (
    <PageWrapper {...props} userID={props.loggedUserId} withHeader>
      <CalendarHeader
        selectedDate={startOfWeek(new Date())}
        title="John Smith"
        onDateChange={console.log}
        onSubmit={() => console.log('SUBMIT')}
        weekStartsOn={6}
      />
      <h1>Payroll!</h1>
    </PageWrapper>
  );
};
