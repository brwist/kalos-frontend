import React, { FC } from 'react';
import { FirstCallDashboard, Props } from '../ComponentsLibrary/FirstCalls';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

// add any prop types here

export const FirstCall: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId} withHeader>
    <FirstCallDashboard {...props} />
  </PageWrapper>
);