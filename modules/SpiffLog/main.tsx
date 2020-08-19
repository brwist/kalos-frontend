import React, { FC } from 'react';
import { SpiffTool } from '../SpiffToolLogs/components/SpiffTool';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  loggedUserId: number;
}

export const SpiffLog: FC<Props> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <SpiffTool type="Spiff" {...props} />
  </PageWrapper>
);
