import React, { FC } from 'react';
import { DispatchDashboard, Props } from '../ComponentsLibrary/Dispatch';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

// add any prop types here

export const Dispatch: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.userID} withHeader>
    <DispatchDashboard {...props} />
  </PageWrapper>
);
