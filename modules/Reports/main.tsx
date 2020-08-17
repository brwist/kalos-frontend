import React, { FC } from 'react';
import {
  Reports as ReportsComponent,
  Props,
} from '../ComponentsLibrary/Reports';
import { PageWrapper } from '../PageWrapper/main';

export const Reports: FC<Props> = (props) => (
  <PageWrapper userID={props.loggedUserId}>
    <ReportsComponent {...props} />
  </PageWrapper>
);
