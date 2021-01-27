import React, { FC } from 'react';
import {
  Timesheet as TimesheetComponent,
  Props,
} from '../ComponentsLibrary/Timesheet';
import { PageWrapper } from '../PageWrapper/main';

export const Timesheet: FC<Props> = props => (
  <PageWrapper {...props} userID={props.userId} withHeader>
    <TimesheetComponent {...props} />
  </PageWrapper>
);
