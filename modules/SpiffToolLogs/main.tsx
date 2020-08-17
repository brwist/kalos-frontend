import React, { FC } from 'react';
import { SpiffTool, Props } from './components/SpiffTool';
import { PageWrapper } from '../PageWrapper/main';

export const SpiffToolLogs: FC<Props> = (props) => (
  <PageWrapper userID={props.loggedUserId}>
    <SpiffTool {...props} />
  </PageWrapper>
);
