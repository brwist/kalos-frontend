import React from 'react';
import { PageWrapper } from '../PageWrapper/main';
import {
  EditProject as EditProjectComponent,
  Props,
} from '../ComponentsLibrary/EditProject';

export const EditProject = (props: Props) => (
  <PageWrapper userID={props.loggedUserId}>
    <EditProjectComponent {...props} />
  </PageWrapper>
);
