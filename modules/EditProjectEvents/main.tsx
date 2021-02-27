import React, { FC } from 'react';
import { EditProjectEvents as EditProjectComponent } from '../ComponentsLibrary/EditProjectEvents';
import { Props } from '../ComponentsLibrary/EditProject';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const EditProject: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <EditProjectComponent {...props} />
  </PageWrapper>
);
