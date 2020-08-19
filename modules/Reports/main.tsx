import React, { FC } from 'react';
import {
  Reports as ReportsComponent,
  Props,
} from '../ComponentsLibrary/Reports';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const Reports: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <ReportsComponent {...props} />
  </PageWrapper>
);
