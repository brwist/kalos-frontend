import React, { FC } from 'react';
import { SpiffTool } from '../SpiffToolLogs/components/SpiffTool';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  loggedUserId: number;
}

export const ToolLog: FC<Props> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <SpiffTool
      type="Tool"
      loggedUserId={props.loggedUserId}
      ownerId={props.loggedUserId}
      needsManagerAction={false}
      needsPayrollAction={false}
      needsAuditAction={false}
    />
  </PageWrapper>
);
