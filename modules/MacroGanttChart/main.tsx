import React, { FC } from 'react';
import { GanttChart, Props } from '../ComponentsLibrary/GanttChart';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const MacroGanttChart: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <GanttChart {...props} />
  </PageWrapper>
);
