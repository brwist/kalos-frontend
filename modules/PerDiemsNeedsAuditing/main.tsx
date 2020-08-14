import React, { FC } from 'react';
import { PerDiemsNeedsAuditing as PerDiemsNeedsAuditingComponent } from '../ComponentsLibrary/PerDiemsNeedsAuditing';
import { PageWrapper } from '../PageWrapper/main';

interface Props {
  userID: number;
}

export const PerDiemsNeedsAuditing: FC<Props> = ({ userID }) => (
  <PageWrapper userID={userID}>
    <PerDiemsNeedsAuditingComponent />
  </PageWrapper>
);
