import React, { FC } from 'react';
import {
  Projects as ProjectsComponent,
  Props,
} from '../ComponentsLibrary/Projects';
import { PageWrapper } from '../PageWrapper/main';

export const Projects: FC<Props> = (props) => (
  <PageWrapper userID={props.loggedUserId}>
    <ProjectsComponent {...props} />
  </PageWrapper>
);
