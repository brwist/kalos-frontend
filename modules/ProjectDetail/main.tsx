import React, { FC } from 'react';
import {
  ProjectDetail as Details,
  Props,
} from '../ComponentsLibrary/ProjectDetail';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const ProjectDetail: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.userID}>
    <Details {...props} />
  </PageWrapper>
);
