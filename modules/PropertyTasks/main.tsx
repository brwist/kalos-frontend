import React, { FC } from 'react';
import { Tasks } from '../ComponentsLibrary/Tasks';
import { PageWrapper } from '../PageWrapper/main';

interface Props {
  loggedUserId: number;
  propertyId: number;
}

export const PropertyTasks: FC<Props> = ({ propertyId, loggedUserId }) => (
  <PageWrapper userID={loggedUserId}>
    <Tasks
      externalCode="properties"
      externalId={propertyId}
      loggedUserId={loggedUserId}
    />
  </PageWrapper>
);
