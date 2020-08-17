import React, { FC } from 'react';
import { SpiffTool } from '../SpiffToolLogs/components/SpiffTool';
import { PageWrapper } from '../PageWrapper/main';

interface Props {
  loggedUserId: number;
}

export const ToolLog: FC<Props> = (props) => (
  <PageWrapper userID={props.loggedUserId}>
    <SpiffTool type="Tool" {...props} />
  </PageWrapper>
);
