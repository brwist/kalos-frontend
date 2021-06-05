import React, { FC } from 'react';
import { Teams, Props } from '../ComponentsLibrary/Teams';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const TeamsComponent: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <Teams {...props} />
  </PageWrapper>
);
