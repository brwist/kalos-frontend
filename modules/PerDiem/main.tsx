import React, { FC } from 'react';
import { PerDiemComponent, Props } from '../ComponentsLibrary/PerDiem';
import { PageWrapper } from '../PageWrapper/main';

export const PerDiem: FC<Props> = (props) => (
  <PageWrapper userID={props.loggedUserId}>
    <PerDiemComponent {...props} />
  </PageWrapper>
);
