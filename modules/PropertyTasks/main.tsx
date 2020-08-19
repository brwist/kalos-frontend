import React, { FC } from 'react';
import { Tasks } from '../ComponentsLibrary/Tasks';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  loggedUserId: number;
  propertyId: number;
}

export const PropertyTasks: FC<Props> = ({
  propertyId,
  loggedUserId,
  ...props
}) => (
  <PageWrapper {...props} userID={loggedUserId}>
    <Tasks
      externalCode="properties"
      externalId={propertyId}
      loggedUserId={loggedUserId}
    />
  </PageWrapper>
);
