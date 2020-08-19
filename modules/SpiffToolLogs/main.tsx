import React, { FC } from 'react';
import { SpiffTool, Props } from './components/SpiffTool';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const SpiffToolLogs: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <SpiffTool {...props} />
  </PageWrapper>
);
