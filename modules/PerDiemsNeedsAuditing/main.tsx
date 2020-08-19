import React, { FC } from 'react';
import { PerDiemsNeedsAuditing as PerDiemsNeedsAuditingComponent } from '../ComponentsLibrary/PerDiemsNeedsAuditing';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props {
  userID: number;
}

export const PerDiemsNeedsAuditing: FC<Props & PageWrapperProps> = ({
  userID,
  ...props
}) => (
  <PageWrapper {...props} userID={userID}>
    <PerDiemsNeedsAuditingComponent />
  </PageWrapper>
);
