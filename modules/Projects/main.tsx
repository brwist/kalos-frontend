import React, { FC } from 'react';
import {
  Projects as ProjectsComponent,
  Props,
} from '../ComponentsLibrary/Projects';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const Projects: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <ProjectsComponent {...props} />
  </PageWrapper>
);
