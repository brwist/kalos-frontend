import React, { FC } from 'react';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { TimeOff, Props as TimeOffProps } from '../ComponentsLibrary/TimeOff';

export const AddTimeOff: FC<TimeOffProps & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId} withHeader>
    <TimeOff {...props} />
  </PageWrapper>
);
